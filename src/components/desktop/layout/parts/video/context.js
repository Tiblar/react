// @flow

import React from "react";

const VideoStateContext = React.createContext();
const VideoDispatchContext = React.createContext();

export const CREATE_POST = "CREATE_POST";

function videoReducer(state, action) {
    switch (action.type) {
        case CREATE_POST:
            return { ...state, createPost: action.payload, reblogPost: null };
        default: {
            return { ...state };
        }
    }
}

function VideoProvider({ children }) {
    const [state, dispatch] = React.useReducer(videoReducer, {
        createPost: false,
    });

    return (
        <VideoStateContext.Provider value={state}>
            <VideoDispatchContext.Provider value={dispatch}>
                {children}
            </VideoDispatchContext.Provider>
        </VideoStateContext.Provider>
    );
}

function useVideoState() {
    const context = React.useContext(VideoStateContext);
    if (context === undefined) {
        throw new Error("useVideoState must be used within a VideoProvider");
    }
    return context;
}

function useVideoDispatch() {
    const context = React.useContext(VideoDispatchContext);
    if (context === undefined) {
        throw new Error("useVideoDispatch must be used within a VideoProvider");
    }
    return context;
}

export { VideoProvider, useVideoState, useVideoDispatch };
