// @flow

import React from "react";

const AccountStateContext = React.createContext();
const AccountDispatchContext = React.createContext();

export const UPDATE_USERNAME = "UPDATE_USERNAME";
export const UPDATE_EMAIL = "UPDATE_EMAIL";
export const UPDATE_PASSWORD = "UPDATE_PASSWORD";
export const SWITCH_EDITING = "SWITCH_EDITING";
export const SWITCH_SAVING = "SWITCH_SAVING";
export const SWITCH_EDITING_PASSWORD = "SWITCH_EDITING_PASSWORD";
export const UPDATE_OLD_PASSWORD = "UPDATE_OLD_PASSWORD";
export const UPDATE_NEW_PASSWORD = "UPDATE_NEW_PASSWORD";

function accountReducer(state, action) {
  switch (action.type) {
    case UPDATE_USERNAME:
      return {
        ...state,
        username: {
          ...state.username,
          ...action.payload,
        }
      };
    case UPDATE_EMAIL:
      return {
        ...state,
        email: {
          ...state.email,
          ...action.payload,
        }
      };
    case UPDATE_PASSWORD:
      return {
        ...state,
        password: {
          ...state.password,
          ...action.payload,
        }
      };
    case SWITCH_EDITING:
      let editing = typeof action.payload === "boolean" ? action.payload : !state.editing;
      return {
        ...state,
        editing: editing
      };
    case SWITCH_SAVING:
      let saving = typeof action.payload === "boolean" ? action.payload : !state.saving;
      return {
        ...state,
        saving: saving
      };
    case SWITCH_EDITING_PASSWORD:
      let editingPassword = typeof action.payload === "boolean" ? action.payload : !state.editingPassword;
      return {
        ...state,
        editingPassword: editingPassword
      };
    case UPDATE_OLD_PASSWORD:
      return {
        ...state,
        oldPassword: {
          ...state.oldPassword,
          ...action.payload,
        }
      };
    case UPDATE_NEW_PASSWORD:
      return {
        ...state,
        newPassword: {
          ...state.newPassword,
          ...action.payload,
        }
      };
    default: {
      return { ...state };
    }
  }
}

function AccountProvider({ children }) {
  const [state, dispatch] = React.useReducer(accountReducer, {
    username: {
      value: "",
      updated: new Date(),
      error: null,
    },
    email: {
      value: "",
      updated: new Date(),
      error: null,
    },
    password: {
      value: "",
      error: null,
    },
    editing: false,
    saving: false,
    editingPassword: false,
    oldPassword: {
      value: "",
      error: null,
    },
    newPassword: {
      value: "",
      error: null,
    }
  });

  return (
      <AccountStateContext.Provider value={state}>
        <AccountDispatchContext.Provider value={dispatch}>
          {children}
        </AccountDispatchContext.Provider>
      </AccountStateContext.Provider>
  );
}

function useAccountState() {
  const context = React.useContext(AccountStateContext);
  if (context === undefined) {
    throw new Error("useAccountState must be used within an AccountProvider");
  }
  return context;
}

function useAccountDispatch() {
  const context = React.useContext(AccountDispatchContext);
  if (context === undefined) {
    throw new Error("useAccountDispatch must be used within an AccountProvider");
  }
  return context;
}

export { AccountProvider, useAccountState, useAccountDispatch };
