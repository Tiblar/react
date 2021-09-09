// @flow

import {
  UPDATE_CONNECTION,
} from "./constants";
import axios from "axios";
import {API_URL} from "../../util/constants";

export const updateConnection = (status) => (dispatch, getState) => {
  dispatch({ type: UPDATE_CONNECTION, payload: status });
};

export const testConnection = () => (dispatch, getState) => {
  axios
      .get(API_URL + "/ping")
      .then(res => {
        dispatch({ type: UPDATE_CONNECTION, payload: true });
      })
      .catch(err => {
          if(err.response.status !== 401){
              dispatch({ type: UPDATE_CONNECTION, payload: false });
          }
      });
};