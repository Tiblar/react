// @flow

import React from "react";
import {POST_TEXT} from "../../../../../../util/constants";
import createActions from "./context/actions";
import manageReducer from "./context/reducer";

const ManageStateContext = React.createContext();
const ManageDispatchContext = React.createContext();
const ManageActionsContext = React.createContext();

export const UPDATE_FILES = "UPDATE_FILES";
export const UPDATE_LARGE_FILES = "UPDATE_LARGE_FILES";
export const UPDATE_LARGE_FILE_STATUS = "UPDATE_LARGE_FILE_STATUS";
export const UPDATE_LARGE_FILE_PART = "UPDATE_LARGE_FILE_PART";
export const UPDATE_LARGE_FILE_TOTAL = "UPDATE_LARGE_FILE_TOTAL";
export const UPDATE_POLL_QUESTION = "UPDATE_POLL_QUESTION";
export const UPDATE_POLL_OPTION = "UPDATE_POLL_OPTION";
export const UPDATE_POST_TYPE = "UPDATE_POST_TYPE";
export const UPDATE_SHAKE = "UPDATE_SHAKE";
export const UPDATE_ERROR = "UPDATE_ERROR";
export const UPDATE_MAGNET = "UPDATE_MAGNET";
export const UPDATE_SIZE_ERROR = "UPDATE_SIZE_ERROR";
export const UPDATE_BOOSTED = "UPDATE_BOOSTED";

function ManageProvider({ children }) {
  const [state, dispatch] = React.useReducer(manageReducer, {
    files: [],
    largeFiles: [],
    largeFileStatus: null,
    largeFilePart: 0,
    largeFileTotal: 0,
    poll: {
      question: "",
      options: {
        1: "",
        2: "",
        3: "",
        4: "",
      }
    },
    magnet: "",
    type: POST_TEXT,
    shake: false,
    sizeError: null,
    error: null,
    isBoosted: false,
  });

  const actions = createActions(dispatch, state);

  return (
    <ManageStateContext.Provider value={state}>
      <ManageDispatchContext.Provider value={dispatch}>
        <ManageActionsContext.Provider value={actions}>
          {children}
        </ManageActionsContext.Provider>
      </ManageDispatchContext.Provider>
    </ManageStateContext.Provider>
  );
}

function useManageState() {
  const context = React.useContext(ManageStateContext);
  if (context === undefined) {
    throw new Error("useManageState must be used within a ManageProvider");
  }
  return context;
}

function useManageDispatch() {
  const context = React.useContext(ManageDispatchContext);
  if (context === undefined) {
    throw new Error("useManageDispatch must be used within a ManageProvider");
  }
  return context;
}

function useManageActions() {
  const context = React.useContext(ManageActionsContext);
  if (context === undefined) {
    throw new Error("useManageActions must be used within a ManageProvider");
  }
  return context;
}

export { ManageProvider, useManageState, useManageDispatch, useManageActions };
