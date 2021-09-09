// @flow

import React, {useState} from "react";

import {button, buttonIcon} from "../../../../../../../../css/form.css";
import postStyles from "../../../../../../../../css/components/post.css";
import postModalStyles from "../../../../../../../../css/layout/social/post-modal.css";

import RotateIcon from "../../../../../../../../assets/svg/icons/arrowCurve.svg";
import RemoveIcon from "../../../../../../../../assets/svg/icons/times.svg";

import {useManageActions} from "../../context";

const Image = (props) => {
    const { updateFile, removeFile } = useManageActions();

    let [manager, setManager] = useState({
        buttons: {
            show: false,
            hide: false
        }
    });

    function handleRotate() {
        props.image.rotate += 90;

        if(props.image.rotate === 360){
            props.image.rotate = 0;
        }

        updateFile(props.image);
    }

    function handleRemove() {
        removeFile(props.image)
    }

    function showButtons() {
        if(!manager.buttons.show){
            setManager({
                ...manager,
                buttons: {
                    ...manager.buttons,
                    show: true,
                },
            });
        }
    }

    function hideButtons() {
        setManager({
            ...manager,
            buttons: {
                ...manager.buttons,
                hide: true,
            },
        });

        setTimeout(() => {
            setManager({
                ...manager,
                buttons: {
                    ...manager.buttons,
                    hide: false,
                    show: false,
                },
            });
        }, 200)
    }

    return (
        <div className={postStyles.image}
             style={{width: `calc(100% / ${props.rowCount})`, height: `${props.height}px`}}
             data-id={props.image.id}
             onMouseOver={showButtons}
             onMouseLeave={hideButtons}>
            {
                manager.buttons.show &&
                <div>
                    <button className={button + ' ' + buttonIcon + ' ' + postModalStyles.removeButton + ' ' + postModalStyles.optionButton + ' ' + (manager.buttons.hide ? postModalStyles.hide : '')}
                            onClick={handleRemove}>
                        <RemoveIcon height={15} />
                    </button>
                    <button className={button + ' ' + buttonIcon + ' ' + postModalStyles.rotateButton + ' ' + postModalStyles.optionButton + ' ' + (manager.buttons.hide ? postModalStyles.hide : '')}
                            onClick={handleRotate}>
                        <RotateIcon height={15} />
                    </button>
                </div>
            }
            <img src={props.image.base64} alt={props.image.file.name} />
        </div>
    );
};

export default Image;
