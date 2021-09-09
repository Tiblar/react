// @flow

import React from "react";

const ListsStateContext = React.createContext();
const ListsDispatchContext = React.createContext();

export const UPDATE_LISTS = "UPDATE_LISTS";
export const UPDATE_LOADING_LIST = "UPDATE_LOADING_LIST";
export const UPDATE_ERROR = "UPDATE_ERROR";

function listsReducer(state, action) {
    switch (action.type) {
        case UPDATE_LISTS:
            return { ...state, loadingLists: false, lists: action.payload };
        case UPDATE_LOADING_LIST:
            return { ...state, loadingLists: action.payload };
        case UPDATE_ERROR:
            return { ...state, error: true };
        default: {
            return { ...state };
        }
    }
}

function ListsProvider({ children }) {
    const [state, dispatch] = React.useReducer(listsReducer, {
        lists: [],
        loadingLists: true,
        error: false,
    });

    return (
        <ListsStateContext.Provider value={state}>
            <ListsDispatchContext.Provider value={dispatch}>
                {children}
            </ListsDispatchContext.Provider>
        </ListsStateContext.Provider>
    );
}

function useListsState() {
    const context = React.useContext(ListsStateContext);
    if (context === undefined) {
        throw new Error("useListsState must be used within a ListsProvider");
    }
    return context;
}

function useListsDispatch() {
    const context = React.useContext(ListsDispatchContext);
    if (context === undefined) {
        throw new Error("useListsDispatch must be used within a ListsProvider");
    }
    return context;
}

export { ListsProvider, useListsState, useListsDispatch };
