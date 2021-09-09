// @flow

import React from "react";

import {button, buttonPrimary} from "../../../../../../../../css/form.css";
import postStyles from "../../../../../../../../css/components/post.css";

import DownloadIcon from "../../../../../../../../assets/svg/icons/download.svg";

import {bytesToSize} from "../../../../../../../../util/fileMutator";

const File = (props) => {
    return (
        <div className={postStyles.file}>
            <label className={postStyles.name}>{props.file.file.name}</label>
            <p className={postStyles.size}>{bytesToSize(props.file.file.size)}</p>
            <a href={props.file.blob} className={button + ' ' + buttonPrimary} download><DownloadIcon width={15}/>Download</a>
        </div>
    );
};

export default File;
