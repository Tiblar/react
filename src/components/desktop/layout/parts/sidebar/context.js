// @flow

import React from "react";

const SidebarStateContext = React.createContext();
const SidebarDispatchContext = React.createContext();

export const UPDATE_OUTSIDE_CHILDREN = "UPDATE_OUTSIDE_CHILDREN";

function reducer(state, action) {
    switch (action.type) {
        case UPDATE_OUTSIDE_CHILDREN:
            return { ...state, outsideChildren: action.payload };
        default: {
            return { ...state };
        }
    }
}

function SidebarProvider({ children }) {
    const [state, dispatch] = React.useReducer(reducer, {
        outsideChildren: null,
    });

    return (
        <SidebarStateContext.Provider value={state}>
            <SidebarDispatchContext.Provider value={dispatch}>
                {children}
            </SidebarDispatchContext.Provider>
        </SidebarStateContext.Provider>
    );
}

function useSidebarState() {
    const context = React.useContext(SidebarStateContext);
    if (context === undefined) {
        throw new Error("useSidebarState must be used within a SidebarProvider");
    }
    return context;
}

function useSidebarDispatch() {
    const context = React.useContext(SidebarDispatchContext);
    if (context === undefined) {
        throw new Error("useSidebarDispatch must be used within a SidebarProvider");
    }
    return context;
}

export { SidebarProvider, useSidebarState, useSidebarDispatch };
