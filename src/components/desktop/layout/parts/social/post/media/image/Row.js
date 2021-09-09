// @flow

import React from "react";

import postStyles from "../../../../../../../../css/components/post.css";
import layoutStyles from "../../../../../../../../css/layout.css";

const Row = (props) => {
    return (
        <div className={postStyles.row + (props.last ? ' ' + layoutStyles.pBN : '')}>
            {props.children}
        </div>
    );
};

export default Row;
