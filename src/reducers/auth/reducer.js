// @flow

import {
  USER_LOADED,
  USER_LOADING,
  LOAD_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL, REFRESH_TOKEN
} from "./constants";
import { catchErrors } from "./errors";
import {LIGHT_THEME} from "../theme/constants";

const initialState = {
  refreshToken: localStorage.getItem("refreshToken"),
  refreshExpire: localStorage.getItem("refreshExpire"),
  token: localStorage.getItem("token"),
  isAuthenticated:
    localStorage.getItem("refreshToken") !== null &&
    localStorage.getItem("refreshToken") !== undefined,
  isLoading: false,
  error: null,
  user: null
};

function auth(state = initialState, action) {
  switch (action.type) {
    case USER_LOADED:
      localStorage.setItem('theme', action.payload.theme);

      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
        error: null,
      };
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      if(action.payload.token === undefined) return;
      if(action.payload.refresh_token === undefined) return;
      if(action.payload.refresh_expire === undefined) return;

      localStorage.setItem("refreshToken", action.payload.refresh_token);
      localStorage.setItem("refreshExpire", action.payload.refresh_expire);
      localStorage.setItem("token", action.payload.token);

      let theme = localStorage.getItem('theme');
      if (typeof theme === 'undefined' || theme === null){
        localStorage.setItem('theme', LIGHT_THEME)
      }

      return {
        ...state,
        error: null,
        refreshToken: action.payload.refresh_token,
        refreshExpire: action.payload.refresh_expire,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case LOAD_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case LOGOUT_SUCCESS:
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("refreshExpire");
      localStorage.removeItem("token");
      return {
        ...state,
        error: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        refreshToken: null,
        refreshExpire: null,
        token: null,
      };
    case LOGIN_FAIL:
    case REGISTER_FAIL:
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("refreshExpire");
      localStorage.removeItem("token");
      return {
        ...state,
        error: catchErrors(action.payload),
        user: null,
        isAuthenticated: false,
        isLoading: false,
        refreshToken: null
      };
    case REFRESH_TOKEN:
      return {
        ...state,
        token: action.payload
      };
    default:
      return state;
  }
}

export default auth;
