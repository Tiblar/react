// @flow

import {
  UPDATE_SOCIAL,
  UPDATE_CHAT,
  UPDATE_VIDEO,
  UPDATE_PORTAL
} from "./constants";

export const updatePath = (path) => (dispatch, getState) => {
  if(path === "/chat" || path.startsWith("/chat/") || path.startsWith("/chat#/")){
    dispatch({ type: UPDATE_CHAT, payload: path });
    dispatch(updatePortal("CHAT"));
  }else if(path === "/video" || path.startsWith("/video/") || path.startsWith("/watch/") || path.startsWith("/channel/")){
    dispatch({ type: UPDATE_VIDEO, payload: path });
    dispatch(updatePortal("VIDEO"));
  }else if(path === "/social" || path.startsWith("/social/") || path.startsWith("/post/")){
    dispatch({ type: UPDATE_SOCIAL, payload: path });
    dispatch(updatePortal("SOCIAL"));
  }
};

export const updatePortal = (portal) => {
  return (dispatch) => {
    return new Promise((res, rej) => {
      dispatch({ type: UPDATE_PORTAL, payload: portal });

      res();
    });
  };
}
