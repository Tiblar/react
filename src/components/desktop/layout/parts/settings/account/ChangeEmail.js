// @flow

import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import ReactTooltip from "react-tooltip";

import formStyles from "../../../../../../css/form.css";
import layoutStyles from "../../../../../../css/layout.css";

import {API_URL} from "../../../../../../util/constants";
import {UPDATE_EMAIL, useAccountDispatch, useAccountState} from "./context";

function ChangeEmail(props) {
    const dispatch = useAccountDispatch();
    const { email } = useAccountState();

    function handleEmail(e) {
        let value = e.target.value;

        dispatch({ type: UPDATE_EMAIL, payload: { value: value } })

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios
            .get(API_URL + "/auth/validate-email?email=" + value, config)
            .then(res => {
                let now = new Date();

                if(now.valueOf() < email.updated.valueOf()){
                    return;
                }

                dispatch({ type: UPDATE_EMAIL, payload: {
                        value: value,
                        updated: now,
                        error: null,
                    }
                })
            })
            .catch(err => {
                let now = new Date();

                if(now.valueOf() < email.updated.valueOf()){
                    return;
                }

                if(props.email !== value && err.response.data.errors.email){
                    dispatch({ type: UPDATE_EMAIL, payload: {
                            updated: now,
                            error: err.response.data.errors.email,
                        }
                    })
                }else if(props.email === value){
                    dispatch({ type: UPDATE_EMAIL, payload: {
                            updated: now,
                            error: null,
                        }
                    })
                }
            });
    }

    return (
        <div className={formStyles.formGroup}>
            {
                email.error === null && <label>Email</label>
            }
            {
                email.error !== null &&
                <label style={{minHeight: "22px"}} className={formStyles.invalidLabel}>
                    {email.error}
                </label>
            }
            {
                props.auth.user.two_factor &&
                <ReactTooltip id="two-factor-email" place="top" type="dark" effect="solid">
                    <span>Disable two factor to change</span>
                </ReactTooltip>
            }
            <div className={layoutStyles.flex}
                data-tip
                 data-for="two-factor-email">
                <input
                    type="text"
                    className={
                        formStyles.input + ' ' +
                        (email.error !== null && props.email !== email.value ? formStyles.invalidInput : '')
                        + ' ' +
                        (email.error === null && props.email !== email.value ? formStyles.validInput : '')
                    }
                    disabled={props.auth.user.two_factor}
                    placeholder="Email"
                    onChange={handleEmail}
                    value={email.value} />
            </div>
        </div>
    );
}

ChangeEmail.propTypes = {
    email: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(ChangeEmail);