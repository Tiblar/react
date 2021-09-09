// @flow

import React from "react";

import postStyles from "../../../../../../../../css/components/post.css";

import {POST_FILE} from "../../../../../../../../util/constants";

const Row = (props) => {

    return (
        <div className={postStyles.row} style={{ flex: ([POST_FILE].includes(props.type) ? 0 : 1) }}>
            {props.children}
        </div>
    );
};

export default Row;
