// @flow

import React from "react";
import {connect} from "react-redux";

import Dropdown from "../../../../../../util/form/components/Dropdown";

import store from "../../../../../../store";
import {updateType} from "../../../../../../reducers/social/actions";

function TypeDropdown(props) {
    let navDrop = [
        {
            title: "All Types",
            type: Dropdown.CLICK_TYPE,
            action: () => {store.dispatch(updateType("all"))}
        },
        {
            title: "Media Only",
            type: Dropdown.CLICK_TYPE,
            action: () => {store.dispatch(updateType("media"))}
        },
        {
            title: "Text Only",
            type: Dropdown.CLICK_TYPE,
            action: () => {store.dispatch(updateType("text"))}
        }
    ];

    let title = 'All Types';

    if(props.social.type === 'media'){
        title = 'Media Only'
    }

    if(props.social.type === 'text'){
        title = 'Text Only'
    }

    return (
        <Dropdown title={title} items={navDrop} />
    );
}

const mapStateToProps = state => {
    const { social } = state;
    return { social: social };
};

export default connect(mapStateToProps)(TypeDropdown);

