import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import tradeApi from "../../../services/tradeApiClient";
import {
  createWidgetOptions,
  mapExchangeConnectionToTradingViewId,
} from "../../../tradingView/dataFeedOptions";
import StrategyForm from "../StrategyForm/StrategyForm";
import { Box, CircularProgress } from "@material-ui/core";
import TradingViewHeader from "./TradingViewHeader";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import { useStoreUserSelector } from "../../../hooks/useStoreUserSelector";
import { showErrorAlert } from "../../../store/actions/ui";
import ConnectExchange from "../../Modal/ConnectExchange";
import useTradingTerminal from "../../../hooks/useTradingTerminal";
import "./TradingView.scss";

/**
 * @typedef {any} TVWidget
 */

/**
 * @type {Object<string, string>}
 */
const defaultExchangeSymbol = {
  KuCoin: "BTC/USDT",
  Binance: "BTC/USDT",
  Zignaly: "BTC/USDT",
  fallback: "BTC/USDT",
};

/**
 * Trading terminal component.
 *
 * @returns {JSX.Element} Trading terminal element.
 */
const TradingView = () => {
  const [libraryReady, setLibraryReady] = useState(false);
  const {
    instantiateWidget,
    lastPrice,
    setLastPrice,
    setTradingViewWidget,
    tradingViewWidget,
  } = useTradingTerminal();
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();
  const [marketData, setMarketData] = useState(null);
  const dispatch = useDispatch();

  const getMarketData = async () => {
    const marketDataPayload = {
      token: storeSession.tradeApi.accessToken,
      exchangeInternalId: storeSettings.selectedExchange.internalId,
    };

    try {
      const data = await tradeApi.exchangeConnectionMarketDataGet(marketDataPayload);
      setMarketData(data);
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };

  /**
   * Resolve exchange name from selected exchange.
   *
   * @returns {string} Exchange name.
   */
  const resolveExchangeName = () => {
    return storeSettings.selectedExchange.exchangeName || storeSettings.selectedExchange.name;
  };

  /**
   * Resolve last selected or default symbol for selected exchange.
   *
   * In case of not default symbol for the exchange resolves BTCUSDT.
   *
   * @returns {string} Symbol ID.
   */
  const resolveDefaultSymbol = () => {
    return (
      storeSettings.tradingTerminal.pair[storeSettings.selectedExchange.exchangeId] ||
      defaultExchangeSymbol[exchangeName] ||
      defaultExchangeSymbol.fallback
    );
  };

  const exchangeName = resolveExchangeName();
  const defaultSymbol = resolveDefaultSymbol();
  const [selectedSymbol, setSelectedSymbol] = useState(defaultSymbol);
  const [selectedExchangeId, setSelectedExchangeId] = useState(
    storeSettings.selectedExchange.internalId,
  );
  // const dataFeed = useCoinRayDataFeedFactory(selectedSymbol);
  const isLoading = tradingViewWidget === null || marketData === null;
  const isLastPriceLoading = lastPrice === null;

  const onExchangeChange = () => {
    if (selectedExchangeId !== storeSettings.selectedExchange.internalId) {
      const newExchangeName =
        storeSettings.selectedExchange.exchangeName || storeSettings.selectedExchange.name;
      const newDefaultSymbol =
        defaultExchangeSymbol[newExchangeName] || defaultExchangeSymbol.fallback;
      if (tradingViewWidget) {
        tradingViewWidget.remove();
        setTradingViewWidget(null);
        setLastPrice(null);
        setSelectedSymbol(newDefaultSymbol);
        bootstrapWidget();
      }

      setSelectedExchangeId(storeSettings.selectedExchange.internalId);
    }
  };

  useEffect(onExchangeChange, [storeSettings.selectedExchange.internalId]);

  const loadDependencies = () => {
    setMarketData(null);
    getMarketData();

    const checkExist = setInterval(() => {
      // @ts-ignore
      if (window.TradingView && window.TradingView.widget) {
        setLibraryReady(true);
        clearInterval(checkExist);
      }
    }, 100);
  };

  useEffect(loadDependencies, [storeSettings.selectedExchange.internalId]);

  const bootstrapWidget = () => {
    // Skip if TV widget already exists or TV library is not ready.
    if (!libraryReady || tradingViewWidget) {
      return () => {};
    }

    const widgetOptions = createWidgetOptions(
      exchangeName,
      selectedSymbol,
      storeSettings.darkStyle,
    );

    const cleanupWidget = instantiateWidget(widgetOptions);
    return () => {
      cleanupWidget();
    };
  };

  // Create Trading View widget when TV external library is ready.
  useEffect(bootstrapWidget, [libraryReady, tradingViewWidget]);

  const changeTheme = () => {
    const reloadWidget = () => {
      tradingViewWidget.remove();
      setTradingViewWidget(null);
      bootstrapWidget();
    };

    if (tradingViewWidget) {
      const options = tradingViewWidget.options;
      if (storeSettings.darkStyle && options.theme !== "dark") {
        reloadWidget();
      }

      if (!storeSettings.darkStyle && options.theme !== "light") {
        reloadWidget();
      }
    }
  };
  useEffect(changeTheme, [storeSettings.darkStyle]);

  // Force initial price notification.
  const initDataFeedSymbol = () => {
    const checkExist = setInterval(() => {
      if (tradingViewWidget && tradingViewWidget.iframe && tradingViewWidget.iframe.contentWindow) {
        handleSymbolChange(defaultSymbol);
        clearInterval(checkExist);
      }
    }, 100);
  };
  useEffect(initDataFeedSymbol, [tradingViewWidget]);

  /**
   * @typedef {Object} OptionValue
   * @property {string} label
   * @property {string} value
   */

  /**
   * Change selected symbol.
   *
   * @param {string} selectedOption Selected symbol option object.
   * @returns {Void} None.
   */
  const handleSymbolChange = (selectedOption) => {
    setSelectedSymbol(selectedOption);
    // setTerminalPair(selectedOption);
    const symbolSuffix =
      storeSettings.selectedExchange.exchangeType.toLocaleLowerCase() === "futures" ? "PERP" : "";
    const symbolCode = selectedOption.replace("/", "") + symbolSuffix;
    const exchangeId = mapExchangeConnectionToTradingViewId(exchangeName);

    if (tradingViewWidget && tradingViewWidget.iframe) {
      tradingViewWidget.iframe.contentWindow.postMessage(
        { name: "set-symbol", data: { symbol: `${exchangeId}:${symbolCode}` } },
        "*",
      );
    }
  };

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      entryType: "LONG",
      leverage: 1,
      positionSize: "",
      realInvestment: "",
      stopLossPrice: "",
      trailingStopPrice: "",
      units: "",
      dcaTargetPricePercentage1: "",
    },
  });

  return (
    <>
      <FormProvider {...methods}>
        <Box className="tradingTerminal" display="flex" flexDirection="column" width={1}>
          {!isLoading && (
            <TradingViewHeader
              handleSymbolChange={handleSymbolChange}
              selectedSymbol={selectedSymbol}
              symbolsList={marketData}
            />
          )}
          <Box
            className="tradingViewContainer"
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            width={1}
          >
            {isLoading && (
              <Box
                className="loadProgress"
                display="flex"
                flexDirection="row"
                justifyContent="center"
              >
                <CircularProgress disableShrink />
              </Box>
            )}
            <Box className="tradingViewChart" id="trading_view_chart" />
            {!isLoading && !isLastPriceLoading && lastPrice && (
              <StrategyForm
                lastPrice={lastPrice}
                selectedSymbol={selectedSymbol}
                symbolsData={marketData}
                tradingViewWidget={tradingViewWidget}
              />
            )}
          </Box>
        </Box>
      </FormProvider>
    </>
  );
};

const TradingViewWrapper = () => {
  const storeSettings = useStoreSettingsSelector();
  const storeUser = useStoreUserSelector();

  if (!storeUser.loaded) {
    return (
      <Box
        alignItems="center"
        className="loadingBox"
        display="flex"
        flexDirection="row"
        justifyContent="center"
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (!storeSettings.selectedExchange.internalId) {
    return <ConnectExchange />;
  }

  return <TradingView />;
};

export default React.memo(TradingViewWrapper);
