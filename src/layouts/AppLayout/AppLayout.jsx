import React, { useMemo } from "react";
import { compose } from "recompose";
import { ThemeProvider, createMuiTheme, StylesProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import themeData from "../../services/theme";
import ErrorAlert from "../../components/Alerts/ErrorAlert";
import SuccessAlert from "../../components/Alerts/SuccessAlert";
import useStoreSettingsSelector from "../../hooks/useStoreSettingsSelector";
import withPageContext from "../../pageContext/withPageContext";
import Loader from "../../components/Loader";
import useStoreUILoaderSelector from "../../hooks/useStoreUILoaderSelector";

/**
 * @typedef {Object} PrivateAreaLayoutProps
 * @property {Object} children
 */

/**
 * Default component props.
 *
 * @param {PrivateAreaLayoutProps} props Default component props.
 * @returns {JSX.Element} Component.
 */
const AppLayout = (props) => {
  const { children } = props;
  const storeSettings = useStoreSettingsSelector();
  const storeLoader = useStoreUILoaderSelector();
  const options = themeData(storeSettings.darkStyle);
  const createTheme = () => createMuiTheme(options);
  const theme = useMemo(createTheme, [storeSettings.darkStyle]);

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorAlert />
        <SuccessAlert />
        {storeLoader && <Loader />}
        {children}
      </ThemeProvider>
    </StylesProvider>
  );
};

export default compose(withPageContext)(AppLayout);