// @flow

import React, {useEffect, useRef, useState} from "react";
import 'react-quill/dist/quill.snow.css';

import {
    input,
    button
} from "../../../../../../css/form.css";
import postStyles from "../../../../../../css/layout/social/post-modal.css";

import UploadGraphic from "../../../../../../assets/graphics/social/upload.svg";

import {useManageActions} from "./context";

const DropArea = (props) => {
    let inputRef = useRef();
    let dropRef = useRef();

    let { addFiles } = useManageActions();

    let [manager, setManager] = useState({
        drop: {
            drag: false,
        },
        dropWidth: 0,
    });

    useEffect(() => {
        setManager(manager => ({
            ...manager,
            dropWidth: dropRef.current.clientWidth/2,
        }));
    }, [dropRef]);

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

    let display = props.modalWidth === 0 ? "none" : "flex";
    return (
        <div className={postStyles.dropAreaWrapper} style={{left: `calc(50% + ${props.modalWidth}px)`, display: display}} ref={dropRef}>
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
                <UploadGraphic width="100%" />
            </div>
            <button className={button} onClick={handleUploadClick}>Choose File</button>
        </div>
    );
};

DropArea.defaultProps = {
    postType: null,
}

export default DropArea;
