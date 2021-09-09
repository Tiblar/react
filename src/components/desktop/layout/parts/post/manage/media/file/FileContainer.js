// @flow

import React from "react";

import postStyles from "../../../../../../../../css/components/post.css";

import {useManageState} from "../../context";
import {POST_AUDIO, POST_FILE, POST_PDF} from "../../../../../../../../util/constants";
import Audio from "../audio/Audio";
import PDF from "../pdf/PDF";
import File from "./File";
import Row from "./Row";

const FileContainer = (props) => {
    let { files, type } = useManageState();

    return (
        <div className={postStyles.rows + ' ' + postStyles.fileContainer}>
            {files.map(file => (
                <Row file={file} key={file.id}>
                    {type === POST_AUDIO && <Audio file={file}/>}
                    {type === POST_PDF && <PDF file={file}/>}
                    {type === POST_FILE && <File file={file}/>}
                </Row>
            ))}
        </div>
    );
};

export default FileContainer;
