// @flow

import React, {useState, useRef} from "react";
import axios from "axios";
import {connect} from "react-redux";
import DOMPurify from "dompurify";
import {isMobile} from "is-mobile";

import ReplyIcon from "../../../../../../../../assets/svg/icons/share.svg";
import EllipsisV from "../../../../../../../../assets/svg/icons/ellipsisV.svg";
import DeleteIcon from "../../../../../../../../assets/svg/icons/question.svg";

import postStyles from "../../../../../../../../css/components/post.css";
import {hide, mL} from "../../../../../../../../css/layout.css";
import formStyles from "../../../../../../../../css/form.css";
import mobileOptionsStyles from "../../../../../../../../css/components/mobile-options.css";

import {API_URL} from "../../../../../../../../util/constants";
import {formatDate} from "../../../../../../../../util/date";
import outsideClick from "../../../../../../../../util/components/outsideClick";
import {parseMentions} from "../../../../../../../../util/parsePost";

import ContentLoader from "../../../../../../../../util/components/ContentLoader";
import store from "../../../../../../../../store";
import {previewShow, previewUserId} from "../../../../../../../../reducers/social/actions";
import history from "../../../../../../../../util/history";
import {colorizeStyle} from "../../../../../../../../util/colorizeStyle";

const ReplyContainer = (props) => {
    const [manager, setManager] = useState({
        loading: true,
        showDelete: false,
        deleted: false,
    });

    const ref = useRef();

    const AvatarLoader = () => (
        <ContentLoader
            width={32}
            height={32}
            viewBox="0 0 32 32"
        >
            <rect x="0" y="0" rx="2" ry="2" width="32" height="32" />
        </ContentLoader>
    );

    function handleDelete() {
        const config = {
            headers: {
                "Content-Type": "application/json"
            },
        };

        axios.delete(API_URL + '/post/reply/' + props.reply.id, config)
            .then(function (res) {
                setManager({ ...manager, showDelete: false, deleted: true, });
            })
            .catch(function (err) {

            });
    }

    let replies = props.reply.replies.map(reply => (
        <Reply key={reply.id} reply={reply} replyAction={props.replyAction} />
    ));

    outsideClick(ref, () => {
       setManager({ ...manager, showDelete: false, });
    });

    function handleClick() {
        store.dispatch(previewShow(true));
        store.dispatch(previewUserId(props.reply.author.id));
    }

    let html = DOMPurify.sanitize(props.reply.body);
    html = parseMentions(html, props.reply.mentions);

    return (
        <div className={postStyles.reply}>
            <div className={postStyles.main}>
                {
                    (props.reply.author !== null && !manager.deleted) &&
                    <img className={postStyles.avatar + ' ' + (manager.loading ? hide : '')}
                         onLoad={() => { setManager({ ...manager, loading: false }) }}
                         onClick={handleClick}
                         src={props.reply.author.info.avatar} alt="avatar" />
                }
                {
                    (props.reply.author === null || manager.deleted) &&
                        <div className={postStyles.avatar}>
                            <DeleteIcon height={24} width={24} />
                        </div>
                }
                {
                    manager.loading && props.reply.author !== null && !manager.deleted && <AvatarLoader />
                }
                <div className={postStyles.body}>
                    <div className={postStyles.top}>
                        <div className={postStyles.info}>
                            <small style={colorizeStyle(props.reply.author !== null ? props.reply.author.info.username_color : null)}>
                                {(props.reply.author === null || manager.deleted) ? "DELETED" : props.reply.author.info.username}
                            </small>
                            <small className={postStyles.timestamp}>{formatDate(props.reply.timestamp)}</small>
                            {
                                props.reply.author !== null && !manager.deleted &&
                                <div className={postStyles.replyButton} onClick={() => {props.replyAction(props.reply.id)}}>
                                    <ReplyIcon width={14} height={14} />
                                </div>
                            }
                        </div>
                        {
                            (props.reply.author !== null && !manager.deleted && props.auth.isAuthenticated && props.auth.user.id === props.reply.author.id) &&
                            <div className={postStyles.delete + ' ' + mL}
                                 style={{opacity: manager.showDelete ? 1 : ''}}
                                 ref={ref}>
                                <EllipsisV onClick={() => {setManager({ ...manager, showDelete: true })}}
                                           height={14} />
                                {
                                    (manager.showDelete && !isMobile()) &&
                                    <div className={formStyles.dropdownMenu + ' ' + formStyles.dropdownMenuRight} style={{right: "10px"}}>
                                        <div className={formStyles.dropdownItem} onClick={handleDelete}>
                                            <li>
                                                Delete
                                            </li>
                                        </div>
                                    </div>
                                }
                                {
                                    (manager.showDelete && isMobile()) &&
                                    <div className={mobileOptionsStyles.container} onClick={() => {setManager({ ...manager, showDelete: false })}}>
                                        <div className={mobileOptionsStyles.options}>
                                            <div className={mobileOptionsStyles.optionGroup}>
                                                <div className={mobileOptionsStyles.option + ' ' + mobileOptionsStyles.danger} onClick={handleDelete}>
                                                    <p>Delete</p>
                                                </div>
                                            </div>
                                            <div className={mobileOptionsStyles.optionGroup}>
                                                <div className={mobileOptionsStyles.option}>
                                                    <p>Cancel</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                    {
                        !manager.deleted && <p dangerouslySetInnerHTML={{ __html: html }} />
                    }
                    {
                        manager.deleted && <p>[deleted]</p>
                    }
                </div>
            </div>
            {
                replies.length > 0 &&
                <div className={postStyles.replies}>
                    {replies}
                </div>
            }
        </div>
    );
};

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

const Reply = connect(mapStateToProps)(ReplyContainer);
export default Reply;
