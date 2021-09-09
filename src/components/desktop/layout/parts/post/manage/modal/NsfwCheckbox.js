// @flow

import React, {useEffect} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import switchStyles from "../../../../../../../css/components/switch.css";
import postModalStyles from "../../../../../../../css/layout/social/post-modal.css";

const NsfwCheckbox = (props) => {
    useEffect(() => {
        props.handleNsfw(props.auth.user.info.nsfw);
    }, [props.auth.user.info.nsfw]);

    function handleNsfw(e) {
        props.handleNsfw(e.target.checked);
    }

    return (
        <div className={postModalStyles.nsfw}>
            <div className={switchStyles.switchInput}>
                <p>
                    <label>
                        <input onChange={handleNsfw}
                               disabled={props.submitting}
                               checked={props.nsfw}
                               type="checkbox" />
                        <span>NSFW content</span>
                    </label>
                </p>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

NsfwCheckbox.propTypes = {
    handleNsfw: PropTypes.func,
    nsfw: PropTypes.bool,
}

export default connect(mapStateToProps)(NsfwCheckbox);
