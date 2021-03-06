import { useState } from "react";
import { isNumber, isString, isObject } from "lodash";
import { formatPrice } from "../utils/formatters";

/**
 * @typedef {Object} TradingTerminalHook
 * @property {function} instantiateWidget
 * @property {number} lastPrice
 * @property {function} setLastPrice
 * @property {function} setTradingViewWidget
 * @property {any} tradingViewWidget
 */

/**
 * @typedef {any} TVWidget
 */

/**
 * Trading terminal handlers and state control hook.
 *
 * We skip the definition of Trading View types due to the typedefs are part of
 * private repository that have publication restrictions incompatible with open
 * source.
 *
 * @returns {TradingTerminalHook} Trading View hook object.
 */
const useTradingTerminal = () => {
  const [tradingViewWidget, setTradingViewWidget] = useState(/** @type {TVWidget} */ null);
  const [lastPrice, setLastPrice] = useState(null);

  /**
   * Instantiate trading view widget and initialize price.
   *
   * @param {any} widgetOptions Trading view widget options.
   * @return {Function} Widget cleanup function.
   */
  const instantiateWidget = (widgetOptions) => {
    // @ts-ignore
    // eslint-disable-next-line new-cap
    const externalWidget = new window.TradingView.widget(widgetOptions);
    let eventSymbol = "";

    // @ts-ignore
    const handleWidgetReady = (event) => {
      if (isString(event.data)) {
        try {
          const dataRaw = /** @type {Object<string, any>} */ event.data;
          const dataParsed = JSON.parse(dataRaw);

          // @ts-ignore
          if (dataParsed.name === "widgetReady" && externalWidget.postMessage) {
            setTradingViewWidget(externalWidget);
          }

          if (dataParsed.name === "quoteUpdate" && dataParsed.data) {
            if (eventSymbol !== dataParsed.data.original_name) {
              const receivedPrice = isNumber(dataParsed.data.last_price)
                ? formatPrice(dataParsed.data.last_price, "", "")
                : dataParsed.data.last_price;
              setLastPrice(receivedPrice);
              eventSymbol = dataParsed.data.original_name;
            }
          }
        } catch (e) {
          // Not a valid JSON, skip event.
          return;
        }
      }

      // Symbol data not found by Trading View widget.
      if (isObject(event.data) && event.data.name === "tv-widget-no-data") {
        setTradingViewWidget(externalWidget);
        setLastPrice(null);
      }
    };

    window.addEventListener("message", handleWidgetReady);

    const cleanupWidget = () => {
      if (tradingViewWidget) {
        tradingViewWidget.remove();
        setTradingViewWidget(null);
        window.removeEventListener("message", handleWidgetReady);
      }
    };

    return cleanupWidget;
  };

  return {
    instantiateWidget,
    lastPrice,
    setLastPrice,
    setTradingViewWidget,
    tradingViewWidget,
  };
};

export default useTradingTerminal;
