// @flow

import React, {useState} from "react";
import { connect } from "react-redux";
import {toast} from "react-toastify";
import axios from "axios";

import cardStyles from "../../../../../../css/layout/social/settings/card.css";
import formStyles from "../../../../../../css/form.css";
import layoutStyles from "../../../../../../css/layout.css";

import MailIcon from "../../../../../../assets/svg/icons/envelope.svg";

import {API_URL, TWO_FACTOR_EMAIL} from "../../../../../../util/constants";
import store from "../../../../../../store";
import {loadUser} from "../../../../../../reducers/auth/actions";

function TwoFactorEmail(props) {

    const [manager, setManager] = useState({
        disableRequest: false,
    })

    if(props.auth.user === null){
        return null;
    }

    function handleSelect() {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios
            .post(API_URL + "/auth/two-factor/email", config)
            .then(res => {
                if(res.data.data){
                    store.dispatch(loadUser());

                    const Notification = () => (
                        <div>
                            Email two factor enabled
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

                    return;
                }

                error();
            })
            .catch(err => {
                error();
            });
    }

    function handleDisable() {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios
            .delete(API_URL + "/auth/two-factor/email", config)
            .then(res => {
                setManager({
                    ...manager,
                    disableRequest: true,
                })

                const Notification = () => (
                    <div>
                        Email with confirmation link sent.
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
                if(err.response && err.response.status === 429){
                    error("Try again in a few minutes.");
                }else{
                    error();
                }
            });
    }

    function error(message = null) {
        const Notification = () => (
            <div>
                {message === null ? "There was an error" : message}
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

    return (
        <div className={cardStyles.cardFooter}>
            <div className={layoutStyles.mR1}>
                <MailIcon width="35" />
            </div>
            <div>
                <h4 className={layoutStyles.mN}>E-Mail</h4>
                <p className={formStyles.small + " " + formStyles.muted}>
                    Get an email and enter a code.
                </p>
            </div>
            {
                props.auth.user.two_factor_type !== TWO_FACTOR_EMAIL &&
                <button className={formStyles.button + " " + layoutStyles.mL}
                        onClick={handleSelect}
                        disabled={props.auth.user.email === null}>
                    Select
                </button>
            }
            {
                props.auth.user.two_factor_type === TWO_FACTOR_EMAIL &&
                <button className={formStyles.button + ' ' + formStyles.buttonSecondary + ' ' + layoutStyles.mL}
                        onClick={handleDisable}>
                    Disable
                </button>
            }
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(TwoFactorEmail);
