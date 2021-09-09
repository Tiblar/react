// @flow

import React from "react";
import PropTypes from "prop-types";

import cardStyles from "../../../../../../css/layout/social/settings/card.css";
import formStyles from "../../../../../../css/form.css";
import layoutStyles from "../../../../../../css/layout.css";

import CheckIcon from "../../../../../../assets/svg/icons/check.svg";
import TimesIcon from "../../../../../../assets/svg/icons/times.svg";

import {SWITCH_EDITING, SWITCH_EDITING_PASSWORD, useAccountDispatch} from "./context";
import useWindowDimensions from "../../../../../../util/hooks/useWindowDimensions";
import {MAX_MOBILE_WIDTH} from "../../../../../../util/constants";

function CurrentAccount(props) {
    const {width} = useWindowDimensions();
    const dispatch = useAccountDispatch();

    function handleAccountEdit() {
        dispatch({ type: SWITCH_EDITING })
    }

    function handleEditPassword() {
        dispatch({ type: SWITCH_EDITING_PASSWORD })
    }

    return (
        <div className={cardStyles.card + " " + layoutStyles.mB1}>
            <div className={cardStyles.cardBody}>
                <div className={layoutStyles.mB1}>
                    {
                        width > MAX_MOBILE_WIDTH &&
                        <div className={layoutStyles.tbRowM}>
                            <div className={layoutStyles.tbCol6}>
                                <div className={formStyles.formGroup}>
                                    <label>Username</label>
                                    <div className={formStyles.fill}>
                                        <div className={formStyles.icon}>
                                            {props.username && (
                                                <CheckIcon className={formStyles.success} height="15" />
                                            )}
                                            {!props.username && (
                                                <TimesIcon className={formStyles.danger} height="15" />
                                            )}
                                        </div>
                                        <p style={{overflow: "hidden", wordBreak: "unset"}}>
                                            {props.username}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className={layoutStyles.tbCol6}>
                                <div className={formStyles.formGroup}>
                                    <label>Email</label>
                                    <div className={formStyles.fill}>
                                        <div className={formStyles.icon}>
                                            {props.email && (
                                                <CheckIcon className={formStyles.success} height="15" />
                                            )}
                                            {!props.email && (
                                                <TimesIcon className={formStyles.danger} height="15" />
                                            )}
                                        </div>
                                        <p style={{overflow: "hidden", wordBreak: "unset"}}>
                                            {props.email ? props.email : ""}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        width <= MAX_MOBILE_WIDTH &&
                        <div className={layoutStyles.mT1}>
                            <div className={formStyles.formGroup}>
                                <label>Username</label>
                                <div className={formStyles.fill}>
                                    <div className={formStyles.icon}>
                                        {props.username && (
                                            <CheckIcon className={formStyles.success} height="15" />
                                        )}
                                        {!props.username && (
                                            <TimesIcon className={formStyles.danger} height="15" />
                                        )}
                                    </div>
                                    <p style={{overflow: "hidden", wordBreak: "unset"}}>
                                        {props.username}
                                    </p>
                                </div>
                            </div>
                            <div className={formStyles.formGroup}>
                                <label>Email</label>
                                <div className={formStyles.fill}>
                                    <div className={formStyles.icon}>
                                        {props.email && (
                                            <CheckIcon className={formStyles.success} height="15" />
                                        )}
                                        {!props.email && (
                                            <TimesIcon className={formStyles.danger} height="15" />
                                        )}
                                    </div>
                                    <p style={{overflow: "hidden", wordBreak: "unset"}}>
                                        {props.email ? props.email : ""}
                                    </p>
                                </div>
                            </div>
                        </div>
                    }
                    <button className={formStyles.button + " " + layoutStyles.mT1}
                            onClick={handleAccountEdit}>
                        Change
                    </button>
                </div>
                <hr />
                <div className={layoutStyles.mT1}>
                    {
                        width > MAX_MOBILE_WIDTH &&
                        <div className={layoutStyles.tbRowM}>
                            <div className={layoutStyles.tbCol6}>
                                <div className={formStyles.formGroup}>
                                    <label>Password</label>
                                    <div className={formStyles.fill}>
                                        <div className={formStyles.icon}>
                                            <CheckIcon className={formStyles.success} height="15" />
                                        </div>
                                        <p>
                                            *******
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className={layoutStyles.tbCol6} />
                        </div>
                    }
                    {
                        width <= MAX_MOBILE_WIDTH &&
                        <div className={layoutStyles.tbRowM}>
                            <div className={layoutStyles.tbCol12}>
                                <div className={formStyles.formGroup}>
                                    <label>Password</label>
                                    <div className={formStyles.fill}>
                                        <div className={formStyles.icon}>
                                            <CheckIcon className={formStyles.success} height="15" />
                                        </div>
                                        <p>
                                            *******
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <button className={formStyles.button + " " + layoutStyles.mT1}
                        onClick={handleEditPassword}>
                    Change
                </button>
            </div>
        </div>
    );
}

CurrentAccount.propTypes = {
    username: PropTypes.string.isRequired,
    email: PropTypes.string,
};

export default CurrentAccount;
