// @flow

import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import MainContainer from "../container/MainContainer";
import Fetcher from "./Fetcher";

const FeedContainer = (props) => {

    return (
        <MainContainer>
            <Fetcher fetchPosts={props.fetchPosts}>
                {props.children}
            </Fetcher>
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
