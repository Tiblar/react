// @flow

import React from "react";
import axios from "axios";
import PropTypes from "prop-types";

import formStyles from "../../../../../../css/form.css";

import {API_URL, MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH} from "../../../../../../util/constants";
import {UPDATE_USERNAME, useAccountDispatch, useAccountState} from "./context";

function ChangeUsername(props) {
    const dispatch = useAccountDispatch();
    const { username } = useAccountState();

    function handleUsername(e) {
        let value = e.target.value;

        dispatch({ type: UPDATE_USERNAME, payload: { value: value } })

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios
            .get(API_URL + "/auth/validate-username?username=" + value, config)
            .then(res => {
                let now = new Date();

                if(now.valueOf() < username.updated.valueOf()){
                    return;
                }

                dispatch({ type: UPDATE_USERNAME, payload: {
                        value: value,
                        updated: now,
                        error: null,
                    }
                })
            })
            .catch(err => {
                let now = new Date();

                if(now.valueOf() < username.updated.valueOf()){
                    return;
                }

                if(props.username !== value && err.response.data.errors.username){
                    dispatch({ type: UPDATE_USERNAME, payload: {
                            updated: now,
                            error: err.response.data.errors.username,
                        }
                    })
                }else if(props.username === value){
                    dispatch({ type: UPDATE_USERNAME, payload: {
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
                username.error === null && <label>Username</label>
            }
            {
                username.error !== null &&
                <label style={{minHeight: "22px"}} className={formStyles.invalidLabel}>
                    {username.error}
                </label>
            }
            <input
                type="text"
                className={
                    formStyles.input + ' ' +
                    (username.error !== null && props.username !== username.value ? formStyles.invalidInput : '')
                    + ' ' +
                    (username.error === null && props.username !== username.value ? formStyles.validInput : '')
                }
                placeholder="Username"
                minLength={3}
                maxLength={16}
                onChange={handleUsername}
                value={username.value} />
        </div>
    );
}

ChangeUsername.propTypes = {
    username: PropTypes.string.isRequired,
};

export default ChangeUsername;
