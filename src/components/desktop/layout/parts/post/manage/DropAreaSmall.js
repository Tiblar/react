// @flow

import React, {useRef, useState} from "react";
import 'react-quill/dist/quill.snow.css';

import {
    input,
} from "../../../../../../css/form.css";
import postStyles from "../../../../../../css/layout/social/post-modal.css";

import {useManageActions} from "./context";

const DropAreaSmall = (props) => {
    let inputRef = useRef();

    let { addFiles } = useManageActions();

    let [manager, setManager] = useState({
        drop: {
            drag: false,
        },
    });

    function handleDragStart(e) {
        e.preventDefault();
        e.stopPropagation();

        if(manager.drop.drag === false){
            setManager(manager => ({
                ...manager,
                drop: {
                    ...manager.drop,
                    drag: true,
                }
            }));
        }
    }

    function handleDragEnd(e) {
        e.preventDefault();
        e.stopPropagation();

        if(manager.drop.drag === true){
            setManager(manager => ({
                ...manager,
                drop: {
                    ...manager.drop,
                    drag: false,
                }
            }));
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        setManager(manager => ({
            ...manager,
            drop: {
                ...manager.drop,
                drag: false,
            }
        }));

        handleFiles(e.dataTransfer.files);
    }

    function handleUploadClick() {
        inputRef.current.click();
    }

    function handleFileChange() {
        handleFiles(inputRef.current.files);
    }

    function handleFiles(rawFiles) {
        addFiles(rawFiles, null, props.postType);

        inputRef.current.value = "";
    }

    return (
        <div className={postStyles.dropAreaSmallWrapper}>
            <div className={postStyles.dropArea + ' ' + (manager.drop.drag ? postStyles.active : '')}
                 onDragOver={handleDragStart}
                 onDragLeave={handleDragEnd}
                 onDrop={handleDrop}
                 onClick={handleUploadClick}
            >
                <input type="file"
                       className={postStyles.input}
                       onChange={handleFileChange}
                       ref={inputRef} />
                <p>Drop or choose files</p>
            </div>
        </div>
    );
};

export default DropAreaSmall;
