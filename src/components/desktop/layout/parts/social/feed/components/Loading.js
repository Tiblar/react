// @flow

import React from "react";

import loadingStyles from "../../../../../../../css/layout/social/loading-card.css";

import InfiniteLoading from "../../../../../../../assets/loading/infinite.svg"

function Loading() {
    return (
        <div className={loadingStyles.card}>
            <div className={loadingStyles.body}>
                <InfiniteLoading width={100} />
            </div>
        </div>
    );
}

export default Loading;
