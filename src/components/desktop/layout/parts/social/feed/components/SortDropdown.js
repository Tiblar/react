// @flow

import React from "react";
import {connect} from "react-redux";

import Dropdown from "../../../../../../../util/form/components/Dropdown";

import store from "../../../../../../../store";
import {updateSort} from "../../../../../../../reducers/social/actions";

function SortDropdown(props) {
    let navDrop = [
        {
            title: "Newest",
            type: Dropdown.CLICK_TYPE,
            action: () => {store.dispatch(updateSort("newest"))}
        },
        {
            title: "Popular",
            type: Dropdown.CLICK_TYPE,
            action: () => {store.dispatch(updateSort("popular"))}
        }
    ];

    let title = 'Popular';

    if(props.social.sort === 'newest'){
        title = 'Newest'
    }

    return (
        <Dropdown title={title} items={navDrop} />
    );
}

const mapStateToProps = state => {
    const { social } = state;
    return { social: social };
};

export default connect(mapStateToProps)(SortDropdown);

