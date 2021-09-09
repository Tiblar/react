// @flow

import axios from "axios";
import {batch} from "react-redux";

import {
  RESET_FEED,
  UPDATE_PERIOD,
  UPDATE_SORT,
  UPDATE_POSTS,
  CREATE_ERROR,
  STOP_LOADING,
  UPDATE_OFFSET, HIT_LIMIT, UPDATE_TYPE,
  UPDATE_PREVIEW_SHOW, UPDATE_PREVIEW_USER_ID, UPDATE_PREVIEW_USER, UPDATE_PREVIEW_POSTS
} from "./constants";
import {API_URL, POST_LIMIT, POST_OFFSET} from "../../util/constants";

export const previewShow = (status) => (dispatch, getState) => {
  dispatch({ type: UPDATE_PREVIEW_SHOW, payload: status })
}

export const previewUserId = (id) => (dispatch, getState) => {
  dispatch({ type: UPDATE_PREVIEW_USER_ID, payload: id })
}

export const previewUser = (user) => (dispatch, getState) => {
  dispatch({ type: UPDATE_PREVIEW_USER, payload: user })
}

export const previewPosts = (posts) => (dispatch, getState) => {
  dispatch({ type: UPDATE_PREVIEW_POSTS, payload: posts })
}

export const addPreviewPosts = (posts) => (dispatch, getState) => {
  let state = getState().social;
  let newPosts = state.previewProfile.posts.concat(posts);

  dispatch({ type: UPDATE_PREVIEW_POSTS, payload: newPosts });
};


export const reset = () => (dispatch, getState) => {
  dispatch({ type: RESET_FEED });
}

export const error = () => (dispatch, getState) => {
  dispatch({ type: CREATE_ERROR });
}

export const updatePeriod = (period) => (dispatch, getState) => {
  if(getState().social.period === period){
    return;
  }

  batch(() => {
    dispatch({ type: RESET_FEED });
    dispatch({ type: UPDATE_PERIOD, payload: period });
  })
}

export const updateType = (type) => (dispatch, getState) => {
  if(getState().social.type === type){
    return;
  }

  batch(() => {
    dispatch({ type: RESET_FEED });
    dispatch({ type: UPDATE_TYPE, payload: type });
  })
}

export const updateSort = (sort) => (dispatch, getState) => {
  if(getState().social.sort === sort){
    return;
  }

  batch(() => {
    dispatch({ type: RESET_FEED });
    dispatch({ type: UPDATE_SORT, payload: sort });
  })
}

export const addPosts = (posts) => (dispatch, getState) => {
  let state = getState().social;

  let newPosts = state.posts.concat(posts);

  batch(() => {
    dispatch({ type: UPDATE_POSTS, payload: newPosts });
    dispatch({ type: UPDATE_OFFSET, payload: state.offset + POST_OFFSET });
    dispatch({ type: STOP_LOADING });

    if(posts.length < POST_LIMIT){
      dispatch({ type: HIT_LIMIT });
    }
  })
}

export const stopLoading = () => (dispatch, getState) => {
  dispatch({ type: STOP_LOADING });
}

export const offset = (offset) => (dispatch, getState) => {
  dispatch({ type: UPDATE_OFFSET, payload: offset });
}

export const fetchPosts = (url, params, key = "posts") => (dispatch, getState) => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    },
    params: params,
  };

  axios.get(API_URL + url, config)
      .then(function (res) {
        addPosts(res.data.data[key])(dispatch, getState)
      })
      .catch(function (err) {
        error()(dispatch, getState);
      });
}

/**
 * Interactions
 */
