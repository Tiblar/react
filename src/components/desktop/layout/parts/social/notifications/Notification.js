// @flow

import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import nStyles from "../../../../../../css/components/notification.css";
import layoutStyles from "../../../../../../css/layout.css";

import HeartIcon from "../../../../../../assets/svg/icons/heart.svg";
import ReblogIcon from "../../../../../../assets/svg/icons/reblog.svg";
import PlusIcon from "../../../../../../assets/svg/icons/plus.svg";
import FrownIcon from "../../../../../../assets/svg/icons/frown.svg";
import RequestIcon from "../../../../../../assets/svg/icons/userPlus.svg";
import MentionIcon from "../../../../../../assets/svg/icons/at.svg";
import ReplyIcon from "../../../../../../assets/svg/icons/comments.svg";

import ProfilePicture from "../../user/ProfilePicture";
import NotificationModal from "./NotificationModal";

import {
    NAV_REQUESTS,
    UPDATE_NAV_NOTIFICATIONS,
    UPDATE_SCROLLING,
    useAccountCenterContextDispatch
} from "./context";
import NotificationPost from "../post/NotificationPost";
import {
    NOTIFICATION_FAVORITE,
    NOTIFICATION_FOLLOW, NOTIFICATION_FOLLOW_REQUEST,
    NOTIFICATION_REBLOG, NOTIFICATION_MENTION,
    NOTIFICATION_UNFOLLOW, NOTIFICATION_REPLY_MENTION,
    NOTIFICATION_REPLY, MAX_MOBILE_WIDTH
} from "../../../../../../util/constants";
import useWindowDimensions from "../../../../../../util/hooks/useWindowDimensions";
import history from "../../../../../../util/history";
import {getShortDate} from "../../../../../../util/date";

