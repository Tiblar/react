// @flow

import {
  UPDATE_ERROR,
} from "./constants";

export const updateError = (error) => (dispatch) => {
  dispatch({ type: UPDATE_ERROR, payload: error });
};