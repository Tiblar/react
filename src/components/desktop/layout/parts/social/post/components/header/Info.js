// @flow

import React from "react";

import postStyles from "../../../../../../../../css/components/post.css";
import formStyles from "../../../../../../../../css/form.css";
import layoutStyles from "../../../../../../../../css/layout.css";

import ClockIcon from "../../../../../../../../assets/svg/icons/clock.svg";

import {PostType} from "../../../../../../../../util/types/PostTypes";
import {formatDate} from "../../../../../../../../util/date";
import CopyButton from "../../../../../../../../util/components/CopyButton";
import {WEB_URL} from "../../../../../../../../util/constants";
import {Link} from "react-router-dom";

const Info = React.forwardRef((props, ref) => {

    let post = props.post.reblog !== null && (props.post.body === null && props.post.attachments.length === 0)
        ? props.post.reblog : props.post;

    return (
        <div className={postStyles.mobileInfo} ref={ref}>
            <div className={postStyles.infoDate}>
                <ClockIcon width="15" height="15" />{formatDate(props.post.timestamp)}
            </div>
            <div className={postStyles.infoOption}>
                <CopyButton className={formStyles.button + ' ' + layoutStyles.wF} copyText={WEB_URL + "/post/" + post.id}>
                    Copy Link
                </CopyButton>
            </div>
            <div className={postStyles.infoOption}>
                <Link className={formStyles.button + ' ' + layoutStyles.wF} target="_blank" to={"/post/" + post.id}>
                    Open Post
                </Link>
            </div>
        </div>
    );
});

Info.propTypes = {
    post: PostType,
}

export default Info;
