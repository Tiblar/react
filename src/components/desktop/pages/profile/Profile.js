// @flow

import React, {useEffect, useState} from "react";
import {connect} from "react-redux";

import {mB1, mT1, mL} from "../../../../css/layout.css";
import {divider} from "../../../../css/layout/social/container/main.css";
import formStyles from "../../../../css/form.css";
import profileStyles from "../../../../css/layout/social/profile.css";

import Loading from "../../layout/parts/social/feed/components/Loading";
import Error from "../../layout/parts/social/feed/components/Error";
import Empty from "../../layout/parts/social/feed/components/Empty";
import DefaultPost from "../../layout/parts/social/post/DefaultPost";

import {BOTTOM_LOAD_HEIGHT} from "../../../../util/constants";
import {START_LOADING} from "../../../../reducers/social/constants";
import {useProfileState} from "../../layout/parts/profile/context";
import history from "../../../../util/history";
import useWindowDimensions from "../../../../util/hooks/useWindowDimensions";
import {fetchPosts, reset} from "../../../../reducers/social/actions";
import {formatBreakDate} from "../../../../util/date";
import store from "../../../../store";

function Profile(props) {
    const { container, user, error } = useProfileState();
    const { width } = useWindowDimensions();

    const urlParams = new URLSearchParams(window.location.search);

    let input = null;
    if(urlParams.get('q') !== null){
        input = decodeURIComponent(urlParams.get('q'));
    }

    const [manager, setManager] = useState({
        unblockPosts: false,
        query: input,
    });

    useEffect(() => {
        const unlisten = history.listen( location =>  {
            handleHistory(location);
            store.dispatch(reset());
        });

        return () => {
            unlisten();
        }
    });

    useEffect(() => {
        store.dispatch(reset());
    }, [manager.query]);

    useEffect(() => {
        if(props.social.offset === 0 && user !== null){
            container.current.scrollTop = 0;
            fetch();
        }
    }, [props.social.offset, user]);

    useEffect(() => {
        if(container === null) return;

        container.current.addEventListener('scroll', trackScroll);

        return () => {
            if(container !== null && container.current !== null){
                container.current.removeEventListener('scroll', trackScroll);
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

    function handleHistory(location) {
        const urlParams = new URLSearchParams(location.search);

        setManager(manager => ({
            ...manager,
            query: urlParams.get('q'),
        }))
    }

    function fetch() {
        let params = {};

        params.offset = props.social.offset;

        if(manager.query !== null){
            params.q = manager.query;
        }

        store.dispatch(fetchPosts(`/users/profile/${props.match.params.username}/feed`, params, "posts"));
    }

    let lastDate = null;
    let posts = [];
    props.social.posts.map((post) => {
        if(lastDate !== formatBreakDate(post.timestamp) && !post.pinned){
            lastDate = formatBreakDate(post.timestamp);

            posts.push(
                <div key={formatBreakDate(post.timestamp) + "-" + post.id} className={divider + (width > 800 ? ' ' + mB1 : "")}>
                    {formatBreakDate(post.timestamp)}
                </div>
            );
        }

        posts.push(<DefaultPost key={post.id} postId={post.id} profile={true} profileUser={user}/>);
    });

    if((user !== null && user.info.blocking) && !manager.unblockPosts){
        return (
            <div className={profileStyles.container}>
                <div className={formStyles.alert}>
                    You have blocked this user.
                    <button className={formStyles.button + ' ' + mL}
                            onClick={() => { setManager({ ...manager, unblockPosts: true }) }}>
                        View Posts
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={profileStyles.container}>
            {
                props.social.error && !error &&
                <div className={mT1}>
                    <Error />
                </div>
            }
            {
                !props.social.loading && !props.social.error && props.social.posts.length === 0 &&
                <div className={mT1}>
                    <Empty body="There are no posts here." />
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

export default connect(mapStateToProps)(Profile);
