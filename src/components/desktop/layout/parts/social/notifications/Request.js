// @flow

import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import layoutStyles from "../../../../../../css/layout.css";
import formStyles from "../../../../../../css/form.css";
import nStyles from "../../../../../../css/components/notification.css";

import ProfilePicture from "../../user/ProfilePicture";

function Request(props) {
    return (
        <div className={nStyles.item}>
            <div className={layoutStyles.flex + ' ' + layoutStyles.alignItemsCenter + ' ' + layoutStyles.wF}>
                <ProfilePicture user={props.request.requester} profilePreview={true} />
                <div className={layoutStyles.flex + ' ' + layoutStyles.flexColumn + ' ' + layoutStyles.mL1}>
                    <h3>{props.request.requester.info.username}</h3>
                    <p className={layoutStyles.small}>Wants to follow you</p>
                </div>
                <div className={layoutStyles.flex + ' ' + layoutStyles.mL}>
                    <button className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + formStyles.buttonSmall}
                            onClick={() => { props.handleAccept(props.request.id) }}>
                        Confirm
                    </button>
                    <button className={formStyles.button + ' ' + formStyles.buttonSmall} style={{marginLeft: "0.5rem"}}
                            onClick={() => { props.handleDelete(props.request.id) }}>
                    Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

Request.propTypes = {
    request: PropTypes.object.isRequired,
    handleAccept: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(Request);
