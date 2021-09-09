import React from "react";

const ProfileStateContext = React.createContext();
const ProfileDispatchContext = React.createContext();

export const UPDATE_USER = "UPDATE_USER";
export const UPDATE_CONTAINER = "UPDATE_CONTAINER";

function profileReducer(state, action) {
    switch (action.type) {
        case UPDATE_USER:
            return { ...state, user: action.payload };
        case UPDATE_CONTAINER:
            return { ...state, container: action.payload };
        default: {
            return { ...state };
        }
    }
}

function ProfileProvider({ children }) {
    const [state, dispatch] = React.useReducer(profileReducer, {
        user: null,
        container: null,
    });

    return (
        <ProfileStateContext.Provider value={state}>
            <ProfileDispatchContext.Provider value={dispatch}>
                {children}
            </ProfileDispatchContext.Provider>
        </ProfileStateContext.Provider>
    );
}

function useProfileState() {
    const context = React.useContext(ProfileStateContext);
    if (context === undefined) {
        throw new Error("useProfileState must be used within a ProfileProvider");
    }
    return context;
}

function useProfileDispatch() {
    const context = React.useContext(ProfileDispatchContext);
    if (context === undefined) {
        throw new Error("useProfileDispatch must be used within a ProfileProvider");
    }
    return context;
}

export { ProfileProvider, useProfileState, useProfileDispatch };
