// @flow

import React from "react";

import postStyles from "../../../../../../../../css/components/post.css";

import {POST_AUDIO, POST_FILE, POST_PDF} from "../../../../../../../../util/constants";
import Audio from "../audio/Audio";
import PDF from "../pdf/PDF";
import File from "../file/File";
import Row from "./Row";


const FileContainer = (props) => {
    return (
        <div className={postStyles.rows + ' ' + postStyles.fileContainer}>
            {props.files.map(file => (
                <Row file={file} type={props.type} key={file.id}>
                    {props.type === POST_AUDIO && <Audio file={file}/>}
                    {props.type === POST_PDF && <PDF file={file}/>}
                    {props.type === POST_FILE && <File file={file}/>}
                </Row>
            ))}
        </div>
    );
};

export default FileContainer;
