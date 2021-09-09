// @flow

import React from "react";

import postStyles from "../../../../../../css/components/post.css";
import { mL, mL1, mB1 } from "../../../../../../css/layout.css";

import ContentLoader from "../../../../../../util/components/ContentLoader";

function LoaderPost(props) {
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

    const ProfileLoader = (props) => (
        <ContentLoader
            speed={2}
            width={55}
            height={55}
            viewBox="0 0 55 55"
        >
            <rect x="0" y="0" rx="14" ry="14" width="55" height="55" />
        </ContentLoader>
    )

    const TimeLoader = (props) => (
        <ContentLoader
            width={120}
            height={22}
            viewBox="0 0 120 22"
        >
            <rect x="0" y="0" rx="2" ry="2" width="120" height="22" />
        </ContentLoader>
    )

    const InteractionLoader = (props) => (
        <ContentLoader
            width={67}
            height={34}
            viewBox="0 0 67 34"
        >
            <rect x="0" y="0" rx="2" ry="2" width="67" height="34" />
        </ContentLoader>
    )

    return (
        <div className={postStyles.post + ' ' + mB1}>
            <div className={postStyles.header}>
                <ProfileLoader />
                <h4></h4>
                <span className={postStyles.date}><TimeLoader /></span>
            </div>
            <div className={postStyles.body}>
                <BodyLoader />
            </div>
            <div className={postStyles.footer}>
                <div className={postStyles.interactions}>
                    <div>
                        <InteractionLoader />
                    </div>
                    <div className={mL1}>
                        <InteractionLoader />
                    </div>
                    <div className={mL}>
                        <InteractionLoader />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoaderPost;
