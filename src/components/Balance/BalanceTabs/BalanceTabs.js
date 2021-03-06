import React, { useState } from "react";
import { Box } from "@material-ui/core";
import TabsMenu from "../../TabsMenu";
import "./BalanceTabs.scss";
import History from "../History";
import Coins from "../Coins";
import { FormattedMessage } from "react-intl";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";

/**
 * @typedef {import("../../../services/tradeApiClient.types").DefaultDailyBalanceEntity} DefaultDailyBalanceEntity
 * @typedef {import("../../../services/tradeApiClient.types").UserBalanceEntity} UserBalanceEntity
 * @typedef {Object} DefaultProps
 * @property {DefaultDailyBalanceEntity} dailyBalance Daily balance.
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const BalanceTabs = ({ dailyBalance }) => {
  const [tabValue, setTabValue] = useState(0);
  const storeSettings = useStoreSettingsSelector();

  /**
   * Event handler to change tab value.
   *
   * @param {React.ChangeEvent<{checked: boolean}>} event Tab index to set active.
   * @param {Number} val Tab index to set active.
   * @returns {void}
   */
  const changeTab = (event, val) => {
    setTabValue(val);
  };

  const checkCoinsDisplay = () => {
    if (
      storeSettings.selectedExchange.exchangeName &&
      storeSettings.selectedExchange.exchangeName.toLowerCase() === "zignaly"
    ) {
      return true;
    }
    return false;
  };

  const tabsList = [
    {
      display: true,
      label: <FormattedMessage id="dashboard.balance.historical" />,
    },
    {
      display: checkCoinsDisplay(),
      label: <FormattedMessage id="dashboard.balance.coins" />,
    },
  ];

  return (
    <Box bgcolor="grid.content" className="balanceTabs">
      <Box
        alignItems="flex-start"
        className="tabsBox"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <TabsMenu changeTab={changeTab} tabValue={tabValue} tabs={tabsList} />
        {tabValue === 0 && (
          <Box className="tabPanel">
            <History dailyBalance={dailyBalance} />
          </Box>
        )}
        {tabValue === 1 && (
          <Box className="tabPanel">
            <Coins />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BalanceTabs;
