import {createSelector} from 'reselect'
import jwt_decode from "jwt-decode";

export const getIsAuthenticated = (state) => {
    return state.auth.isAuthenticated;
}

export const getUser = (state) => {
    return state.auth.user
}

export const getError = (state) => {
    return state.auth.error
}

export const getToken = (state) => {
    return state.auth.token
}

export const getIsBoosted = (state) => {
    return state.auth.user ? state.auth.user.boosted : false;
}

export const makeIsAuthenticated = () => createSelector(
    getIsAuthenticated,
    (isAuthenticated) => {
        return isAuthenticated
    }
);

export const makeIsUserNull = () => createSelector(
    getUser,
    (user) => {
        return user === null
    }
);

export const makeError = () => createSelector(
    getError,
    (error) => {
        return error
    }
);

export const makeTokenTimeout = () => createSelector(
    getToken,
    (token) => {
        if(token === null){
            return;
        }

        let expMilli = (jwt_decode(token).exp - jwt_decode(token).iat) * 1000;

        return (expMilli > (240 * 1000)) ? 120 * 1000 : expMilli / 2;
    }
);

export const makeIsBoosted = () => createSelector(
    getIsBoosted,
    (isBoosted) => {
        return isBoosted
    }
);