function Notification(props) {

    const {width} = useWindowDimensions();
    const dispatch = useAccountCenterContextDispatch();

    const [manager, setManager] = useState({
       modal: false,
    });

    useEffect(() => {
        dispatch({ type: UPDATE_SCROLLING, payload: !manager.modal });
    }, [manager.modal]);

    function getIcon() {
        switch (props.notification.type) {
            case NOTIFICATION_FAVORITE:
                return <HeartIcon width={24} />;
            case NOTIFICATION_REBLOG:
                return <ReblogIcon width={24} />;
            case NOTIFICATION_FOLLOW:
                return <PlusIcon width={24} />;
            case NOTIFICATION_UNFOLLOW:
                return <FrownIcon width={24} />;
            case NOTIFICATION_FOLLOW_REQUEST:
                return <RequestIcon width={24} />;
            case NOTIFICATION_MENTION:
            case NOTIFICATION_REPLY_MENTION:
                return <MentionIcon width={24}/>;
            case NOTIFICATION_REPLY:
                return <ReplyIcon width={24}/>;
        }
    }

    function getIconClass() {
        switch (props.notification.type) {
            case NOTIFICATION_FAVORITE:
                return nStyles.heart;
            case NOTIFICATION_REBLOG:
                return nStyles.reblog;
            case NOTIFICATION_FOLLOW:
                return nStyles.follow;
            case NOTIFICATION_UNFOLLOW:
                return nStyles.unfollow;
            case NOTIFICATION_FOLLOW_REQUEST:
                return nStyles.request;
            case NOTIFICATION_MENTION:
            case NOTIFICATION_REPLY:
            case NOTIFICATION_REPLY_MENTION:
                return nStyles.mention;
        }
    }

    function getText(){
        function buildSingleText(ending) {
            return (
                <div className={nStyles.text}>
                    {props.notification.causers[0].info.username}&nbsp;{ending}
                </div>
            )
        }

        function buildText(ending) {
            return (
                <div className={nStyles.text}>
                    {props.notification.interactions_count} {props.notification.interactions_count > 1 ? 'people' : 'person'}&nbsp;{ending}
                </div>
            )
        }

        if(props.notification.interactions_count === 1 && props.notification.causers.length === 1){
            switch (props.notification.type) {
                case NOTIFICATION_FAVORITE:
                    return buildSingleText('favorited your post.');
                case NOTIFICATION_REBLOG:
                    return buildSingleText('reblogged your post.');
                case NOTIFICATION_FOLLOW:
                    return buildSingleText('followed you.');
                case NOTIFICATION_UNFOLLOW:
                    return buildSingleText('unfollowed you.');
                case NOTIFICATION_FOLLOW_REQUEST:
                    return buildSingleText('requested to follow you.');
                case NOTIFICATION_MENTION:
                    return buildSingleText('mentioned you.');
                case NOTIFICATION_REPLY_MENTION:
                    return buildSingleText('mentioned you in the replies.');
                case NOTIFICATION_REPLY:
                    return buildSingleText('replied to your post.');
            }
        }

        switch (props.notification.type) {
            case NOTIFICATION_FAVORITE:
                return buildText('favorited your post.');
            case NOTIFICATION_REBLOG:
                return buildText('reblogged your post.');
            case NOTIFICATION_FOLLOW:
                return buildText('followed you.');
            case NOTIFICATION_UNFOLLOW:
                return buildText('unfollowed you.');
            case NOTIFICATION_FOLLOW_REQUEST:
                return buildText('requested to follow you.');
            case NOTIFICATION_MENTION:
                return buildText('mentioned you.');
            case NOTIFICATION_REPLY:
                return buildSingleText('replied to your post.');
        }
    }

    function handleNotification() {
        if(manager.modal){
            return;
        }

        if([NOTIFICATION_FOLLOW_REQUEST].includes(props.notification.type)){
            dispatch({ type: UPDATE_NAV_NOTIFICATIONS, payload: NAV_REQUESTS });
            return;
        }

        if(
            [NOTIFICATION_MENTION, NOTIFICATION_REPLY].includes(props.notification.type) &&
            props.notification.post !== null
        ){
            history.push("/post/" + props.notification.post.id);
            return;
        }

        setManager(manager => ({
            ...manager,
            modal: true,
        }));
    }

    function handleCloseModal() {
        setManager(manager => ({
            ...manager,
            modal: false,
        }));
    }

    return (
        <div className={nStyles.item}>
            {
                manager.modal &&
                <NotificationModal notification={props.notification} close={handleCloseModal} />
            }
            {
                width > MAX_MOBILE_WIDTH &&
                <div className={nStyles.icon + ' ' + getIconClass()}>
                    {getIcon()}
                </div>
            }
            <div className={nStyles.content}>
                <div className={nStyles.info} onClick={handleNotification}>
                    <div className={nStyles.people}>
                        {
                            props.notification.causers.slice(0, 4).map(causer =>
                                <ProfilePicture key={causer.id} user={causer} small={true} />
                            )
                        }
                    </div>
                    {getText()}
                    <div className={nStyles.date}>
                        {getShortDate(new Date(props.notification.updated_timestamp))}
                    </div>
                    {
                        !props.notification.seen &&
                        <div className={nStyles.new}>
                            <div className={nStyles.badge}>new</div>
                        </div>
                    }
                </div>
                {
                    ([NOTIFICATION_FAVORITE, NOTIFICATION_REBLOG, NOTIFICATION_REPLY, NOTIFICATION_MENTION, NOTIFICATION_REPLY_MENTION].includes(props.notification.type) && props.notification.post !== null) &&
                    <div className={nStyles.post}>
                        <NotificationPost post={props.notification.post} />
                    </div>
                }
                {
                    ([NOTIFICATION_FAVORITE, NOTIFICATION_REBLOG, NOTIFICATION_REPLY, NOTIFICATION_MENTION, NOTIFICATION_REPLY_MENTION].includes(props.notification.type) && props.notification.post === null) &&
                    <div className={nStyles.post}>
                        <div className={layoutStyles.alert}>
                            <p>This post is unavailable.</p>
                        </div>
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

Notification.propTypes = {
    notification: PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(Notification);
