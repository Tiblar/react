// @flow

import React from "react";

import {button, buttonPrimary} from "../../../../../../../../css/form.css";
import {mT1} from "../../../../../../../../css/layout.css";
import postStyles from "../../../../../../../../css/components/post.css";

import DownloadIcon from "../../../../../../../../assets/svg/icons/download.svg";
import ArchiveGraphic from "../../../../../../../../assets/graphics/archive.svg";

import humanFileSize from "../../../../../../../../util/humanFileSize";

const File = (props) => {
    return (
        <div className={postStyles.file}>
            <label className={postStyles.name}>
                {
                    props.file.original_name && props.file.original_name.length > 30
                        ? props.file.original_name.substring(0, 30) + "..." : props.file.original_name
                }
            </label>
            <p className={postStyles.size}>{humanFileSize(props.file.file.file_size)}</p>
            <ArchiveGraphic />
            <a href={props.file.file.url} className={button + ' ' + buttonPrimary + ' ' + mT1} download><DownloadIcon width={15}/>Download</a>
        </div>
    );
};

export default File;