export const favoritePost = (id) => (dispatch, getState) => {
  function change(post) {
    if(post.id !== id && (!post.reblog || post.reblog.id !== id)){
      return post;
    }

    if(!post.is_favorited){
      post.favorites_count += 1;
      post.is_favorited = true;
    } else{
      post.favorites_count -= 1;
      post.is_favorited = false;
    }

    if(post.reblog !== null && !post.reblog.is_favorited){
      post.reblog.favorites_count += 1;
      post.reblog.is_favorited = true;
    } else if(post.reblog !== null && post.reblog.is_favorited){
      post.reblog.favorites_count -= 1;
      post.reblog.is_favorited = false;
    }

    return {
      ...post
    }
  }

  let newPostsArray = getState().social.posts.map(post => change(post));

  dispatch({ type: UPDATE_POSTS, payload: newPostsArray });

  let newPreviewArray = getState().social.previewProfile.posts.map(post => change(post));

  dispatch({ type: UPDATE_PREVIEW_POSTS, payload: newPreviewArray });
}

export const reblogPost = (id) => (dispatch, getState) => {
  function change(post) {
    if(post.id !== id && (!post.reblog || post.reblog.id !== id)){
      return post;
    }

    if(!post.is_reblogged){
      post.reblogs_count += 1;
      post.is_reblogged = true;
    } else{
      post.reblogs_count -= 1;
      post.is_reblogged = false;
    }

    if(post.reblog !== null && !post.reblog.is_reblogged){
      post.reblog.reblogs_count += 1;
      post.reblog.is_reblogged = true;
    } else if(post.reblog !== null && post.reblog.is_reblogged){
      post.reblog.reblogs_count -= 1;
      post.reblog.is_reblogged = false;
    }

    return {
      ...post,
    }
  }

  let newPostsArray = getState().social.posts.map(post => change(post));

  dispatch({ type: UPDATE_POSTS, payload: newPostsArray });

  let newPreviewArray = getState().social.previewProfile.posts.map(post => change(post));

  dispatch({ type: UPDATE_PREVIEW_POSTS, payload: newPreviewArray });
}

export const votePost = (id, option) => (dispatch, getState) => {
  function change(post) {
    if(post.id !== id && (!post.reblog || post.reblog.id !== id)){
      return post;
    }

    if(!post.poll && !post.reblog.poll){
      return post;
    }

    if(post.poll !== null && post.poll.options[option - 1]){
      post.poll.votes_count += 1;
      post.poll.options[option - 1].votes_count += 1;

      post.poll.my_vote = {
        id: "0000000000000000000",
        option: option,
      }
    }

    if(post.reblog !== null && post.reblog.poll !== null && post.reblog.poll.options[option - 1]) {
      post.reblog.poll.votes_count += 1;
      post.reblog.poll.options[option - 1].votes_count += 1;

      post.reblog.poll.my_vote = {
        id: "0000000000000000000",
        option: option,
      }
    }

    return {
      ...post
    }
  }

  let newPostsArray = getState().social.posts.map(post => change(post));

  dispatch({ type: UPDATE_POSTS, payload: newPostsArray });

  let newPreviewArray = getState().social.previewProfile.posts.map(post => change(post));

  dispatch({ type: UPDATE_PREVIEW_POSTS, payload: newPreviewArray });
}

export const deletePost = (id) => (dispatch, getState) => {
  let {posts} = getState().social;

  let newArray = posts.filter((obj => (obj.id !== id && (obj.reblog === null || obj.reblog.id !== id))));

  dispatch({ type: UPDATE_POSTS, payload: newArray });
}

export const pinPost = (id) => (dispatch, getState) => {
  let {posts} = getState().social;

  let newArray = posts.map(post => {
    if(post.id !== id){
      return post;
    }

    post.pinned = !post.pinned;
    post.private = false;

    return {
      ...post
    }
  });

  dispatch({ type: UPDATE_POSTS, payload: newArray });
}


export const privatePost = (id, value) => (dispatch, getState) => {
  let {posts} = getState().social;

  let newArray = posts.map(post => {
    if(post.id !== id){
      return post;
    }

    post.private = value;

    return {
      ...post
    }
  });

  dispatch({ type: UPDATE_POSTS, payload: newArray });
}

export const followerPost = (id, value) => (dispatch, getState) => {
  let {posts} = getState().social;

  let newArray = posts.map(post => {
    if(post.id !== id){
      return post;
    }

    post.followers_only = value;

    return {
      ...post
    }
  });

  dispatch({ type: UPDATE_POSTS, payload: newArray });
}
