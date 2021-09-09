// @flow
import axios from "axios";

import {UPDATE_CHAT, UPDATE_SOCIAL_FOLLOW_REQUEST_COUNT, UPDATE_SOCIAL_NOTIFICATIONS_COUNT} from "./constants";
import {API_URL} from "../../util/constants";
import {batch} from "react-redux";

export function updateChat(info) {
  return {
    type: UPDATE_CHAT,
    info
  };
}

export const updateSocialNotificationsCount = () => (dispatch, getState) => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  axios.get(API_URL + `/users/@me/notifications/count`, config)
      .then(function (res) {
          if(res.data.data){
              batch(() => {
                  dispatch({ type: UPDATE_SOCIAL_NOTIFICATIONS_COUNT, payload: res.data.data.notifications })
                  dispatch({ type: UPDATE_SOCIAL_FOLLOW_REQUEST_COUNT, payload: res.data.data.requests })
              })
          }
      })
      .catch(function (err) {

      });
}