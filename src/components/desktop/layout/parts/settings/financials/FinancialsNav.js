// @flow

import React from "react";
import PropTypes from "prop-types";

import navStyles from "../../../../../../css/components/tabs-nav.css";
import {SUPPORT_URL} from "../../../../../../util/constants";

function FinancialsNav(props) {

    return (
        <div className={navStyles.nav}>
            <div className={navStyles.pages}>
                <div onClick={() => { props.setNav("outgoing") }}
                     className={navStyles.page}>
                    <label>
                        Outgoing
                    </label>
                    {
                        props.type === "outgoing" &&
                        <span className={navStyles.active}/>
                    }
                </div>
                <div onClick={() => { props.setNav("incoming") }}
                     className={navStyles.page}>
                    <label>
                        Incoming
                    </label>
                    {
                        props.type === "incoming" &&
                        <span className={navStyles.active}/>
                    }
                </div>
                <a href={SUPPORT_URL}
                     className={navStyles.page}>
                    <label>
                        Support
                    </label>
                </a>
            </div>
        </div>
    );
}

FinancialsNav.propTypes = {
    setNav: PropTypes.func,
    type: PropTypes.string,
}

export default FinancialsNav;

