// @flow

import React from "react";
import PropTypes from "prop-types";

import cardStyles from "../../../../../../css/components/card.css";
import layoutStyles from "../../../../../../css/layout.css";
import errorCardStyles from "../../../../../../css/layout/social/error-card.css";

import GearIcon from "../../../../../../assets/svg/icons/gear.svg";
import VIcon from "../../../../../../assets/svg/icons/ellipsisV.svg";

import EmptyGraphic from "../../../../../../assets/graphics/empty.svg";

function Empty(props) {
    return (
        <div className={cardStyles.card + ' ' + errorCardStyles.popupShow}>
            <div className={cardStyles.cardBody}>
                <EmptyGraphic width="100%" />
                <hr className={layoutStyles.mT1 + ' ' + layoutStyles.mB1} />
                {
                    (props.body === undefined || props.body === null) &&
                    <p>There's nothing in this list. You must add posts for them to show up here.</p>
                }
                {
                    (props.body !== undefined && props.body !== null) &&
                    <p>{props.body}</p>
                }
                <ol>
                    <li>Add a post by clicking on&nbsp;<VIcon height={14} width={14}/>&nbsp;or&nbsp;<GearIcon height={14} width={14} />&nbsp;the in the top right of a post.</li>
                    <li>Click "Add to list"</li>
                    <li>Select which list to add post</li>
                </ol>
            </div>
        </div>
    );
}

Empty.propTypes = {
    body: PropTypes.string
};

export default Empty;
