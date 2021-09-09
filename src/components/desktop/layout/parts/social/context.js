// @flow

import React from "react";

const SocialStateContext = React.createContext();
const SocialDispatchContext = React.createContext();

export const CREATE_POST = "CREATE_POST";
export const REBLOG_POST = "REBLOG_POST";

function socialReducer(state, action) {
  switch (action.type) {
    case CREATE_POST:
      return { ...state, createPost: action.payload, reblogPost: null };
    case REBLOG_POST:
      return { ...state, createPost: true, reblogPost: action.payload };
    default: {
      return { ...state };
    }
  }
}

function SocialProvider({ children }) {
  const [state, dispatch] = React.useReducer(socialReducer, {
    createPost: false,
    reblogPost: null,
  });

  return (
    <SocialStateContext.Provider value={state}>
      <SocialDispatchContext.Provider value={dispatch}>
        {children}
      </SocialDispatchContext.Provider>
    </SocialStateContext.Provider>
  );
}

function useSocialState() {
  const context = React.useContext(SocialStateContext);
  if (context === undefined) {
    throw new Error("useSocialState must be used within a SocialProvider");
  }
  return context;
}

function useSocialDispatch() {
  const context = React.useContext(SocialDispatchContext);
  if (context === undefined) {
    throw new Error("useSocialDispatch must be used within a SocialProvider");
  }
  return context;
}

export { SocialProvider, useSocialState, useSocialDispatch };
