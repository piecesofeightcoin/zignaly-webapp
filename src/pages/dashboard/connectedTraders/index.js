import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import "./connectedTraders.scss";
import { Box, Typography } from "@material-ui/core";
import { compose } from "recompose";
import withDashboardLayout from "../../../layouts/dashboardLayout";
import { Helmet } from "react-helmet";
import useProvidersList from "../../../hooks/useProvidersList";

const ConnectedTraders = () => {
  const intl = useIntl();

  const providersOptions = { copyTradersOnly: false, connectedOnly: true, showSummary: true };
  const [, provComponents] = useProvidersList(providersOptions, {});
  const { ProvidersList, TimeFrameSelect } = provComponents;

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: "dashboard.traders" })}</title>
      </Helmet>
      <Box
        className="connectedTradersPage"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <Box className="headlineBox">
          <Typography variant="h4">
            <FormattedMessage id="dashboard.traders.copying" />
          </Typography>
          <Box alignItems="center" display="flex" flexDirection="row" justifyContent="flex-end">
            <TimeFrameSelect />
          </Box>
        </Box>
        <Box
          alignItems="center"
          className="tradersBox"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="flex-start"
        >
          <ProvidersList />
        </Box>
      </Box>
    </>
  );
};

export default compose(withDashboardLayout)(ConnectedTraders);
