// @flow

import React from "react";

import {button, buttonPrimary} from "../../../../../../../../css/form.css";
import {mT1} from "../../../../../../../../css/layout.css";
import postStyles from "../../../../../../../../css/components/post.css";

import DownloadIcon from "../../../../../../../../assets/svg/icons/download.svg";
import ArchiveGraphic from "../../../../../../../../assets/graphics/magnet.svg";

const Magnet = (props) => {
    return (
        <div className={postStyles.fileContainer}>
            <div className={postStyles.file}>
                <label className={postStyles.name}>Magnet Link</label>
                <br />
                <ArchiveGraphic />
                <a href={props.magnet.magnet} className={button + ' ' + buttonPrimary + ' ' + mT1} download><DownloadIcon width={15}/>Open</a>
            </div>
        </div>
    );
};

export default Magnet;
