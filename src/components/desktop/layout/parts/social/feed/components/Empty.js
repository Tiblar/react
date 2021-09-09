// @flow

import React from "react";
import PropTypes from "prop-types";

import cardStyles from "../../../../../../../css/components/card.css";
import layoutStyles from "../../../../../../../css/layout.css";
import errorCardStyles from "../../../../../../../css/layout/social/error-card.css";

import EmptyGraphic from "../../../../../../../assets/graphics/empty.svg";
import {SUPPORT_URL} from "../../../../../../../util/constants";

function Empty(props) {
    return (
        <div className={cardStyles.card + ' ' + errorCardStyles.popupShow}>
            <div className={cardStyles.cardBody}>
                <EmptyGraphic width="100%" />
                <hr className={layoutStyles.mT1 + ' ' + layoutStyles.mB1} />
                {
                    (props.body === undefined || props.body === null) &&
                    <p>There's nothing in your feed. This will fill up when you follow people.</p>
                }
                {
                    (props.body !== undefined && props.body !== null) &&
                    <p>{props.body}</p>
                }
                <ul>
                    <li>Explore the hottest <a target="_blank" href="/trending">posts</a></li>
                    <li>Add your friends!</li>
                    <li><a href={SUPPORT_URL}>Read the tutorial</a> if you're getting started.</li>
                </ul>
            </div>
        </div>
    );
}

Empty.propTypes = {
    body: PropTypes.string
};

export default Empty;
