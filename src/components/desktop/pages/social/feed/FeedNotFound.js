// @flow

import React from "react";
import {connect} from "react-redux";

import {flex, flexColumn, alignItemsCenter, mT2, mT1} from "../../../../../css/layout.css";

import NotFoundGraphic from "../../../../../assets/graphics/social/feed-not-found.svg";
import Container from "../../../layout/parts/social/feed/FeedContainer";

function SocialHome(props) {
    return (
        <Container>
            <div className={flex + ' ' + flexColumn + ' ' + alignItemsCenter + ' ' + mT2}>
                <NotFoundGraphic width="50%"/>
                <h2 className={mT1}>This page does not exist</h2>
            </div>
        </Container>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(SocialHome);