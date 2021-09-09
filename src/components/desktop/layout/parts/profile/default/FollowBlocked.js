// @flow

import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import axios from "axios";
import {toast} from "react-toastify";
import PropTypes from "prop-types";

import cardStyles from "../../../../../../css/components/card.css";
import layoutStyles from "../../../../../../css/layout.css";
import formStyles from "../../../../../../css/form.css";
import errorCardStyles from "../../../../../../css/layout/social/error-card.css";

import BlockedGraphic from "../../../../../../assets/graphics/follow-blocked.svg";

import {API_URL, SUPPORT_URL} from "../../../../../../util/constants";

function FollowBlocked(props) {
    const [manager, setManager] = useState({
        loadingRequested: true,
        loadingBlocked: true,
        requested: false,
        blocked: false,
        error: false,
    });

    let usernameOrId = null;
    if(typeof props.username === 'string' || props.username instanceof String){
        usernameOrId = props.username;
    }

    if(typeof props.userId === 'string' || props.userId instanceof String){
        usernameOrId = props.userId;
    }

    useEffect(() => {
        fetchStatus();
        fetchBlocked();
    }, []);

    function fetchBlocked() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        };

        axios.get(API_URL + "/users/@me/blocked/" + usernameOrId, config).then(res => {
            if(res.data.data){
                setManager(manager => ({
                    ...manager,
                    blocked: res.data.data.is_blocked,
                    loadingBlocked: false,
                }));
            }
        }).catch(err => {
            setManager(manager => ({
                ...manager,
                error: true,
            }));
        });
    }

    function fetchStatus() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        axios.get(API_URL + "/users/follow/request/" + usernameOrId + "/status", config).then(res => {
            if(res.data.data.outgoing){
                setManager((manager) => ({
                    ...manager,
                    requested: true,
                    loadingRequested: false,
                }));
            }else{
                setManager((manager) => ({
                    ...manager,
                    requested: false,
                    loadingRequested: false,
                }));
            }
        }).catch(err => {
            setManager((manager) => ({
                ...manager,
                error: true,
            }));
        });
    }

    function handleRequest() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        axios.post(API_URL + "/users/follow/request/" + usernameOrId, config).then(res => {
            setManager((manager) => ({
                ...manager,
                requested: true,
            }));
        }).catch(err => {
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

    function handleUnrequest() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        axios.delete(API_URL + "/users/follow/request/" + usernameOrId, config).then(res => {
            setManager((manager) => ({
                ...manager,
                requested: false,
            }));
        }).catch(err => {
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

    return (
        <div className={cardStyles.card + ' ' + errorCardStyles.popupShow}>
            <div className={cardStyles.cardBody}>
                <BlockedGraphic width="100%" />
                <hr className={layoutStyles.mT1 + ' ' + layoutStyles.mB1} />
                {
                    manager.error &&
                    <div className={formStyles.alert}>
                        <p>
                            There was an error. Please refresh, if it continues, <Link to={SUPPORT_URL}>contact support</Link>.
                        </p>
                    </div>
                }
                {
                    !manager.error &&
                    <div className={formStyles.alert}>
                        You need to follow to view this user.
                        {
                            !props.auth.isAuthenticated &&
                            <Link to={`/login`} className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + layoutStyles.mL}>
                                Request
                            </Link>
                        }
                        {
                            props.auth.isAuthenticated && !manager.requested &&
                            <button
                                onClick={handleRequest}
                                disabled={manager.loadingRequested}
                                className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + layoutStyles.mL}>
                                Request
                            </button>
                        }
                        {
                            props.auth.isAuthenticated && manager.requested &&
                            <button
                                onClick={handleUnrequest}
                                disabled={manager.loadingRequested}
                                className={formStyles.button + ' ' + ' ' + layoutStyles.mL}>
                                Cancel Request
                            </button>
                        }
                    </div>
                }
                {
                    props.auth.isAuthenticated &&
                    <div className={formStyles.alert + ' ' + layoutStyles.mT1}>
                        Do you wish to block this user?
                        {
                            <button
                                onClick={handleUnrequest}
                                disabled={manager.loadingBlocked}
                                className={formStyles.button + ' ' + ' ' + layoutStyles.mL}>
                                Block
                            </button>
                        }
                    </div>
                }
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

FollowBlocked.propTypes = {
    username: PropTypes.string,
    userId: PropTypes.string,
}

export default connect(mapStateToProps)(FollowBlocked);
