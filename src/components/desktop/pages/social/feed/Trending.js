// @flow

import React from "react";
import {connect} from "react-redux";

import mainStyles, {divider, postContainer} from "../../../../../css/layout/social/container/main.css";
import {flex, mB1, mT1} from "../../../../../css/layout.css";

import Container from "../../../layout/parts/social/feed/FeedContainer";
import DefaultPost from "../../../layout/parts/social/post/DefaultPost";

import store from "../../../../../store";
import {fetchPosts} from "../../../../../reducers/social/actions";
import {formatBreakDate} from "../../../../../util/date";
import PeriodDropdown from "../../../layout/parts/social/feed/components/PeriodDropdown";
import Error from "../../../layout/parts/social/feed/components/Error";
import Empty from "../../../layout/parts/social/feed/components/Empty";
import Loading from "../../../layout/parts/social/feed/components/Loading";
import formStyles from "../../../../../css/form.css";
import useWindowDimensions from "../../../../../util/hooks/useWindowDimensions";

function Trending(props) {
    const { width } = useWindowDimensions();

    function fetch() {
        let params = {};

        params.offset = props.social.offset;
        params.period = props.social.period;

        store.dispatch(fetchPosts("/post/feed/trending", params, "posts"));
    }

    let lastDate = null;
    let posts = [];
    props.social.posts.map((post) => {
        if(lastDate !== formatBreakDate(post.timestamp)){
            lastDate = formatBreakDate(post.timestamp);

            posts.push(
                <div key={formatBreakDate(post.timestamp) + "-" + post.id} className={divider + (width > 800 ? ' ' + mB1 : "")}>
                    {formatBreakDate(post.timestamp)}
                </div>
            );
        }

        posts.push(<DefaultPost key={post.id} postId={post.id}/>);
    });

    return (
        <Container fetchPosts={fetch}>
            <div className={flex + ' ' + mainStyles.optionsContainer}>
                {
                    (!props.social.loading || props.social.error) &&
                    <PeriodDropdown />
                }
            </div>
            <div className={postContainer}>
                {
                    props.social.error &&
                    <div className={mT1}>
                        <Error />
                    </div>
                }
                {
                    !props.social.loading && !props.social.error && props.social.posts.length === 0 &&
                    <div className={mT1}>
                        <Empty />
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
        </Container>
    );
}

const mapStateToProps = state => {
    const { auth, social } = state;
    return { auth: auth, social: social };
};

export default connect(mapStateToProps)(Trending);
