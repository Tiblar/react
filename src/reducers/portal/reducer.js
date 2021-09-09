// @flow

import {
  UPDATE_SOCIAL,
  UPDATE_CHAT,
  UPDATE_VIDEO,
  UPDATE_PORTAL,
} from "./constants";
import history from "../../util/history";

let pathname = history.location.pathname + history.location.hash;

let socialPath = pathname === "/social" || pathname.startsWith("/social/") ? pathname : "/social/feed";
let chatPath = pathname === "/chat" || pathname.startsWith("/chat/") || pathname.startsWith("/chat#/") ? pathname : "/chat";
let videoPath = pathname === "/video" || pathname.startsWith("/video/")
    || pathname.startsWith("/watch/") || pathname.startsWith("/channel/") ? pathname : "/video";

let initalPortal = "SOCIAL";

if(pathname === "/chat" || pathname.startsWith("/chat/") || pathname.startsWith("/chat#/")){
  initalPortal = "CHAT";
}

if(pathname === "/video" || pathname.startsWith("/video/") || pathname.startsWith("/watch/")){
  initalPortal = "VIDEO";
}

if(videoPath !== "/video"){
  initalPortal = "VIDEO";
}

if(!chatPath.startsWith("/chat")){
  chatPath = "/chat";
}


const initialState = {
  portal: initalPortal,
  path: {
    social: socialPath,
    chat: chatPath,
    video: videoPath,
  }
};

function portal(state = initialState, action) {

  switch (action.type) {
    case UPDATE_PORTAL:
      return {
        ...state,
        portal: action.payload
      };
    case UPDATE_SOCIAL:
      return {
        ...state,
        path: {
          ...state.path,
          social: action.payload,
        }
      };
    case UPDATE_CHAT:
      return {
        ...state,
        path: {
          ...state.path,
          chat: action.payload,
        }
      };
    case UPDATE_VIDEO:
      return {
        ...state,
        path: {
          ...state.path,
          video: action.payload,
        }
      };
    default:
      return state;
  }
}

export default portal;
