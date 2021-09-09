import React from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

import layoutStyles from "../../../../../css/layout.css";
import formStyles from "../../../../../css/form.css";
import switchStyles from "../../../../../css/components/switch.css";
import cardStyles from "../../../../../css/components/card.css";

import SidebarAction from "./SidebarAction";
import SidebarLink from "./SidebarLink";

import SunIcon from "../../../../../assets/svg/icons/sun.svg";
import MoonIcon from "../../../../../assets/svg/icons/moon.svg";
import LoginIcon from "../../../../../assets/svg/icons/login.svg";

import useWindowDimensions from "../../../../../util/hooks/useWindowDimensions";
import store from "../../../../../store";
import {updateTheme} from "../../../../../reducers/theme/actions";
import {DARK_THEME, LIGHT_THEME} from "../../../../../reducers/theme/constants";

function SidebarUnauthenticated(props) {
    const {width} = useWindowDimensions();

    function handleTheme() {
        store.dispatch(updateTheme(props.user_theme.theme === DARK_THEME ? LIGHT_THEME : DARK_THEME));
    }

    if(width <= 1500) {
        return (
            <>
                <SidebarAction
                    icon={props.user_theme.theme === DARK_THEME ? <SunIcon width="100%" /> : <MoonIcon width="100%" />}
                    text={props.user_theme.theme === DARK_THEME ? 'Light Mode' : "Dark Mode"}
                    active={false}
                    onClick={handleTheme}
                />
                <SidebarLink
                    to="/login"
                    icon={<LoginIcon width="100%" height="100%" />}
                    text="Login"
                />
            </>
        );
    }

    return (
        <div className={cardStyles.card + " " + layoutStyles.m1}>
            <div className={cardStyles.cardBody}>
                <div className={layoutStyles.mB1}>
                    <div className={switchStyles.switchInput}>
                        <label>
                            <input
                                checked={props.user_theme.theme === DARK_THEME}
                                onChange={handleTheme}
                                type="checkbox"
                            />
                            {" "}
                            <span className={switchStyles.lever} />
                            Dark Mode
                        </label>
                    </div>
                </div>
                <hr />
                <p>Sign in for more features and better recommendations.</p>
            </div>
            <div className={cardStyles.cardFooter}>
                <div className={layoutStyles.tbRowS}>
                    <div className={layoutStyles.tbCol6 + " " + layoutStyles.mLN}>
                        <Link to="/login" className={formStyles.button + " " + formStyles.buttonSuccess}>
                            Login
                        </Link>
                    </div>
                    <div className={layoutStyles.tbCol6 + " " + layoutStyles.mRN}>
                        <Link to="/register" className={formStyles.button + " " + formStyles.buttonSuccess}>
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { theme } = state;
    return { user_theme: theme };
};

export default connect(mapStateToProps)(SidebarUnauthenticated);
