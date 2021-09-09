// @flow

import React from "react";

import {input} from "../../../../../../../../css/form.css";
import postModalStyles from "../../../../../../../../css/layout/social/post-modal.css";

import {useManageActions, useManageState} from "../../context";

const Magnet = (props) => {

    const {magnet} = useManageState();
    const actions = useManageActions();

    function handleChange(e) {
        actions.setMagnet(e.target.value)
    }

    return (
        <div className={postModalStyles.poll}>
            <div className={postModalStyles.option}>
                <input className={input} onChange={handleChange} value={magnet} placeholder="Paste magnet link"/>
            </div>
        </div>
    );
};

export default Magnet;
