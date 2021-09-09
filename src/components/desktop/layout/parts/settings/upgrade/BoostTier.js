// @flow

import React from "react";
import Slider from "react-input-slider";
import PropTypes from "prop-types";

import { tier } from "../../../../../../css/layout/social/settings/pages/upgrade.css";
import formStyles from "../../../../../../css/form.css";
import layoutStyles from "../../../../../../css/layout.css";

import CheckIcon from "../../../../../../assets/svg/icons/check.svg";

function BoostTier(props) {
    return (
        <div className={tier}>
            <h2>Boost</h2>
            <label>${props.base_cost + (props.slider * props.storage_cost)} / month</label>
            <Slider
                axis="x"
                styles={{
                    track: {
                        width: "95%",
                        marginTop: "0.5em",
                        marginBottom: "0.5em",
                    },
                    active: {
                        backgroundColor: "#017bff",
                    }
                }}
                xmin={1}
                xmax={80}
                xstep={1}
                x={props.slider}
                onChange={({ x }) => props.setSlider(x)}
            />
            <div className={layoutStyles.wF}>
                <hr />
            </div>
            <div className={layoutStyles.wF}>
                <div className={formStyles.check}>
                    <CheckIcon height="15" />
                    <span>{props.slider}00 GB storage cap</span>
                </div>
                <div className={formStyles.check}>
                    <CheckIcon height="15" />
                    <span>10 GB file cap</span>
                </div>
                <div className={formStyles.check}>
                    <CheckIcon height="15" />
                    <span>Change username color</span>
                </div>
                <div className={formStyles.check}>
                    <CheckIcon height="15" />
                    <span>No captchas to post or comment</span>
                </div>
            </div>
            <div className={layoutStyles.wF + " " + layoutStyles.mT2}>
                <button className={formStyles.button + " " + formStyles.buttonPrimary + " " + layoutStyles.wF}
                        onClick={props.handleUpgrade}>
                    Upgrade
                </button>
            </div>
        </div>
    );
}

BoostTier.propTypes = {
    setSlider: PropTypes.func,
    handleUpgrade: PropTypes.func,
    slider: PropTypes.number,
    base_cost: PropTypes.number,
    storage_cost: PropTypes.number,
}

export default BoostTier;
