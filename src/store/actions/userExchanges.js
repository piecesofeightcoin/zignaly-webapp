import tradeApi from "../../services/tradeApiClient";
const ADD_USER_EXCHNAGES = "ADD_USER_EXCHNAGES_ACTION";
const REMOVE_USER_EXCHNAGES = "REMOVE_USER_EXCHNAGES_ACTION";

/**
 *
 * @typedef {import('../../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import('../../services/tradeApiClient.types').UserLoginResponse} UserLoginResponse
 * @typedef {import('redux').Dispatch} Dispatch
 */

/**
 * Dark style flag selected by user.
 *
 * @param {UserLoginResponse} data
 * @param {Function} hideLoading
 */

export const setUserExchanges = (data, hideLoading) => {
  return async (dispatch) => {
    try {
      const sessionPayload = {
        token: data.token,
      };
      const responseData = await tradeApi.userExchangesGet(sessionPayload);
      hideLoading();
      dispatch({
        type: ADD_USER_EXCHNAGES,
        payload: responseData,
      });
    } catch (e) {
      // TODO: Display error in alert.
      hideLoading();
    }
  };
};

export const unsetUserExchanges = () => {
  return {
    type: REMOVE_USER_EXCHNAGES,
  };
};
