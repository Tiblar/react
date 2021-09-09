import PropTypes from "prop-types";
import {UserType} from "./UserTypes";

export let PostType = PropTypes.shape({
    id: PropTypes.string,
    attachments: PropTypes.array,
    author: UserType,
    verified: PropTypes.bool,
    body: PropTypes.string,
    favorites_count: PropTypes.number,
    is_favorited: PropTypes.bool,
    is_reblogged: PropTypes.bool,
    nsfw: PropTypes.bool,
    reblogs_count: PropTypes.number,
    replies_count: PropTypes.number,
    timestamp: PropTypes.string,
    title: PropTypes.string,
    updated_timestamp: PropTypes.string,
});
PostType.reblog = PropTypes.shape(PostType);

export let ReplyType = PropTypes.shape({
    id: PropTypes.string,
    post_id: PropTypes.string,
    parent_id: PropTypes.string,
    author: UserType,
    body: PropTypes.string,
    replies: PropTypes.array,
    depth: PropTypes.number,
    timestamp: PropTypes.string,
});