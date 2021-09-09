// @flow

import React from "react";

const LeaderboardStateContext = React.createContext();
const LeaderboardDispatchContext = React.createContext();

export const UPDATE_STATS = "UPDATE_STATS";
export const UPDATE_ERROR = "UPDATE_ERROR";

function leaderboardReducer(state, action) {
  switch (action.type) {
    case UPDATE_STATS:
      return { ...state, loading: false, stats: action.payload };
    case UPDATE_ERROR:
      return { ...state, loading: false, error: true };
    default: {
      return { ...state };
    }
  }
}

function LeaderboardProvider({ children }) {
  const [state, dispatch] = React.useReducer(leaderboardReducer, {
    stats: null,
    loading: true,
    error: false,
  });

  return (
    <LeaderboardStateContext.Provider value={state}>
      <LeaderboardDispatchContext.Provider value={dispatch}>
        {children}
      </LeaderboardDispatchContext.Provider>
    </LeaderboardStateContext.Provider>
  );
}

function useLeaderboardState() {
  const context = React.useContext(LeaderboardStateContext);
  if (context === undefined) {
    throw new Error("useLeaderboardState must be used within a LeaderboardProvider");
  }
  return context;
}

function useLeaderboardDispatch() {
  const context = React.useContext(LeaderboardDispatchContext);
  if (context === undefined) {
    throw new Error("useLeaderboardDispatch must be used within a LeaderboardProvider");
  }
  return context;
}

export { LeaderboardProvider, useLeaderboardState, useLeaderboardDispatch };
