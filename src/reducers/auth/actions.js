// @flow

import axios from "axios";

import {
  USER_LOADED,
  USER_LOADING,
  LOAD_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL, AUTH_ERROR, REFRESH_TOKEN,
} from "./constants";
import { API_URL } from "../../util/constants";
import history from "../../util/history";
import {updateTheme} from "../theme/actions";

export const loadUser = (refreshed = false) => (dispatch, getState) => {
  if(!getState().auth.isAuthenticated){
    return;
  }

  dispatch({ type: USER_LOADING });

  axios
    .get(API_URL + "/users/@me", tokenConfig(getState))
    .then(res => {
      if(res.data.data){
        dispatch(setUser(res.data.data));
        dispatch(updateTheme(res.data.data.theme));
      }else{
        dispatch({ type: LOAD_ERROR, payload: AUTH_ERROR });
      }
    })
    .catch(err => {
      if(err.response && err.response.status === 403 && getState().auth.isAuthenticated && !refreshed){
        dispatch(refreshToken());
      }else{
        dispatch({ type: LOAD_ERROR, payload: AUTH_ERROR });
      }
    });
};

export const setUser = (data) => (dispatch, getState) => {
  dispatch({
    type: USER_LOADED,
    payload: data
  });
}

export const refreshToken = () => (dispatch, getState) => {
  axios
      .post(API_URL + "/auth/token/refresh", { refresh_token: getState().auth.refreshToken }, tokenConfig(getState))
      .then(res => {
        dispatch(loadUser(true));
        dispatch({
          type: REFRESH_TOKEN,
          payload: res.data.data.token
        });
      })
      .catch(err => {
        dispatch({ type: LOAD_ERROR, payload: AUTH_ERROR });
      });
};

export const login = ({ username, password, security_code, security_id }) => dispatch => {
  dispatch({ type: USER_LOADING });
  removeAllMatrix();

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ username, password, security_code, security_id });

  axios
    .post(API_URL + "/auth/login", body, config)
    .then(res => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data.message
      });
    });
};

export const loginLink = ({ code }) => dispatch => {
  dispatch({ type: USER_LOADING });
  removeAllMatrix();

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  axios
      .post(API_URL + "/auth/two-factor/login/" + code, config)
      .then(res => {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data.data
        });
      })
      .catch(err => {
        dispatch({
          type: LOGIN_FAIL,
          payload: err.response.data.message
        });
      });
};

export const register = ({ username, password, email, security_code, security_id, invite }) => dispatch => {
  dispatch({ type: USER_LOADING });
  removeAllMatrix();

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ username, password, email, security_code, security_id, invite });

  axios
    .post(API_URL + "/auth/register", body, config)
    .then(res => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data.data
      });
    })
    .catch(err => {
      let errors = err.response.data.errors;
      if(errors.username){
        dispatch({
          type: REGISTER_FAIL,
          payload: errors.username,
        });

        return;
      }

      if(errors.captcha){
        dispatch({
          type: REGISTER_FAIL,
          payload: errors.captcha,
        });

        return;
      }

      dispatch({
        type: REGISTER_FAIL,
      });
    });
};

export const logout = () => (dispatch, getState) => {
  removeAllMatrix();

  axios
      .post(API_URL + "/auth/logout", tokenConfig(getState))
      .then(res => {
        dispatch({
          type: LOGOUT_SUCCESS
        });
        history.push("/login/");
      })
      .catch(err => {

      });
};

export const tokenConfig = getState => {
  const token = getState().auth.token;

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (token) {
    config.headers["Auth-Token"] = token;
  }

  return config;
};

const removeAllMatrix = () => {
  if(window.indexedDB && window.indexedDB.databases){
    window.indexedDB.databases().then((r) => {
      for (let i = 0; i < r.length; i++) window.indexedDB.deleteDatabase(r[i].name);
    })
  }

  if(window.indexedDB && window.indexedDB.webkitGetDatabaseNames){
    window.indexedDB.webkitGetDatabaseNames().then((r) => {
      for (let i = 0; i < r.length; i++) window.indexedDB.deleteDatabase(r[i].name);
    })
  }

  window.localStorage.removeItem("mx_hs_url");
  window.localStorage.removeItem("mx_has_access_token");
  window.localStorage.removeItem("mx_Riot_Analytics_cts");
  window.localStorage.removeItem("mx_local_settings");
  window.localStorage.removeItem("mx_Riot_Analytics_vc");
  window.localStorage.removeItem("mx_is_guest");
  window.localStorage.removeItem("mx_access_token");
  window.localStorage.removeItem("mx_user_id");

  Object.entries(localStorage).map(x => x[0])
      .filter(x => x.substring(0,2) === "mx")
      .map(x => localStorage.removeItem(x));
};
