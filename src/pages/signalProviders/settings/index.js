import React, { useState, useEffect } from "react";
import "./settings.scss";
import { Box, CircularProgress } from "@material-ui/core";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";
import ProviderSettingsForm from "../../../components/Forms/ProviderSettingsForm";
import { creatEmptySettingsEntity } from "../../../services/tradeApiClient.types";
import useQuoteAssets from "../../../hooks/useQuoteAssets";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import NoSettingsView from "../../../components/Provider/Settings/NoSettingsView";

const SignalProvidersSettings = () => {
  const storeSettings = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();
  const storeViews = useStoreViewsSelector();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const emptySettings = creatEmptySettingsEntity();
  const [settings, setSettings] = useState(emptySettings);
  const [settingsView, setSettingsView] = useState(false);
  const quotes = useQuoteAssets();
  const intl = useIntl();

  const loadSettings = () => {
    if (
      storeViews.provider.id &&
      storeViews.provider.exchangeInternalId === storeSettings.selectedExchange.internalId
    ) {
      setLoading(true);
      const payload = {
        token: storeSession.tradeApi.accessToken,
        providerId: storeViews.provider.id,
        internalExchangeId: storeSettings.selectedExchange.internalId,
        version: 2,
      };
      tradeApi
        .providerExchangeSettingsGet(payload)
        .then((response) => {
          setSettings(response);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(loadSettings, [storeSettings.selectedExchange.internalId, storeViews.provider.id]);

  const matchExchange = () => {
    if (storeViews.provider.exchangeInternalId === storeSettings.selectedExchange.internalId) {
      setSettingsView(true);
    } else {
      setSettingsView(false);
    }
  };

  useEffect(matchExchange, [storeSettings.selectedExchange.internalId]);

  return (
    <Box className="profileSettingsPage">
      <Helmet>
        <title>
          {`${storeViews.provider.name} - ${intl.formatMessage({
            id: "srv.settings",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
      </Helmet>
      {loading && (
        <Box
          alignItems="center"
          bgcolor="grid.content"
          className="loadingBox"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <CircularProgress color="primary" size={40} />
        </Box>
      )}
      {!loading && settingsView && (
        <ProviderSettingsForm onUpdate={loadSettings} quotes={quotes} settings={settings} />
      )}

      {!loading && !settingsView && <NoSettingsView />}
    </Box>
  );
};

export default SignalProvidersSettings;
