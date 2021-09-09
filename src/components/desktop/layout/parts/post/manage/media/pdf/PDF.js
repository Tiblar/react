// @flow

import React from "react";

import postStyles from "../../../../../../../../css/components/post.css";

const PDF = (props) => {
    return (
        <div className={postStyles.pdf}>
            <iframe frameBorder={0} src={props.file.blob}/>
        </div>
    );
};

export default PDF;
