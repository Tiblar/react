// @flow

import React, {useRef, useState, useEffect} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import axios from "axios";
import PerfectScrollbar from "perfect-scrollbar";
import {isMobile} from "is-mobile";

import formStyles from "../../../../../../css/form.css";
import modalStyles from "../../../../../../css/components/modal.css";
import layoutStyles, {
    mL
} from "../../../../../../css/layout.css";
import nStyles from "../../../../../../css/components/notification.css";

import LoadingCircle from "../../../../../../assets/loading/dots.svg";

import ProfilePicture from "../../user/ProfilePicture";

import outsideClick from "../../../../../../util/components/outsideClick";
import {
    API_URL,
    NOTIFICATION_FAVORITE, NOTIFICATION_REBLOG
} from "../../../../../../util/constants";
import history from "../../../../../../util/history";

const NotificationModal = (props) => {
    const ref = useRef();
    const listRef = useRef();
    const _isMounted = useRef(true);

    const [manager, setManager] = useState({
        users: [],
        loading: true,
        error: false,
    });

    useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, []);

    useEffect(() => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        axios.get(API_URL + `/users/@me/notifications/causers/${props.notification.id}`, config)
            .then(res => {
                if(res.data.data.users){
                    if(_isMounted.current){
                        setManager(manager => ({
                            ...manager,
                            users: res.data.data.users,
                            loading: false,
                        }));
                    }
                }
            })
            .catch(err => {
                setManager(manager => ({
                    ...manager,
                    error: true,
                    loading: false,
                }));
            });
    }, []);

    useEffect(() => {
        new PerfectScrollbar(listRef.current, {
            suppressScrollX: true
        })
    }, [listRef.current]);

    function handleViewPost() {
        history.push(`/post/${props.notification.post.id}`);
        // remove notification modal
        document.getElementById('mount').click();
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
                                    List of users in this notification
                                </div>
                            </div>
                            <div className={modalStyles.body + ' ' + layoutStyles.positionRelative} style={{height: "400px"}}>
                                <div className={nStyles.listContainer} ref={listRef}>
                                    {
                                        manager.loading &&
                                        <div className={layoutStyles.flex + ' ' + layoutStyles.justifyContentCenter}>
                                            <LoadingCircle width="64px" />
                                        </div>
                                    }
                                    {
                                        manager.users && manager.users.map((user, i) => (
                                            <Link className={
                                                layoutStyles.flex + ' ' + layoutStyles.alignItemsCenter + ' ' + nStyles.user
                                            } to={`/${user.info.username}`} key={user.id}>
                                                <ProfilePicture user={user} small={true} />
                                                <p className={layoutStyles.mL1}>
                                                    {user.info.username}
                                                </p>
                                            </Link>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className={modalStyles.footer}>
                                <button className={formStyles.button} onClick={props.close}>Close</button>
                                {
                                    [NOTIFICATION_FAVORITE, NOTIFICATION_REBLOG].includes(props.notification.type) &&
                                    <button onClick={handleViewPost} className={formStyles.button + ' ' + mL}>
                                        View Post
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

NotificationModal.propTypes = {
    notification: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
}

export default NotificationModal;