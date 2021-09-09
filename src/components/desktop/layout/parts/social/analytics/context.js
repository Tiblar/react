// @flow

import React from "react";

const AnalyticsStateContext = React.createContext();
const AnalyticsDispatchContext = React.createContext();

export const UPDATE_RECENT_STATS = "UPDATE_RECENT_STATS";
export const UPDATE_HISTORICAL_STATS = "UPDATE_HISTORICAL_STATS";
export const UPDATE_HISTORICAL_TIME_PERIOD = "UPDATE_HISTORICAL_TIME_PERIOD";
export const UPDATE_HISTORICAL_CHART = "UPDATE_HISTORICAL_CHART";
export const UPDATE_ERROR = "UPDATE_ERROR";

function analyticsReducer(state, action) {
    switch (action.type) {
        case UPDATE_RECENT_STATS:
            return { ...state, loading: false, recentStats: action.payload };
        case UPDATE_HISTORICAL_STATS:
            return { ...state, loading: false, historicalStats: action.payload };
        case UPDATE_HISTORICAL_TIME_PERIOD:
            return { ...state, loading: false, historicalTimePeriod: action.payload };
        case UPDATE_HISTORICAL_CHART:
            return { ...state, loading: false, historicalChart: action.payload };
        case UPDATE_ERROR:
            return { ...state, loading: false, error: true };
        default: {
            return { ...state };
        }
    }
}

function AnalyticsProvider({ children }) {
    const [state, dispatch] = React.useReducer(analyticsReducer, {
        recentStats: null,
        historicalStats: null,
        historicalTimePeriod: 1,
        historicalChart: "POST",
        loading: true,
        error: false,
    });

    return (
        <AnalyticsStateContext.Provider value={state}>
            <AnalyticsDispatchContext.Provider value={dispatch}>
                {children}
            </AnalyticsDispatchContext.Provider>
        </AnalyticsStateContext.Provider>
    );
}

function useAnalyticsState() {
    const context = React.useContext(AnalyticsStateContext);
    if (context === undefined) {
        throw new Error("useAnalyticsState must be used within an AnalyticsProvider");
    }
    return context;
}

function useAnalyticsDispatch() {
    const context = React.useContext(AnalyticsDispatchContext);
    if (context === undefined) {
        throw new Error("useAnalyticsDispatch must be used within an AnalyticsProvider");
    }
    return context;
}

export { AnalyticsProvider, useAnalyticsState, useAnalyticsDispatch };
