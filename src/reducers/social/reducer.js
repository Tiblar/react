// @flow

import {
  RESET_FEED,
  UPDATE_PERIOD,
  UPDATE_TYPE,
  UPDATE_SORT,
  UPDATE_POSTS,
  CREATE_ERROR,
  STOP_LOADING,
  UPDATE_OFFSET, HIT_LIMIT, START_LOADING,
  UPDATE_PREVIEW_SHOW, UPDATE_PREVIEW_USER_ID, UPDATE_PREVIEW_USER, UPDATE_PREVIEW_POSTS
} from "./constants";

import {PAST_DAY} from "../../util/constants";

const initialState = {
  offset: 0,
  loading: true,
  error: false,
  reachedEnd: false,
  posts: [],
  sort: "newest",
  type: "all",
  period: PAST_DAY,
  previewProfile: {
    show: false,
    userId: null,
    user: null,
    posts: [],
  }
};

function auth(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PREVIEW_SHOW:
      return {
        ...state,
        previewProfile: {
          ...state.previewProfile,
          show: action.payload
        }
      }
    case UPDATE_PREVIEW_USER_ID:
      return {
        ...state,
        previewProfile: {
          ...state.previewProfile,
          userId: action.payload
        }
      }
    case UPDATE_PREVIEW_USER:
      return {
        ...state,
        previewProfile: {
          ...state.previewProfile,
          user: action.payload
        }
      }
    case UPDATE_PREVIEW_POSTS:
      return {
        ...state,
        previewProfile: {
          ...state.previewProfile,
          posts: action.payload
        }
      }
    case RESET_FEED:
      return {
        ...state,
        offset: 0,
        loading: true,
        error: false,
        reachedEnd: false,
        posts: [],
      };
    case UPDATE_PERIOD:
      return {
        ...state,
        period: action.payload,
      };
    case UPDATE_SORT:
      return {
        ...state,
        sort: action.payload,
      };
    case UPDATE_TYPE:
      return {
        ...state,
        type: action.payload,
      };
    case UPDATE_POSTS:
      return {
        ...state,
        posts: action.payload,
      };
    case STOP_LOADING:
      return {
        ...state,
        loading: false,
      };
    case START_LOADING:
      return {
        ...state,
        loading: true,
      };
    case CREATE_ERROR:
      return {
        ...state,
        error: true,
        loading: false,
      };
    case UPDATE_OFFSET:
      return {
        ...state,
        offset: action.payload,
      };
    case HIT_LIMIT:
      return {
        ...state,
        reachedEnd: true,
      };
    default:
      return state;
  }
}

export default auth;
