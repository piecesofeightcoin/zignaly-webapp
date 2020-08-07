import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import { useSelector } from "react-redux";
import useQuoteAssets from "./useQuoteAssets";
import useDashboardAnalyticsTimeframeOptions from "./useDashboardAnalyticsTimeframeOptions";
import { showErrorAlert } from "../store/actions/ui";
import { useDispatch } from "react-redux";
import useReadOnlyProviders from "./useReadOnlyProviders";
import { useIntl } from "react-intl";

/**
 * @typedef {import("../store/initialState").DefaultState} DefaultStateType
 * @typedef {import("../store/initialState").DefaultStateSession} StateSessionType
 * @typedef {import("../services/tradeApiClient.types").ProfileStatsObject} ProfileStatsObject
 * @typedef {import("../components/CustomSelect/CustomSelect").OptionType} OptionType
 */

/**
 * @typedef {Object} ProviderStatsData
 * @property {Array<ProfileStatsObject>} stats
 * @property {string} timeFrame
 * @property {Array<OptionType>} timeFrames
 * @property {function} setTimeFrame
 * @property {string} quote
 * @property {Array<string>} quotes
 * @property {function} setQuote
 * @property {string} provider
 * @property {Array<OptionType>} providers
 * @property {function} setProvider
 * @property {function} clearFilters
 * @property {Boolean} loading
 */

/**
 * Hook to generate the profile profit stats fetching and filtering.
 *
 * @returns {ProviderStatsData} Profile profit stats and filtering objects.
 */
const useDashboardAnalytics = () => {
  /**
   * Select store session data.
   *
   * @param {DefaultStateType} state Application store data.
   * @returns {StateSessionType} Store session data.
   */
  const selectStoreSession = (state) => state.session;
  const storeSession = useSelector(selectStoreSession);
  const [stats, setStats] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

  // time frames
  const timeFrames = useDashboardAnalyticsTimeframeOptions();
  const [timeFrame, setTimeFrame] = useState("3");

  // quotes
  const quoteAssets = useQuoteAssets();
  const quotes = Object.keys(quoteAssets);
  const [quote, setQuote] = useState("USDT");

  const providerAssets = useReadOnlyProviders();
  const [provider, setProvider] = useState({
    val: "1",
    label: intl.formatMessage({ id: "fil.manual" }),
  });

  let providers = providerAssets.map((item) => ({
    val: item.id,
    label: item.name,
  }));

  providers.push({ val: "1", label: intl.formatMessage({ id: "fil.manual" }) });
  providers.push({ val: "all", label: intl.formatMessage({ id: "fil.providers.all" }) });

  const clearFilters = () => {
    setQuote("USDT");
    setTimeFrame("60");
  };

  const loadDashboardStats = () => {
    setLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      ro: true,
      quote,
      timeFrame,
      includeOpenPositions: true,
      providerId: provider.val,
      timeFrameFormat: "lastXDays",
    };
    tradeApi
      .profileStatsGet(payload)
      .then((responseData) => {
        setStats(responseData);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Load stats at init and on filters change
  useEffect(loadDashboardStats, [timeFrame, quote, provider, storeSession.tradeApi.accessToken]);

  return {
    stats,
    timeFrames,
    timeFrame,
    setTimeFrame,
    quotes,
    quote,
    setQuote,
    provider,
    providers,
    setProvider,
    clearFilters,
    loading,
  };
};

export default useDashboardAnalytics;
