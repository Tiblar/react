import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

import homeStyles from "../../../../../css/layout/social/nav/home.css";
import layoutStyles from "../../../../../css/layout.css";
import cloverStyles from "../../../../../css/themes/clover-theme.css";
import newspaperStyles from "../../../../../css/themes/newspaper-theme.css";

import DefaultLogo from "../../../../../assets/svg/logo-icon.svg";
import OutrunLogo from "../../../../../assets/svg/logo-icon-outrun.svg";
import CyberpunkLogo from "../../../../../assets/svg/logo-icon-cyberpunk.svg";
import NewspaperLogo from "../../../../../assets/svg/logo-icon-newspaper.svg";
import CloverLogo from "../../../../../assets/svg/logo-icon-clover.svg";

import {DARK_THEME, LIGHT_THEME} from "../../../../../reducers/theme/constants";
import {
    CLOVER_THEME,
    COZY_THEME,
    CYBERPUNK_THEME,
    NEWSPAPER_THEME,
    OUTRUN_THEME,
    SKELETON_THEME
} from "../../../../../util/constants";

function SidebarLogo(props) {
    let width = 55;

    if(props.small === true && (props.theme === null || !props.theme.includes([NEWSPAPER_THEME, CLOVER_THEME]))){
        width = 35;
    }

    if(props.theme === NEWSPAPER_THEME){
        width = props.small === true ? 60 : 95;
    }

    if(props.theme === CLOVER_THEME){
        width = props.small === true ? 80 : 105;
    }

    return (
        <div className={homeStyles.logoContainer + (props.small ? ' ' + layoutStyles.mTN : '')}>
            <Link to={props.redirect}>
                {
                    (
                        props.theme === null || props.theme === DARK_THEME || props.theme === LIGHT_THEME
                        || props.theme === COZY_THEME || props.theme === SKELETON_THEME
                    ) &&
                    <DefaultLogo className={homeStyles.logo} width={`${width.toString()}px`} />
                }
                {
                    props.theme === OUTRUN_THEME &&
                    <OutrunLogo width={`${width.toString()}px`} />
                }
                {
                    props.theme === CYBERPUNK_THEME &&
                    <CyberpunkLogo width={`${width.toString()}px`} />
                }
                {
                    props.theme === NEWSPAPER_THEME &&
                    <NewspaperLogo className={newspaperStyles.logo} width={`${width.toString()}px`} />
                }
                {
                    props.theme === CLOVER_THEME &&
                    <CloverLogo className={cloverStyles.logo} width={`${width.toString()}px`} />
                }
            </Link>
        </div>
    );
}

SidebarLogo.propTypes = {
    theme: PropTypes.string,
    small: PropTypes.bool,
    redirect: PropTypes.string.isRequired,
}

SidebarLogo.defaultProps = {
    theme: null,
    small: false,
}

export default SidebarLogo;
