// @flow

import React, {useState} from "react";

import {button, buttonIcon} from "../../../../../../../../css/form.css";
import postStyles from "../../../../../../../../css/components/post.css";
import postModalStyles from "../../../../../../../../css/layout/social/post-modal.css";

import RemoveIcon from "../../../../../../../../assets/svg/icons/times.svg";

import {useManageActions, useManageState} from "../../context";
import {POST_FILE} from "../../../../../../../../util/constants";

const Row = (props) => {

    const { removeFile } = useManageActions();
    const { type } = useManageState();

    let [manager, setManager] = useState({
        buttons: {
            show: false,
            hide: false
        }
    });

    function handleRemove() {
        removeFile(props.file)
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
        <div className={postStyles.row} style={{ flex: ([POST_FILE].includes(type) ? 0 : 1) }} onMouseOver={showButtons} onMouseLeave={hideButtons}>
            {
                manager.buttons.show &&
                <div>
                    <button
                        className={button + ' ' + buttonIcon + ' ' + postModalStyles.removeButton + ' ' + postModalStyles.optionButton + ' ' + (manager.buttons.hide ? postModalStyles.hide : '')}
                        onClick={handleRemove}>
                        <RemoveIcon height={15}/>
                    </button>
                </div>
            }
            {props.children}
        </div>
    );
};

export default Row;
