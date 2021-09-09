// @flow

import React from "react";
import axios from "axios";
import {connect} from "react-redux";
import {toast} from "react-toastify";

import formStyles, {button} from "../../../../../../css/form.css";
import layoutStyles, {mN, mT1, tbCol12} from "../../../../../../css/layout.css";
import cardStyles from "../../../../../../css/layout/social/settings/card.css";

import TimesIcon from "../../../../../../assets/svg/icons/times.svg";

import {API_URL} from "../../../../../../util/constants";
import store from "../../../../../../store";
import {loadUser} from "../../../../../../reducers/auth/actions";

function ConfirmEmail(props) {
    if(props.auth.user.confirm_email === null){
        return null;
    }

    function handleCancel() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        };

        axios
            .delete(API_URL + "/auth/confirm-email", config)
            .then(res => {
                store.dispatch(loadUser());
            })
            .catch(err => {
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
            });
    }

    function handleResend() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        };

        axios
            .get(API_URL + "/auth/confirm-email/resend", config)
            .then(res => {
                const Notification = () => (
                    <div>
                        Confirmation email sent!
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
                let Notification = () => (
                    <div>
                        There was an error!
                    </div>
                );

                if(err.response && err.response.status === 404){
                    Notification = () => (
                        <div>
                            Please refresh and try again.
                        </div>
                    );
                }

                if(err.response && err.response.status === 429){
                    Notification = () => (
                        <div>
                            Please wait till trying again.
                        </div>
                    );
                }

                toast.error(<Notification />, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
    }

    return (
        <div className={layoutStyles.tbRowM + ' ' + layoutStyles.mT1 + ' ' + layoutStyles.mB1}>
            <div className={tbCol12}>
                <h4 className={mN}>Confirm Email</h4>
                <div className={cardStyles.card + " " + mT1}>
                    <div className={cardStyles.cardBody}>
                        <div className={layoutStyles.flex + ' ' + layoutStyles.alignItemsCenter}>
                            <div className={formStyles.fill + ' ' + layoutStyles.wF}>
                                <div className={formStyles.icon}>
                                    <TimesIcon className={formStyles.danger} height="15" />
                                </div>
                                <p>
                                    {props.auth.user.confirm_email.email}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={cardStyles.cardFooter}>
                        <button className={formStyles.button + ' ' + formStyles.buttonSmall}
                                onClick={handleResend}>
                            Resend Confirmation Email
                        </button>
                        <button className={formStyles.button + ' ' + formStyles.buttonSmall + ' ' + layoutStyles.mL}
                                onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(ConfirmEmail);
