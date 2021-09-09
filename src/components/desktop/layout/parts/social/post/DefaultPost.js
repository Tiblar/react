// @flow

import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import Masonry from 'react-masonry-component';

import postStyles from "../../../../../../css/components/post.css";
import {mB1} from "../../../../../../css/layout.css";

import PinIcon from "../../../../../../assets/svg/icons/thumbtack.svg";
import LockIcon from "../../../../../../assets/svg/icons/lock.svg";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Body from "./components/Body";

import {makeGetPosts} from "../../../../../../reducers/social/selectors";
import {PostType} from "../../../../../../util/types/PostTypes";
import {UserType} from "../../../../../../util/types/UserTypes";
import useWindowDimensions from "../../../../../../util/hooks/useWindowDimensions";
import {MAX_MOBILE_WIDTH} from "../../../../../../util/constants";

function DefaultPost(props) {
    const {width} = useWindowDimensions();

    if(props.post === undefined){
        return null;
    }

    return (
        <div className={postStyles.post + ' ' + (props.grid ? (' ' + postStyles.grid) : (width > 800 ? mB1 : ""))}>
            {
                props.post.pinned &&
                <div className={postStyles.pinned}>
                    <PinIcon height={14} /> <p>Pinned post by {props.post.author.info.username}</p>
                </div>
            }
            {
                props.post.private &&
                <div className={postStyles.pinned}>
                    <LockIcon height={14} /> <p>Private post</p>
                </div>
            }
            {
                props.post.followers_only &&
                <div className={postStyles.pinned}>
                    <LockIcon height={14} /> <p>Followers only post</p>
                </div>
            }
            <Header post={props.post} previewProfile={props.previewProfile} />
            <Body post={props.post}
                  truncate={props.truncate}
                  profile={props.profile}
                  previewProfile={props.previewProfile}
                  profileUser={props.profileUser}/>
            <Footer post={props.post} grid={props.grid} />
        </div>
    );
}

DefaultPost.propTypes = {
    postId: PropTypes.string.isRequired,
    post: PostType,
    profile: PropTypes.bool,
    profileUser: UserType,
    truncate: PropTypes.bool,
    grid: PropTypes.bool,
    previewProfile: PropTypes.bool,
};

DefaultPost.defaultProps = {
    profile: false,
    truncate: true,
    grid: false,
    previewProfile: false,
}

const mapStateToProps = () => {
    const getPosts = makeGetPosts();
    return (state, props) => {

        let post = getPosts(state, props);
        if(post === undefined){
            post = props.post;
        }

        return { post: post };
    };
};

export default connect(mapStateToProps)(DefaultPost);
