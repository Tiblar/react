// @flow

import React from "react";
import {toast} from "react-toastify";
import axios from "axios";
import PropTypes from "prop-types";

import cardStyles from "../../../../../../css/layout/social/settings/card.css";
import formStyles from "../../../../../../css/form.css";
import layoutStyles from "../../../../../../css/layout.css";

import BackIcon from "../../../../../../assets/svg/icons/arrowLeft.svg";
import CircleLoading from "../../../../../../assets/loading/circle-loading.svg";

import {API_URL, MAX_MOBILE_WIDTH} from "../../../../../../util/constants";
import store from "../../../../../../store";
import {setUser} from "../../../../../../reducers/auth/actions";
import {reset} from "../../../../../../reducers/social/actions";

import ChangeUsername from "./ChangeUsername";
import {
    SWITCH_EDITING, SWITCH_SAVING, UPDATE_EMAIL, UPDATE_PASSWORD, UPDATE_USERNAME,
    useAccountDispatch, useAccountState
} from "./context";
import ChangeEmail from "./ChangeEmail";
import validateEmail from "../../../../../../util/validateEmail";
import useWindowDimensions from "../../../../../../util/hooks/useWindowDimensions";

function ChangeAccount(props) {
    const dispatch = useAccountDispatch();
    const { username, email, password, saving } = useAccountState();
    const {width} = useWindowDimensions();

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
            username: username.value,
            email: email.value,
            password: password.value,
        }

        axios
            .patch(API_URL + "/auth/account", data, config)
            .then(res => {
                if(res.data.data){
                    store.dispatch(setUser(res.data.data));
                    store.dispatch(reset());

                    dispatch({ type: SWITCH_EDITING });
                    dispatch({ type: SWITCH_SAVING });
                    dispatch({ type: UPDATE_PASSWORD, payload: { value: "", error: null } });
                    dispatch({ type: UPDATE_USERNAME, payload: { value: username.value, error: null } });
                    dispatch({ type: UPDATE_EMAIL, payload: { value: email.value, error: null } });
                }

                const Notification = () => (
                    <div>
                        Your account has been saved!
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
                    dispatch({ type: UPDATE_PASSWORD, payload: { error: "Wrong password." } });
                }else if(err.response && err.response.data.errors.username && err.response.status === 429){
                    dispatch({ type: UPDATE_USERNAME, payload: { error: err.response.data.errors.username } });
                }else if(err.response && err.response.data.errors.email && (err.response.status === 429 || err.response.status === 403)){
                    dispatch({ type: UPDATE_EMAIL, payload: { error: err.response.data.errors.email } });
                }else{
                    dispatch({ type: UPDATE_PASSWORD, payload: { error: null } });

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

    function handlePassword(e) {
        let value = e.target.value;
        dispatch({ type: UPDATE_PASSWORD, payload: { value: value } })
    }

    function handleBack() {
        dispatch({ type: SWITCH_EDITING })
        dispatch({ type: SWITCH_SAVING, payload: false })
        dispatch({ type: UPDATE_PASSWORD, payload: { value: "", error: null } });
        dispatch({ type: UPDATE_USERNAME, payload: { value: props.username, error: null } });
        dispatch({ type: UPDATE_EMAIL, payload: { value: props.email, error: null } });
    }

    return (
        <div className={cardStyles.card + ' ' + layoutStyles.mB1}>
            <div className={cardStyles.cardTitle}>
                <button className={formStyles.button + ' ' + formStyles.buttonIcon + ' ' + layoutStyles.mR1}
                        onClick={handleBack}>
                    <BackIcon height={16} />
                </button>
                Change Information
            </div>
            <div className={cardStyles.cardBody}>
                {
                    width > MAX_MOBILE_WIDTH &&
                    <div className={layoutStyles.tbRowM}>
                        <div className={layoutStyles.tbCol6}>
                            <ChangeUsername username={props.username} />
                        </div>
                        <div className={layoutStyles.tbCol6}>
                            <ChangeEmail email={props.email} />
                        </div>
                    </div>
                }
                {
                    width <= MAX_MOBILE_WIDTH &&
                    <div className={layoutStyles.mT1}>
                        <div className={layoutStyles.tbRowM}>
                            <div className={layoutStyles.tbCol12}>
                                <ChangeUsername username={props.username} />
                            </div>
                        </div>
                        <div className={layoutStyles.tbRowM}>
                            <div className={layoutStyles.tbCol12}>
                                <ChangeEmail email={props.email} />
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
                                    password.error === null && <label>Password</label>
                                }
                                {
                                    password.error !== null &&
                                    <label style={{minHeight: "22px"}} className={formStyles.invalidLabel}>
                                        {password.error}
                                    </label>
                                }
                                <input
                                    type="password"
                                    className={
                                        formStyles.input + ' ' +
                                        (password.error !== null ? formStyles.invalidInput : '')
                                    }
                                    placeholder="Current password"
                                    onChange={handlePassword}
                                    value={password.value} />
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
                                    password.error === null && <label>Password</label>
                                }
                                {
                                    password.error !== null &&
                                    <label style={{minHeight: "22px"}} className={formStyles.invalidLabel}>
                                        {password.error}
                                    </label>
                                }
                                <input
                                    type="password"
                                    className={
                                        formStyles.input + ' ' +
                                        (password.error !== null ? formStyles.invalidInput : '')
                                    }
                                    placeholder="Current password"
                                    onChange={handlePassword}
                                    value={password.value} />
                            </div>
                        </div>
                    </div>
                }
                <button
                        className={
                            formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + formStyles.buttonIcon + ' ' + layoutStyles.mT1
                        }
                        style={{minHeight: "34px"}}
                        disabled={
                            (!password.value || password.value.length === 0) ||
                            (email.error !== null && props.email !== email.value) ||
                            (!validateEmail(email.value) && email.value !== null && email.value.length !== 0) ||
                            (username.error !== null && props.username !== username.value) ||
                            (props.username === username.value && props.email === email.value)
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

ChangeAccount.propTypes = {
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

export default ChangeAccount;
