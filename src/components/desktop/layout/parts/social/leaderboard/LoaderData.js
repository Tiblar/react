// @flow

import React from "react";

import postStyles from "../../../../../../css/components/post.css";
import { mL, mL1, mB1 } from "../../../../../../css/layout.css";

import ContentLoader from "../../../../../../util/components/ContentLoader";

function LoaderData(props) {
    const BodyLoader = (props) => (
        <ContentLoader
            width="100%"
            height={400}
            viewBox="0 0 400 400"
            preserveAspectRatio="none"
        >
            <rect x="5" y="12" rx="3" ry="3" width="350" height="12" />
            <rect x="26" y="34" rx="3" ry="3" width="320" height="12" />
            <rect x="26" y="56" rx="3" ry="3" width="320" height="12" />
            <rect x="26" y="78" rx="3" ry="3" width="240" height="12" />
            <rect x="5" y="109" rx="3" ry="3" width="350" height="12" />
            <rect x="26" y="131" rx="3" ry="3" width="320" height="12" />
            <rect x="26" y="153" rx="3" ry="3" width="320" height="12" />
            <rect x="26" y="175" rx="3" ry="3" width="240" height="12" />
            <rect x="5" y="205" rx="3" ry="3" width="350" height="12" />
            <rect x="26" y="227" rx="3" ry="3" width="320" height="12" />
            <rect x="26" y="249" rx="3" ry="3" width="320" height="12" />
            <rect x="26" y="271" rx="3" ry="3" width="240" height="12" />
        </ContentLoader>
    )

    return (
        <div className={postStyles.post + ' ' + mB1}>
            <div className={postStyles.body}>
                <BodyLoader />
            </div>
        </div>
    );
}

export default LoaderData;
