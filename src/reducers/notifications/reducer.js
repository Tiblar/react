// @flow

import {UPDATE_CHAT, UPDATE_SOCIAL_FOLLOW_REQUEST_COUNT, UPDATE_SOCIAL_NOTIFICATIONS_COUNT} from "./constants";
import sound from "../../assets/audio/notification.mp3";

const initialState = {
  social: {
    notificationsCount: null,
    followRequestsCount: null,
  },
  chat: {
    total: 0,
  }
};

//let audio = new Audio(sound);

function notifications(state = initialState, action) {
  switch (action.type) {
    case UPDATE_CHAT:
      if (!(state.chat.total >= 9)) {
        //audio.currentTime = 0;
        //audio.play().catch(e => {});
        return Object.assign({}, state, action.info);
      } else {
        return state;
      }
    case UPDATE_SOCIAL_NOTIFICATIONS_COUNT:
      return {
        ...state,
        social: {
          ...state.social,
          notificationsCount: action.payload,
        }
      }
    case UPDATE_SOCIAL_FOLLOW_REQUEST_COUNT:
      return {
        ...state,
        social: {
          ...state.social,
          followRequestsCount: action.payload,
        }
      }
    default:
      return state;
  }
}

export default notifications;
