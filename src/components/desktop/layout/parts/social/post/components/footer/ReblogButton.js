// @flow

import React, {useState, useRef} from "react";
import {toast} from "react-toastify";
import {connect} from "react-redux";
import axios from "axios";
import ReactTooltip from "react-tooltip";
import {Link} from "react-router-dom";
import {isMobile} from "is-mobile";

import postStyles from "../../../../../../../../css/components/post.css";
import formStyles, {button} from "../../../../../../../../css/form.css";
import {mL1} from "../../../../../../../../css/layout.css";
import mobileOptionsStyles from "../../../../../../../../css/components/mobile-options.css";

import ReblogIcon from "../../../../../../../../assets/svg/icons/reblog.svg";

import outsideClick from "../../../../../../../../util/components/outsideClick";

import {API_URL} from "../../../../../../../../util/constants";
import store from "../../../../../../../../store";
import {reblogPost} from "../../../../../../../../reducers/social/actions";
import {REBLOG_POST, useSocialDispatch} from "../../../context";

function ReblogButton(props) {

    let post = props.post.reblog !== null && (props.post.body === null && props.post.attachments.length === 0)
        ? props.post.reblog : props.post;

    const socialDispatch = useSocialDispatch();

    let [manager, setManager] = useState({
        reblogDrop: false,
        viewComments: false,
        replyTo: null,
    });

    const refReblog = useRef();

    let reblogsCount = post.reblogs_count;
    let isReblogged = post.is_reblogged;

    function handleReblog() {
        if(!props.auth.isAuthenticated) return;

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        let url = isReblogged ? "unreblog" : "reblog";

        axios
            .post(API_URL + "/post/" + url + "/" + post.id, {}, config)
            .then(res => {
                if(!isReblogged){
                    const Notification = () => (
                        <div>
                            Reblog made! <Link to={`/post/${res.data.data.reblog.id}`}>Click to view</Link>
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
                }

                store.dispatch(reblogPost(post.id))

                setManager({
                    ...manager,
                    reblogDrop: false
                });
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

    function handleReblogComment() {
        socialDispatch({ type: REBLOG_POST, payload: post.id });
    }

    outsideClick(refReblog, () => {
        if (manager.reblogDrop) {
            setManager({
                ...manager,
                reblogDrop: false
            });
        }
    });

    return (
        <div className={postStyles.reblogButton} ref={refReblog}>
            {
                props.auth.isAuthenticated &&
                <button
                        className={button + ' ' + postStyles.interaction + ' ' + mL1 + ' ' + (isReblogged ? postStyles.reblogged : '')}
                        onClick={() => { setManager({ ...manager, reblogDrop: !manager.reblogDrop }) }}>
                    <ReblogIcon height="16" /><span>{reblogsCount}</span>
                </button>
            }
            {
                (props.auth.isAuthenticated && manager.reblogDrop && !isMobile()) &&
                <div className={formStyles.dropdown} style={{left: "10px"}}>
                    <div className={formStyles.dropdownMenu}>
                        {
                            !isReblogged &&
                            <div className={formStyles.dropdownItem} onClick={handleReblog}>
                                <li>
                                    Reblog
                                </li>
                            </div>
                        }
                        {
                            isReblogged &&
                            <div className={formStyles.dropdownItem} onClick={handleReblog}>
                                <li>
                                    Delete Reblog
                                </li>
                            </div>
                        }
                        {
                            post.poll === null &&
                            <div className={formStyles.dropdownItem} onClick={handleReblogComment}>
                                <li>
                                    Reblog with comment
                                </li>
                            </div>
                        }
                    </div>
                </div>
            }
            {
                (props.auth.isAuthenticated && manager.reblogDrop && isMobile()) &&
                <div className={mobileOptionsStyles.container} onClick={() => { setManager(manager => ({ ...manager, reblogDrop: false })) }}>
                    <div className={mobileOptionsStyles.options}>
                        <div className={mobileOptionsStyles.optionGroup}>
                            {
                                !isReblogged &&
                                <div className={mobileOptionsStyles.option} onClick={handleReblog}>
                                    <p>
                                        Reblog
                                    </p>
                                </div>
                            }
                            {
                                isReblogged &&
                                <div className={mobileOptionsStyles.option} onClick={handleReblog}>
                                    <p>
                                        Delete Reblog
                                    </p>
                                </div>
                            }
                            {
                                post.poll === null &&
                                <div className={mobileOptionsStyles.option} onClick={handleReblogComment}>
                                    <p>
                                        Reblog with comment
                                    </p>
                                </div>
                            }
                        </div>
                        <div className={mobileOptionsStyles.optionGroup}>
                            <div className={mobileOptionsStyles.option}>
                                <p>Cancel</p>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <ReactTooltip id={`login-${props.post.id}`} place="top" type="dark" effect="solid">
                <span>Please login</span>
            </ReactTooltip>
            {
                !props.auth.isAuthenticated &&
                <button className={button + ' ' + postStyles.interaction + ' ' + mL1} data-tip data-for={`login-${props.post.id}`}>
                    <ReblogIcon height="16" /><span>{reblogsCount}</span>
                </button>
            }
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(ReblogButton);
