import React, {useEffect} from "react";
import {connect} from "react-redux";

import {DARK_THEME, LIGHT_THEME} from "./reducers/theme/constants";
import history from "./util/history";
import {authRoutes} from "./router";

function Theme(props) {

    useEffect(() => {
        updateTheme(history.location.pathname);
    }, [])

    useEffect(() => {
        updateTheme(history.location.pathname);
    }, [props.theme.theme]);

    useEffect(() => {
        return history.listen((location) => {
            updateTheme(location.pathname);
        })
    },[history, props.theme.theme, props.theme.activeProfileTheme])

    function updateTheme(location = null) {
        if(props.theme.activeProfileTheme){
            return;
        }

        if(props.theme.theme === LIGHT_THEME || new RegExp(authRoutes.join("|")).test(location)){
            window.__theme_root.classList.add("light-theme");
            window.__theme_root.classList.remove("dark-theme");
            return;
        }

        if(props.theme.theme === DARK_THEME){
            window.__theme_root.classList.add("dark-theme");
            window.__theme_root.classList.remove("light-theme");
        }
    }

    return null;
}

const mapStateToProps = state => {
    const { theme } = state;
    return { theme: theme };
};

export default connect(mapStateToProps)(Theme);