// @flow

import React from "react";
import {connect} from "react-redux";

import Container from "../../layout/parts/social/container/AccountCenterContainer";
import {default as Page} from "../../layout/parts/social/notifications/Notifications";

function Notifications(props) {

    return (
        <Container>
            <Page />
        </Container>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(Notifications);
