// @flow

import React from "react";

import { tier } from "../../../../../../css/layout/social/settings/pages/upgrade.css";
import formStyles from "../../../../../../css/form.css";
import layoutStyles from "../../../../../../css/layout.css";

import CheckIcon from "../../../../../../assets/svg/icons/check.svg";

function PlebTier(props) {
    return (
        <div className={tier}>
            <h2>Pleb Tier</h2>
            <label>Free</label>
            <div className={layoutStyles.wF}>
                <hr />
            </div>
            <div className={layoutStyles.wF}>
                <div className={formStyles.check}>
                    <CheckIcon height="15" />
                    <span>500 MB storage</span>
                </div>
                <div className={formStyles.check}>
                    <CheckIcon height="15" />
                    <span>100 MB file cap</span>
                </div>
            </div>
        </div>
    );
}

export default PlebTier;
