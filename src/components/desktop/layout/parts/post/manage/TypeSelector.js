// @flow

import React from "react";
import ReactTooltip from "react-tooltip";

import typeStyles from "../../../../../../css/layout/social/type-selector.css";

import TextIcon from "../../../../../../assets/svg/icons/text.svg";
import PollIcon from "../../../../../../assets/svg/icons/poll.svg";
import MagnetIcon from "../../../../../../assets/svg/icons/magnet.svg";

import {POST_MAGNET, POST_POLL, POST_TEXT} from "../../../../../../util/constants";
import {UPDATE_POST_TYPE, useManageDispatch} from "./context";

function TypeSelector(props) {
    const dispatch = useManageDispatch();

    let types = [
        {
            name: 'Normal',
            icon: <TextIcon width={18}/>,
            type: POST_TEXT,
        },
        {
            name: 'Poll',
            icon: <PollIcon width={18}/>,
            type: POST_POLL,
        },
        {
            name: 'Magnet',
            icon: <MagnetIcon width={18}/>,
            type: POST_MAGNET,
        },
    ];

    function changeType(type) {
        if(props.submitting){
            return;
        }

        if([POST_TEXT, POST_POLL, POST_MAGNET].includes(type)){
            dispatch({ type: UPDATE_POST_TYPE, payload: type });
        }
    }

    let rows = types.map(type => (
        <div className={typeStyles.type + ' ' + (props.current === type.type || (![POST_MAGNET, POST_POLL].includes(props.current) && type.type === POST_TEXT) ? typeStyles.active : ' ')}
             key={type.type}
             data-tip
             data-for={type.type}
             onClick={() => {changeType(type.type)}}>
            {type.icon}
            <ReactTooltip
                id={type.type}
                type="dark"
                effect="solid"
            >
                <span>{type.name}</span>
            </ReactTooltip>
        </div>
    ));

    return (
       <div className={typeStyles.container}>
           {rows}
       </div>
    );
}

export default TypeSelector;
