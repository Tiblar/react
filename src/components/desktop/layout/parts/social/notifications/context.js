// @flow

import React from "react";

const AccountCenterStateContext = React.createContext();
const AccountCenterDispatchContext = React.createContext();

export const UPDATE_NAV_NOTIFICATIONS = "UPDATE_NAV_NOTIFICATIONS";
export const UPDATE_NAV_BILLING = "UPDATE_NAV_BILLING";

export const UPDATE_SCROLLING = "UPDATE_SCROLLING";

export const NAV_NOTIFICATIONS = "NAV_NOTIFICATIONS";
export const NAV_REQUESTS = "NAV_REQUESTS";
export const NAV_BILLING_INCOMING = "NAV_BILLING_INCOMING";
export const NAV_BILLING_OUTGOING = "NAV_BILLING_OUTGOING";

function accountCenterReducer(state, action) {
  switch (action.type) {
    case UPDATE_NAV_NOTIFICATIONS:
      return {
        ...state,
        nav: {
          ...state.nav,
          notification: action.payload,
        }
      };
    case UPDATE_NAV_BILLING:
      return {
        ...state,
        nav: {
          ...state.nav,
          billing: action.payload,
        }
      };
    case UPDATE_SCROLLING:
      return {
        ...state,
        scrolling: action.payload,
      };
    default: {
      return { ...state };
    }
  }
}

function AccountCenterProvider({ children }) {
  const [state, dispatch] = React.useReducer(accountCenterReducer, {
    nav: {
      notification: NAV_NOTIFICATIONS,
      billing: NAV_BILLING_OUTGOING,
    },
    scrolling: true,
  });

  return (
    <AccountCenterStateContext.Provider value={state}>
      <AccountCenterDispatchContext.Provider value={dispatch}>
        {children}
      </AccountCenterDispatchContext.Provider>
    </AccountCenterStateContext.Provider>
  );
}

function useAccountCenterContextState() {
  const context = React.useContext(AccountCenterStateContext);
  if (context === undefined) {
    throw new Error("useAccountCenterContextState must be used within a AccountCenterProvider");
  }
  return context;
}

function useAccountCenterContextDispatch() {
  const context = React.useContext(AccountCenterDispatchContext);
  if (context === undefined) {
    throw new Error("useAccountCenterContextDispatch must be used within a AccountCenterProvider");
  }
  return context;
}

export { AccountCenterProvider, useAccountCenterContextState, useAccountCenterContextDispatch };
