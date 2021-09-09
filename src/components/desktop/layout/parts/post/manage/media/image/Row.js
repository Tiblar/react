// @flow

import React, {useRef} from "react";
import ReactTooltip from "react-tooltip";

import postStyles from "../../../../../../../../css/components/post.css";
import postModalStyles from "../../../../../../../../css/layout/social/post-modal.css";

import {useManageActions, useManageState} from "../../context";
import {button, buttonIcon} from "../../../../../../../../css/form.css";
import PlusIcon from "../../../../../../../../assets/svg/icons/plus.svg";
import {MAX_IMAGE_FILES} from "../../../../../../../../util/constants";

const Row = (props) => {
    let inputRef = useRef();
    let { addFiles } = useManageActions();
    const {files} = useManageState();

    function handleFileChange() {
        handleFiles(inputRef.current.files);
    }

    function handleFiles(rawFiles) {
        addFiles(rawFiles, props.row.id);

        inputRef.current.value = "";
    }

    return (
        <div className={postStyles.row}>
            <input type="file"
                   className={postModalStyles.input}
                   onChange={handleFileChange}
                   ref={inputRef} />
            {
                props.children.length < 3 && files.length < MAX_IMAGE_FILES &&
                <button className={button + ' ' + buttonIcon + ' ' + postModalStyles.rowAddButton}
                        data-tip
                        data-for={props.row.id + "_add"}
                        onClick={() => { inputRef.current.click() }}>
                    <PlusIcon width={20} />
                    <ReactTooltip
                        id={props.row.id + "_add"}
                        type="dark"
                        effect="solid"
                    >
                        <span>Add image to row</span>
                    </ReactTooltip>
                </button>
            }
            {props.children}
        </div>
    );
};

export default Row;
