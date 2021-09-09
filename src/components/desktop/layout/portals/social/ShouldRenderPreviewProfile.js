// @flow

import React  from "react";
import {connect} from "react-redux";

import PreviewProfile from "../../parts/user/PreviewProfile";

function ShouldRenderPreviewProfile(props) {
    if(props.social.previewProfile.show) {
        return <PreviewProfile />;
    }

    return null;
}

const mapStateToProps = state => {
    const { social } = state;
    return { social: social };
};

export default connect(mapStateToProps)(ShouldRenderPreviewProfile);
