import {CLOVER_THEME, COZY_THEME, CYBERPUNK_THEME, OUTRUN_THEME, SKELETON_THEME} from "./constants";
import outrunStyles from "../css/themes/outrun-theme.css";
import cyberpunkStyles from "../css/themes/cyberpunk-theme.css";
import cozyStyles from "../css/themes/cozy-theme.css";
import skeletonStyles from "../css/themes/skeleton-theme.css";
import cloverStyles from "../css/themes/clover-theme.css";

export function themeBackground(user) {
    if(user === null){
        return "";
    }

    if(user.info.profile_theme === OUTRUN_THEME){
        return ' ' + outrunStyles.topNav;
    }

    if(user.info.profile_theme === CYBERPUNK_THEME){
        return ' ' + cyberpunkStyles.topNav;
    }

    if(user.info.profile_theme === COZY_THEME){
        return ' ' + cozyStyles.topNav;
    }

    if(user.info.profile_theme === SKELETON_THEME){
        return ' ' + skeletonStyles.topNav;
    }

    if(user.info.profile_theme === CLOVER_THEME){
        return ' ' + cloverStyles.topNav;
    }

    return "";
}
