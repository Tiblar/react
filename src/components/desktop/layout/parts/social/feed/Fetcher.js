// @flow

import React, {useEffect, useRef} from "react";
import {connect} from "react-redux";

import {wF, positionRelative} from "../../../../../../css/layout.css";
import {container} from "../../../../../../css/layout/social/container/main.css";

import {BOTTOM_LOAD_HEIGHT, PAST_DAY} from "../../../../../../util/constants";
import {START_LOADING} from "../../../../../../reducers/social/constants";
import store from "../../../../../../store";
import {reset, updatePeriod, updateSort} from "../../../../../../reducers/social/actions";
import history from "../../../../../../util/history";

const Fetcher = (props) => {
    const containerRef = useRef();

    useEffect(() => {
        store.dispatch(updateSort("newest"));
        store.dispatch(updatePeriod(PAST_DAY));
    }, []);

    useEffect(() => {
        store.dispatch(reset());
    }, [props.social.sort, props.social.period]);

    useEffect(() => {
        return history.listen((location) => {
            store.dispatch(reset());
        })
    },[history])

    useEffect(() => {
        if(props.social.offset === 0){
            containerRef.current.scrollTop = 0;
            props.fetchPosts();
        }
    }, [props.social.offset]);

    useEffect(() => {
        containerRef.current.addEventListener('scroll', trackScroll);

        return () => {
            containerRef.current.removeEventListener('scroll', trackScroll);
        };
    }, [props.social.loading, props.social.reachedEnd, props.social.error]);

    useEffect(() => {
        if(props.social.error){
            containerRef.current.scrollTop = 0;
        }
    }, [props.social.error])

    const trackScroll = (e) => {
        if(typeof props.fetchPosts !== "function"){
            return;
        }

        if(
            (e.target.scrollHeight - e.target.scrollTop - e.target.offsetHeight < BOTTOM_LOAD_HEIGHT
            && !props.social.loading && !props.social.reachedEnd && !props.social.error)
        ) {
            store.dispatch({ type: START_LOADING });
            props.fetchPosts();
        }
    };

    return (
        <div className={wF + ' ' + positionRelative}>
            <div className={container} ref={containerRef}>
                {props.children}
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    const { auth, social } = state;
    return { auth: auth, social: social };
};

export default connect(mapStateToProps)(Fetcher);
