// @flow

import React from "react";
import {toast} from "react-toastify";
import axios from "axios";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

import cardStyles from "../../../../../../css/layout/social/settings/card.css";
import formStyles from "../../../../../../css/form.css";
import layoutStyles from "../../../../../../css/layout.css";

import BackIcon from "../../../../../../assets/svg/icons/arrowLeft.svg";
import CircleLoading from "../../../../../../assets/loading/circle-loading.svg";

import {
    SWITCH_EDITING_PASSWORD,
    SWITCH_SAVING,
    UPDATE_NEW_PASSWORD,
    UPDATE_OLD_PASSWORD,
    useAccountDispatch,
    useAccountState
} from "./context";
import {CONTAINER, REVERT, useLayerDispatch} from "../../../layer/context";
import history from "../../../../../../util/history";
import {API_URL, MAX_MOBILE_WIDTH} from "../../../../../../util/constants";
import useWindowDimensions from "../../../../../../util/hooks/useWindowDimensions";

function ChangePassword(props) {
    const dispatch = useAccountDispatch();
    const { oldPassword, newPassword, saving } = useAccountState();
    const {width} = useWindowDimensions();

    const layerDispatch = useLayerDispatch();

    function handleAccountSave() {
        if(saving){
            return;
        }

        dispatch({ type: SWITCH_SAVING });

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        let data = {
            new_password: newPassword.value,
            old_password: oldPassword.value,
        }

        axios
            .patch(API_URL + "/auth/change-password", data, config)
            .then(res => {
                if(res.data.data){
                    dispatch({ type: SWITCH_EDITING_PASSWORD });
                    dispatch({ type: SWITCH_SAVING });
                    dispatch({ type: UPDATE_OLD_PASSWORD, payload: { value: "", error: null } });
                    dispatch({ type: UPDATE_NEW_PASSWORD, payload: { value: "", error: null } });
                }

                const Notification = () => (
                    <div>
                        Your password has been updated!
                    </div>
                );

                toast(<Notification />, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
            .catch(err => {
                dispatch({ type: SWITCH_SAVING });

                if(err.response && err.response.data.message === "Bad credentials."){
                    dispatch({ type: UPDATE_OLD_PASSWORD, payload: { error: "Wrong password." } });
                }else if(err.response && err.response.data.errors.new_password){
                    dispatch({ type: UPDATE_NEW_PASSWORD, payload: { error: err.response.data.errors.new_password } });
                }else{
                    dispatch({ type: UPDATE_OLD_PASSWORD, payload: { error: null } });
                    dispatch({ type: UPDATE_NEW_PASSWORD, payload: { error: null } });

                    const Notification = () => (
                        <div>
                            There was an error!
                        </div>
                    );

                    toast.error(<Notification />, {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            });
    }

    function handleOldPassword(e) {
        let value = e.target.value;
        dispatch({ type: UPDATE_OLD_PASSWORD, payload: { value: value } })
    }

    function handleNewPassword(e) {
        let value = e.target.value;
        dispatch({ type: UPDATE_NEW_PASSWORD, payload: { value: value } })
    }

    function handleBack() {
        dispatch({ type: SWITCH_EDITING_PASSWORD })
        dispatch({ type: SWITCH_SAVING, payload: false })
        dispatch({ type: UPDATE_OLD_PASSWORD, payload: { value: "", error: null } });
        dispatch({ type: UPDATE_NEW_PASSWORD, payload: { value: "", error: null } });
    }

    function handleForgot() {
        layerDispatch({ type: CONTAINER, payload: REVERT });
        history.push("/forgot");
    }

    return (
        <div className={cardStyles.card + ' ' + layoutStyles.mB1}>
            <div className={cardStyles.cardTitle}>
                <button className={formStyles.button + ' ' + formStyles.buttonIcon + ' ' + layoutStyles.mR1}
                        onClick={handleBack}>
                    <BackIcon height={16} />
                </button>
                Change Password
            </div>
            <div className={cardStyles.cardBody}>
                {
                    width > MAX_MOBILE_WIDTH &&
                    <div className={layoutStyles.tbRowM}>
                        <div className={layoutStyles.tbCol6}>
                            <div className={formStyles.formGroup}>
                                {
                                    oldPassword.error === null && <label>Current Password</label>
                                }
                                {
                                    oldPassword.error !== null &&
                                    <label style={{minHeight: "22px"}} className={formStyles.invalidLabel}>
                                        {oldPassword.error}
                                    </label>
                                }
                                <input
                                    type="password"
                                    className={
                                        formStyles.input + ' ' +
                                        (oldPassword.error !== null ? formStyles.invalidInput : '')
                                    }
                                    placeholder="Current password"
                                    onChange={handleOldPassword}
                                    value={oldPassword.value} />
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
                                {
                                    oldPassword.error === null && <label>Current Password</label>
                                }
                                {
                                    oldPassword.error !== null &&
                                    <label style={{minHeight: "22px"}} className={formStyles.invalidLabel}>
                                        {oldPassword.error}
                                    </label>
                                }
                                <input
                                    type="password"
                                    className={
                                        formStyles.input + ' ' +
                                        (oldPassword.error !== null ? formStyles.invalidInput : '')
                                    }
                                    placeholder="Current password"
                                    onChange={handleOldPassword}
                                    value={oldPassword.value} />
                            </div>
                        </div>
                    </div>
                }
                {
                    width > MAX_MOBILE_WIDTH &&
                    <div className={layoutStyles.tbRowM}>
                        <div className={layoutStyles.tbCol6}>
                            <div className={formStyles.formGroup}>
                                {
                                    newPassword.error === null && <label>New Password</label>
                                }
                                {
                                    newPassword.error !== null &&
                                    <label style={{minHeight: "22px"}} className={formStyles.invalidLabel}>
                                        {newPassword.error}
                                    </label>
                                }
                                <input
                                    type="password"
                                    className={
                                        formStyles.input + ' ' +
                                        (newPassword.error !== null ? formStyles.invalidInput : '')
                                    }
                                    placeholder="New password"
                                    onChange={handleNewPassword}
                                    value={newPassword.value} />
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
                                {
                                    newPassword.error === null && <label>New Password</label>
                                }
                                {
                                    newPassword.error !== null &&
                                    <label style={{minHeight: "22px"}} className={formStyles.invalidLabel}>
                                        {newPassword.error}
                                    </label>
                                }
                                <input
                                    type="password"
                                    className={
                                        formStyles.input + ' ' +
                                        (newPassword.error !== null ? formStyles.invalidInput : '')
                                    }
                                    placeholder="New password"
                                    onChange={handleNewPassword}
                                    value={newPassword.value} />
                            </div>
                        </div>
                    </div>
                }
                {
                    width > MAX_MOBILE_WIDTH &&
                    <div className={layoutStyles.tbRowM}>
                        <div className={layoutStyles.tbCol6}>
                            <hr />
                            {
                                props.auth.user.email === null &&
                                <small>Forgot your password? Add an email to reset it.</small>
                            }
                            {
                                props.auth.user.email !== null &&
                                <small>Forgot your password? <Link onClick={handleForgot} to="#">Click here to reset it</Link>.</small>
                            }
                        </div>
                        <div className={layoutStyles.tbCol6} />
                    </div>
                }
                {
                    width <= MAX_MOBILE_WIDTH &&
                    <div className={layoutStyles.tbRowM}>
                        <div className={layoutStyles.tbCol12}>
                            <hr />
                            {
                                props.auth.user.email === null &&
                                <small>Forgot your password? Add an email to reset it.</small>
                            }
                            {
                                props.auth.user.email !== null &&
                                <small>Forgot your password? <Link onClick={handleForgot} to="#">Click here to reset it</Link>.</small>
                            }
                        </div>
                    </div>
                }
                <button
                        className={
                            formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + formStyles.buttonIcon + ' ' + layoutStyles.mT1
                        }
                        style={{minHeight: "34px"}}
                        disabled={
                            (!oldPassword.value || oldPassword.value.length === 0) ||
                            (!newPassword.value || newPassword.value.length === 0)
                        }
                        onClick={handleAccountSave}>
                    {
                        !saving && "Save"
                    }
                    {
                        saving && <CircleLoading width={16} />
                    }
                </button>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(ChangePassword);
