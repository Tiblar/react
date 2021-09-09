// @flow

import {
  UPDATE_ERROR
} from "./constants";

const initialState = {
  error: null,
};

function error(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
}

export default error;
