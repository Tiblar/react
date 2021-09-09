import React, {useEffect} from "react";
import {connect} from "react-redux";

import {mB1, mT1} from "../../../../css/layout.css";
import {divider} from "../../../../css/layout/social/container/main.css";
import formStyles from "../../../../css/form.css";
import profileStyles from "../../../../css/layout/social/profile.css";

import Loading from "../../layout/parts/social/feed/components/Loading";
import Error from "../../layout/parts/social/feed/components/Error";
import Empty from "../../layout/parts/social/feed/components/Empty";
import DefaultPost from "../../layout/parts/social/post/DefaultPost";

import {fetchPosts, reset} from "../../../../reducers/social/actions";
import {formatBreakDate} from "../../../../util/date";
import store from "../../../../store";
import {useProfileState} from "../../layout/parts/profile/context";
import {BOTTOM_LOAD_HEIGHT} from "../../../../util/constants";
import {START_LOADING} from "../../../../reducers/social/constants";

function SocialLikes(props) {
    const {container, user} = useProfileState();

    useEffect(() => {
        store.dispatch(reset());
    }, []);

    useEffect(() => {
        if(props.social.offset === 0 && user !== null){
            fetch();
        }
    }, [props.social.offset, user]);

    useEffect(() => {
        if(container === null) return;

        container.current.addEventListener('ps-scroll-y', trackScroll);

        return () => {
            if(container !== null && container.current !== null){
                container.current.removeEventListener('ps-scroll-y', trackScroll);
            }
        };
    }, [props.social.loading, props.social.reachedEnd, props.social.error]);

    const trackScroll = (e) => {
        if(
            (e.target.scrollHeight - e.target.scrollTop - e.target.offsetHeight < BOTTOM_LOAD_HEIGHT
                && !props.social.loading && !props.social.reachedEnd && !props.social.error)
        ) {
            store.dispatch({ type: START_LOADING });
            fetch();
        }
    };

    function fetch() {
        let params = {};

        params.offset = props.social.offset;

        store.dispatch(fetchPosts(`/users/profile/${props.match.params.username}/likes/social`, params, "likes"));
    }

    let posts = [];
    props.social.posts.map((post) => {
        posts.push(<DefaultPost key={post.id} postId={post.id}/>);
    });

    return (
        <div className={profileStyles.container}>
            {
                props.social.error &&
                <div className={mT1}>
                    <Error />
                </div>
            }
            {
                !props.social.loading && !props.social.error && props.social.posts.length === 0 &&
                <div className={mT1}>
                    <Empty body="There are no likes here." />
                </div>
            }
            {posts}
            {
                props.social.loading && !props.social.reachedEnd &&
                <div className={mT1}>
                    <Loading />
                </div>
            }
            {
                props.social.reachedEnd &&
                <div className={formStyles.alert + ' ' + mT1}>
                    You have reached the end!
                </div>
            }
        </div>
    );
}

const mapStateToProps = state => {
    const { auth, social } = state;
    return { auth: auth, social: social };
};

export default connect(mapStateToProps)(SocialLikes);
