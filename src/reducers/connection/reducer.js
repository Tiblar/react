// @flow

import {
  UPDATE_CONNECTION
} from "./constants";

const initialState = {
  status: true,
};

function connection(state = initialState, action) {
  switch (action.type) {
    case UPDATE_CONNECTION:
      return {
        ...state,
        status: action.payload
      };
    default:
      return state;
  }
}

export default connection;
