// @flow

import React from "react";

const PartStateContext = React.createContext();
const PartDispatchContext = React.createContext();

export const NEXT = "NEXT";
export const PREVIOUS = "PREVIOUS";
export const GOTO = "GOTO";
export const ADD_PART = "ADD_PART";

function partReducer(state, action) {
  switch (action.type) {
    case NEXT: {
      if (state.position + 1 === state.parts.length) {
        return { ...state };
      }

      let { parts } = state;

      let curPart = parts[state.position];
      let nextPart = parts[state.position + 1];

      if (curPart !== undefined && nextPart !== undefined) {
        curPart.visible = false;
        nextPart.visible = true;
      }

      return { position: state.position + 1, parts: parts };
    }
    case PREVIOUS: {
      if (state.position - 1 === -1) {
        return { ...state };
      }

      let { parts } = state;

      let curPart = parts[state.position];
      let nextPart = parts[state.position - 1];

      if (curPart !== undefined && nextPart !== undefined) {
        curPart.visible = false;
        nextPart.visible = true;
      }

      return { position: state.position - 1, parts: parts };
    }
    case GOTO: {
      if (action.payload < 0 || action.payload >= state.parts.length) {
        return { ...state };
      }

      let { parts } = state;

      // Set all to not visible
      parts.map(function(x) {
        x.visible = false;
        return x;
      });

      // Set the goto location to visible
      parts[action.payload].visible = true;

      return { position: state.position - 1, parts: parts };
    }
    case ADD_PART: {
      return { parts: state.parts.push(action.payload), ...state };
    }
    default: {
      return { ...state };
    }
  }
}

function PartProvider({ children }) {
  const [state, dispatch] = React.useReducer(partReducer, {
    position: 0,
    parts: []
  });

  return (
    <PartStateContext.Provider value={state}>
      <PartDispatchContext.Provider value={dispatch}>
        {children}
      </PartDispatchContext.Provider>
    </PartStateContext.Provider>
  );
}

function usePartState() {
  const context = React.useContext(PartStateContext);
  if (context === undefined) {
    throw new Error("usePartState must be used within a PartProvider");
  }
  return context;
}

function usePartDispatch() {
  const context = React.useContext(PartDispatchContext);
  if (context === undefined) {
    throw new Error("usePartDispatch must be used within a PartProvider");
  }
  return context;
}

export { PartProvider, usePartState, usePartDispatch };
