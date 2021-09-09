import { createSelector } from 'reselect'

export const makeGetPosts = () => createSelector(
    (state, props) => props.postId,
    (state) => state.social.posts,
    (postId, posts) => {
        return posts.find(obj => obj.id === postId)
    }
);