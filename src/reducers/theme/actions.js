// @flow

import {
  DARK_THEME, LIGHT_THEME, UPDATE_ACTIVE_PROFILE_THEME,
  UPDATE_THEME,
} from "./constants";
import {authRoutes} from "../../router";

export const updateTheme = (theme) => (dispatch) => {
  if(theme === DARK_THEME){
    dispatch({ type: UPDATE_THEME, payload: DARK_THEME });
  }

  localStorage.setItem("theme", theme);

  if(theme === LIGHT_THEME){
    dispatch({ type: UPDATE_THEME, payload: LIGHT_THEME });
  }
};

export const updateActiveProfileTheme = (status) => (dispatch, getState) => {
  let theme = getState().theme.theme;

  if(
      status === false &&
      (theme === LIGHT_THEME || new RegExp(authRoutes.join("|")).test(window.location.pathname))
  ){
    window.__theme_root.classList.add("light-theme");
    window.__theme_root.classList.remove("dark-theme");
  }else if(theme === DARK_THEME){
    window.__theme_root.classList.add("dark-theme");
    window.__theme_root.classList.remove("light-theme");
  }

  dispatch({ type: UPDATE_ACTIVE_PROFILE_THEME, payload: status });
}