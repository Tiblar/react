// @flow

import {
  DARK_THEME,
  LIGHT_THEME, UPDATE_ACTIVE_PROFILE_THEME,
  UPDATE_THEME
} from "./constants";

const initialState = {
  theme: localStorage.getItem('theme') === LIGHT_THEME || localStorage.getItem('theme') === DARK_THEME ? localStorage.getItem('theme') : DARK_THEME,
  activeProfileTheme: false,
};

function error(state = initialState, action) {
  switch (action.type) {
    case UPDATE_THEME:
      return {
        ...state,
        theme: action.payload
      };
    case UPDATE_ACTIVE_PROFILE_THEME:
      return {
        ...state,
        activeProfileTheme: action.payload,
      }
    default:
      return state;
  }
}

export default error;
