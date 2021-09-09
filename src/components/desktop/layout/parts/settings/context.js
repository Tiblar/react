// @flow

import React from "react";

import history from "../../../../../util/history";

const SettingsStateContext = React.createContext();
const SettingsDispatchContext = React.createContext();

export const NAV = "NAV";

export const NAV_APPEARANCE = "NAV_APPEARANCE";
export const NAV_CONNECTIONS = "NAV_CONNECTIONS";
export const NAV_ACCOUNT = "NAV_ACCOUNT";
export const NAV_BLOCKED = "NAV_BLOCKED";
export const NAV_PRIVACY = "NAV_PRIVACY";
export const NAV_FINANCIALS = "NAV_FINANCIALS";
export const NAV_UPGRADE = "NAV_UPGRADE";

function settingsReducer(state, action) {
  switch (action.type) {
    case NAV: {
      return { ...state, nav: action.payload };
    }
    default: {
      return { ...state };
    }
  }
}

function SettingsProvider({ children }) {
  let nav = NAV_APPEARANCE;

  let query = new URLSearchParams(history.location.search).get("nav");
  if (typeof query != "undefined" && query !== null) {
    switch ("NAV_" + query.toUpperCase()) {
      case "NAV_APPEARANCE":
        nav = NAV_APPEARANCE;
        break;
      case "NAV_CONNECTIONS":
        nav = NAV_CONNECTIONS;
        break;
      case "NAV_ACCOUNT":
        nav = NAV_ACCOUNT;
        break;
      case "NAV_BLOCKED":
        nav = NAV_BLOCKED;
        break;
      case "NAV_PRIVACY":
        nav = NAV_PRIVACY;
        break;
      case "NAV_FINANCIALS":
        nav = NAV_FINANCIALS;
        break;
      case "NAV_UPGRADE":
        nav = NAV_UPGRADE;
        break;
      default:
        nav = NAV_APPEARANCE;
        break;
    }
  }

  const [state, dispatch] = React.useReducer(settingsReducer, {
    nav: nav
  });

  return (
    <SettingsStateContext.Provider value={state}>
      <SettingsDispatchContext.Provider value={dispatch}>
        {children}
      </SettingsDispatchContext.Provider>
    </SettingsStateContext.Provider>
  );
}

function useSettingsState() {
  const context = React.useContext(SettingsStateContext);
  if (context === undefined) {
    throw new Error("useSettingsState must be used within a LayerProvider");
  }
  return context;
}

function useSettingsDispatch() {
  const context = React.useContext(SettingsDispatchContext);
  if (context === undefined) {
    throw new Error("useSettingsDispatch must be used within a LayerProvider");
  }
  return context;
}

export { SettingsProvider, useSettingsState, useSettingsDispatch };
