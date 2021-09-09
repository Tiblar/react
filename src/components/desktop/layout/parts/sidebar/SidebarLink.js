import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {useHistory} from "react-router";

import sidebarStyles from "../../../../../css/layout/social/nav/sidebar.css";

function SidebarLink(props) {

    const [active, setActive] = useState(isActive(window.location.pathname));

    const history = useHistory();

    useEffect(() => {
        return history.listen((location) => {
            if(props.paths.includes(location.pathname)){
                setActive(true);
            }else{
                setActive(false);
            }
        })
    },[history, props.paths])

    function isActive(path) {
        return props.paths.includes(path) ||
            props.startsWith.find(p => path.startsWith(p));
    }

    return (
        <Link to={props.to} className={sidebarStyles.sidebarItem + ' ' + (active ? sidebarStyles.active : "")}>
            <div className={sidebarStyles.sidebarIcon}>
                {props.icon}
            </div>
            <span>{props.text}</span>
        </Link>
    )
}

SidebarLink.propTypes = {
    to: PropTypes.string,
    paths: PropTypes.array,
    startsWith: PropTypes.array,
    icon: PropTypes.element,
    text: PropTypes.string,
}

SidebarLink.defaultProps = {
    paths: [],
    startsWith: [],
}

export default SidebarLink;
