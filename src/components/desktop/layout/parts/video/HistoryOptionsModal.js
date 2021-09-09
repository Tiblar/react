import React, {useRef, useEffect, useState} from "react";
import {isMobile} from "is-mobile";
import {connect} from "react-redux";
import axios from "axios";

import modalStyles from "../../../../../css/components/modal.css";
import layoutStyles from "../../../../../css/layout.css";
import formStyles from "../../../../../css/form.css";
import {withGap} from "../../../../../css/components/radio.css";

import LoadingCircle from "../../../../../assets/loading/circle-loading.svg";

import outsideClick from "../../../../../util/components/outsideClick";
import {loadUser} from "../../../../../reducers/auth/actions";
import {API_URL} from "../../../../../util/constants";
import store from "../../../../../store";
import {toast} from "react-toastify";

function HistoryOptionsModal(props) {
    const ref = useRef();
    const _isMounted = useRef(true);
    const [manager, setManager] = useState({
        clearing: false,
    })

    useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, []);

    function handleHistory(status) {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios.patch(API_URL + '/users/@me/settings/privacy/video-history', { video_history: status }, config)
            .then(data => {
                store.dispatch(loadUser());
            });
    }

    function handleClear() {
        setManager(manager => ({
            ...manager,
            clearing: true,
        }))

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios.delete(API_URL + '/video/history', config)
            .then(data => {
                setManager(manager => ({
                    ...manager,
                    clearing: false,
                }))

                const Notification = () => (
                    <div>
                        Cleared!
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

                props.close();
            })
            .catch(err => {
                setManager(manager => ({
                    ...manager,
                    clearing: false,
                }))

                const Notification = () => (
                    <div>
                        Something went wrong!
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

    outsideClick(ref, () => {
        props.close();
    });

    return (
        <div className={modalStyles.containerOuter + (isMobile() ? (" " + modalStyles.mobile) : "")}>
            <div className={modalStyles.wrapper}>
                <div className={modalStyles.containerInner}>
                    <div className={modalStyles.modalContainer}>
                        <div className={modalStyles.modal} ref={ref}>
                            <div className={modalStyles.top}>
                                <div className={modalStyles.header}>
                                    <h4>History Settings</h4>
                                </div>
                            </div>
                            <div className={modalStyles.body}>
                                <div>
                                    <p>
                                        History should be:
                                    </p>
                                    <div className={layoutStyles.mT1 + ' ' + layoutStyles.flex + ' ' + layoutStyles.flexColumn}>
                                        <label>
                                            <input name="view"
                                                   checked={props.auth.user.privacy.video_history === true}
                                                   onChange={() => {
                                                       handleHistory(true)
                                                   }}
                                                   className={withGap}
                                                   type="radio" />
                                            <span>saved</span>
                                        </label>
                                        <label>
                                            <input name="view"
                                                   checked={props.auth.user.privacy.video_history === false}
                                                   onChange={() => {
                                                       handleHistory(false)
                                                   }}
                                                   className={withGap}
                                                   type="radio" />
                                            <span>never saved</span>
                                        </label>
                                    </div>
                                </div>
                                <hr className={layoutStyles.mB1 + ' ' + layoutStyles.mT1} />
                                <button
                                    className={formStyles.button + ' ' + formStyles.buttonSecondary + ' ' + formStyles.buttonIcon}
                                    onClick={handleClear}
                                >
                                    {
                                        manager.clearing && <LoadingCircle width={22} />
                                    }
                                    {
                                        !manager.clearing && "Clear History"
                                    }
                                </button>
                            </div>
                            <div className={modalStyles.footer}>
                                <button className={formStyles.button} onClick={props.close}>Close</button>
                            </div>
                        </div>
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

export default connect(mapStateToProps)(HistoryOptionsModal);
