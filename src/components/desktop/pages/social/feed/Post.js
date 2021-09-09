// @flow

import React, {useEffect} from "react";
import {connect} from "react-redux";

import {postContainer} from "../../../../../css/layout/social/container/main.css";
import {mT1} from "../../../../../css/layout.css";

import Container from "../../../layout/parts/social/feed/FeedContainer";
import LoaderPost from "../../../layout/parts/social/post/LoaderPost";
import NotFound from "../../../layout/parts/social/feed/components/NotFound";
import DefaultPost from "../../../layout/parts/social/post/DefaultPost";

import store from "../../../../../store";
import {fetchPosts, reset} from "../../../../../reducers/social/actions";

function Post(props) {

    useEffect(() => {
        store.dispatch(reset());
    }, [props.match.params.postId]);

    function fetch() {
        let params = {};

        params.offset = props.social.offset;

        store.dispatch(fetchPosts("/post/" + props.match.params.postId, params, "posts"));
    }

    let posts = [];
    props.social.posts.map((post) => {
        posts.push(<DefaultPost key={post.id} truncate={false} postId={post.id}/>);
    });

    return (
        <Container postId={props.match.params.postId} fetchPosts={fetch}>
            <div className={postContainer}>
                {
                    (props.social.error || (!props.social.loading && posts.length === 0)) &&
                    <div className={mT1}>
                        <NotFound />
                    </div>
                }
                {posts}
                {
                    props.social.loading &&
                    <div className={mT1}>
                        <LoaderPost />
                    </div>
                }
            </div>
        </Container>
    );
}

const mapStateToProps = state => {
    const { auth, social } = state;
    return { auth: auth, social: social };
};

export default connect(mapStateToProps)(Post);
