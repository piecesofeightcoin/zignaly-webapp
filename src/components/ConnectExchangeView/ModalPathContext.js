import React from "react";

const ModalPathContext = React.createContext({
  previousPath: "",
  setPreviousPath: () => {},
  setPathParams: () => {},
  resetToPath: () => {},
  setTitle: () => {},
  pathParams: {},
  currentPath: "",
  formRef: {},
});

export default ModalPathContext;
