import React, { useState, useRef, useReducer } from "react";
import "./ConnectExchangeView.scss";
import { Box, Typography } from "@material-ui/core";
import CustomButton from "../CustomButton";
import SubNavHeader from "../SubNavHeader";
import { FormattedMessage } from "react-intl";
import ConnectExchangeViewContent from "./ConnectExchangeViewContent";
import ModalPathContext from "./ModalPathContext";

/**
 * @typedef {Object} DefaultProps
 * @property {Function} onClose
 */

/**
 * Connect exchange component.
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Connect exchange element.
 */
const ConnectExchangeView = (props) => {
  const [path, setPath] = useState("realAccounts");
  const [isLoading, setIsLoading] = useState(false);
  //   const formRef = useRef(null);
  //   const [state, dispatch] = useReducer({});
  //   const ModalPathContext = React.createContext({});

  /**
   * Handle submit buttton click.
   *
   * @type {React.MouseEventHandler} handleClickSubmit
   * @returns {void}
   */
  const handleClick = () => {
    setIsLoading(true);
    // console.log(formRef);
    window.dispatchEvent(new Event("submit"));
    // props.onClose();
  };

  //   const [previousPath, setPreviousPath] = useState("");
  const [pathParams, setPathParams] = useState({
    currentPath: "realAccounts",
  });

  const navigateToPath = (path, selectedAccount) => {
    setPathParams({
      currentPath: path,
      previousPath: pathParams.currentPath,
      selectedAccount,
    });
  };
  const resetPath = (path) => {
    setPathParams({
      currentPath: path,
    });
  };
  const value = { pathParams, setPathParams, navigateToPath, resetPath };

  //   const navigateToPath = (path, selectedAccount) => {
  //     setState({
  //       ...state,
  //       pathParams: {
  //         currentPath: path,
  //         previousPath: state.pathParams.currentPath,
  //         selectedAccount,
  //       },
  //     });
  //   };

  //   const resetToPath = (path) => {
  //     setState({
  //       ...state,
  //       pathParams: {
  //         currentPath: path,
  //       },
  //     });
  //   };

  //   const initState = {
  //     language: "en",
  //     setLanguage: setLanguage,
  //   };

  //   const [state, setState] = useState(initState);

  const tabs = [
    {
      id: "accounts.real",
      onClick: () => {
        resetPath("realAccounts");
      },
    },
    {
      id: "accounts.demo",
      onClick: () => {
        resetPath("demoAccounts");
      },
    },
  ];

  return (
    <ModalPathContext.Provider value={value}>
      <Box
        alignItems="center"
        className="connectExchangeView"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Box className="actionBar">
          {pathParams.previousPath && (
            <CustomButton
              className="submitButton"
              onClick={() => resetPath(pathParams.previousPath)}
            >
              <FormattedMessage id="accounts.back" />
            </CustomButton>
          )}
          <CustomButton className="submitButton" onClick={handleClick} loading={isLoading}>
            <FormattedMessage id="accounts.done" />
          </CustomButton>
        </Box>
        <Box className="titleBar">
          <Typography variant="h1">
            <FormattedMessage id="dashboard.connectexchange.bold.title" />
          </Typography>
        </Box>
        <SubNavHeader links={tabs} />
        <ConnectExchangeViewContent />
      </Box>
    </ModalPathContext.Provider>
  );
};

export default ConnectExchangeView;
