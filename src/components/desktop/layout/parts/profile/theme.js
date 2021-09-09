import React, {useEffect} from "react";
import {connect} from "react-redux";

import {
    OUTRUN_THEME, DARK_THEME, LIGHT_THEME,
    CYBERPUNK_THEME, COZY_THEME, SKELETON_THEME, NEWSPAPER_THEME, CLOVER_THEME
} from "../../../../../util/constants";
import {useProfileState} from "./context";
import history from "../../../../../util/history";
import store from "../../../../../store";
import {updateActiveProfileTheme} from "../../../../../reducers/theme/actions";

function Theme(props) {
    const { user } = useProfileState();

    useEffect(() => {
        updateTheme();
    }, [])

    useEffect(() => {
        updateTheme();
    }, [user])

    useEffect(() => {
        return history.listen(() => {
            updateTheme();
        })
    },[history, props.theme.theme, user])

    useEffect(() => {
        updateTheme();
    }, [props.theme.theme])

    useEffect(() => {
        store.dispatch(updateActiveProfileTheme(true));

        return () => {
            window.__theme_root.classList.remove("dark-theme-profile");
            window.__theme_root.classList.remove("light-theme-profile");
            window.__theme_root.classList.remove("outrun-theme-profile");
            window.__theme_root.classList.remove("cyberpunk-theme-profile");
            window.__theme_root.classList.remove("cozy-theme-profile");
            window.__theme_root.classList.remove("skeleton-theme-profile");
            store.dispatch(updateActiveProfileTheme(false));
        }
    }, []);

    function updateTheme() {

        let profileTheme = user !== null ? user.info.profile_theme : null;
        let useThemeMode = props.theme.theme;

        window.__theme_root.classList.remove("light-theme");
        window.__theme_root.classList.remove("dark-theme");
        window.__theme_root.classList.remove("light-theme-profile");
        window.__theme_root.classList.remove("dark-theme-profile");

        if(useThemeMode === LIGHT_THEME && (profileTheme === LIGHT_THEME || profileTheme === DARK_THEME || profileTheme === null)){
            window.__theme_root.classList.add("light-theme-profile");
            return;
        }

        if(useThemeMode === DARK_THEME && (profileTheme === LIGHT_THEME || profileTheme === DARK_THEME || profileTheme === null)){
            window.__theme_root.classList.add("dark-theme-profile");
            return;
        }

        if(user === null){
            return;
        }

        window.__theme_root.classList.remove("light-theme-profile");
        window.__theme_root.classList.remove("dark-theme-profile");


        if(profileTheme === OUTRUN_THEME){
            window.__theme_root.classList.add("outrun-theme-profile");
            return;
        }

        if(profileTheme === CYBERPUNK_THEME){
            window.__theme_root.classList.add("cyberpunk-theme-profile");
            return;
        }

        if(profileTheme === COZY_THEME){
            window.__theme_root.classList.add("cozy-theme-profile");
            return;
        }

        if(profileTheme === SKELETON_THEME){
            window.__theme_root.classList.add("skeleton-theme-profile");
            return;
        }

        if(profileTheme === SKELETON_THEME){
            window.__theme_root.classList.add("skeleton-theme-profile");
            return;
        }

        if(useThemeMode === LIGHT_THEME && profileTheme === NEWSPAPER_THEME){
            window.__theme_root.classList.add("newspaper-light-theme-profile");
            return;
        }

        if(useThemeMode === DARK_THEME && profileTheme === NEWSPAPER_THEME){
            window.__theme_root.classList.add("newspaper-dark-theme-profile");
            return;
        }

        if(profileTheme === CLOVER_THEME){
            window.__theme_root.classList.add("clover-theme-profile");
            return;
        }
    }

    return null;
}

const mapStateToProps = state => {
    const { theme } = state;
    return { theme: theme };
};

export default connect(mapStateToProps)(Theme);
