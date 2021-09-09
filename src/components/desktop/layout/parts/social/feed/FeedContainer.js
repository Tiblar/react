// @flow

import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import RecommendNav from "../nav/right/RecommendNav";
import MainContainer from "../container/MainContainer";
import Fetcher from "./Fetcher";
import useWindowDimensions from "../../../../../../util/hooks/useWindowDimensions";
import {MAX_MOBILE_WIDTH} from "../../../../../../util/constants";

const FeedContainer = (props) => {
    const {width} = useWindowDimensions();

    return (
        <MainContainer>
            <Fetcher fetchPosts={props.fetchPosts}>
                {props.children}
            </Fetcher>
            {width > MAX_MOBILE_WIDTH ? <RecommendNav /> : null}
        </MainContainer>
    );
};

const mapStateToProps = state => {
    const { auth, social } = state;
    return { auth: auth, social: social };
};

FeedContainer.propTypes = {
    fetchPosts: PropTypes.func.isRequired
}

export default connect(mapStateToProps)(FeedContainer);
