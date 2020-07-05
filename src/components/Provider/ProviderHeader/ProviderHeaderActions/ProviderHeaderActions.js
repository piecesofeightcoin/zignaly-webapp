import React from "react";
import "./ProviderHeaderActions.scss";
import { Box, Typography } from "@material-ui/core";
import useStoreViewsSelector from "../../../../hooks/useStoreViewsSelector";
import PaymentButton from "../PaymentButton";
import TrialPeriod from "./TrialPeriod";
import { FormattedMessage } from "react-intl";
import FollowProviderButton from "../FollowProviderButton";
import ProviderLogo from "../ProviderLogo/";

/**
 * Provides the navigation bar for the dashboard.
 *
 * @returns {JSX.Element} Component JSX.
 */
const ProviderHeaderActions = () => {
  const storeViews = useStoreViewsSelector();

  return (
    <Box
      alignItems="center"
      className="providerHeaderActions"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
    >
      <Box
        alignItems="center"
        className="titleBox"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
      >
        <ProviderLogo
          size="40px"
          title={storeViews.provider.name}
          url={storeViews.provider.logoUrl}
        />
        <Typography variant="h1">{storeViews.provider.name}</Typography>
      </Box>
      <FollowProviderButton provider={storeViews.provider} />

      {storeViews.provider.internalPaymentInfo && <TrialPeriod provider={storeViews.provider} />}

      <Typography variant="h4">
        <FormattedMessage id="copyt.copiers" />
        <b>{storeViews.provider.followers} </b>
      </Typography>

      <Typography variant="h4">
        <FormattedMessage id="srv.edit.price" />
        <b>{`$${storeViews.provider.price}/Month`}</b>
      </Typography>

      {storeViews.provider.internalPaymentInfo && <PaymentButton provider={storeViews.provider} />}
    </Box>
  );
};

export default ProviderHeaderActions;
