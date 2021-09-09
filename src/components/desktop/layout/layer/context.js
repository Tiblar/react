// @flow

import React from "react";

const LayerStateContext = React.createContext();
const LayerDispatchContext = React.createContext();

export const LAYER = "LAYER";
export const CONTAINER = "CONTAINER";
export const REVERT = "REVERT";

function layerReducer(state, action) {
  switch (action.type) {
    case LAYER: {
      return { ...state, layer: action.payload };
    }
    case CONTAINER: {
      return { ...state, container: action.payload };
    }
    default: {
      return { ...state };
    }
  }
}

function LayerProvider({ children }) {
  const [state, dispatch] = React.useReducer(layerReducer, {
    container: null,
    layer: null,
  });

  //Remove revert styling after the animation
  if(state.container === REVERT){
    setTimeout(() => {
      dispatch({ type: CONTAINER, payload: null });
    }, 300);
  }

  return (
    <LayerStateContext.Provider value={state}>
      <LayerDispatchContext.Provider value={dispatch}>
        {children}
      </LayerDispatchContext.Provider>
    </LayerStateContext.Provider>
  );
}

function useLayerState() {
  const context = React.useContext(LayerStateContext);
  if (context === undefined) {
    throw new Error("useLayerState must be used within a LayerProvider");
  }
  return context;
}

function useLayerDispatch() {
  const context = React.useContext(LayerDispatchContext);
  if (context === undefined) {
    throw new Error("useLayerDispatch must be used within a LayerProvider");
  }
  return context;
}

export { LayerProvider, useLayerState, useLayerDispatch };
