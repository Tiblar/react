// @flow

import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import {connect} from "react-redux";

import { flex, justifyContentCenter } from "../../../../../css/layout.css";
import { container } from "../../../../../css/layout/main.css";
import authStyles, { background, logoContainer, logo, cover, auth } from "../../../../../css/layout/auth.css";
import { card, cardBody } from "../../../../../css/components/card.css";

import LogoIcon from "../../../../../assets/svg/logo-icon.svg";
import Cover from "../../../../../assets/graphics/auth/cover.svg";

function Container(props) {
    useEffect(() => {
        window.__theme_root.classList.add("light-theme");
        window.__theme_root.classList.remove("dark-theme");
    }, []);

    return (
        <div
            className={
                flex + " " + container + " " + justifyContentCenter + " " + background
            }
        >
            {
                props.auth.isAuthenticated &&
                <div>
                    <div className={authStyles.overlay} />
                    <div className={authStyles.overlayRound} />
                    <div className={authStyles.overlayTop} />
                    <div className={authStyles.overlayLast} />
                    <div className={authStyles.overlayTransition} />
                </div>
            }
            <div id={authStyles.loaderWrapper} className={(props.auth.isAuthenticated ? authStyles.loaded : '')}>
                <div id={authStyles.loader} />
                <div className={authStyles.loaderSection + ' ' + authStyles.loaderSection} />
                <div className={authStyles.loaderSection + ' ' + authStyles.loaderSection} />
            </div>
            <div className={cover}>
                <Cover />
            </div>
            <div className={auth}>
                <div className={card}>
                    <div className={cardBody}>
                        <div className={flex + " " + justifyContentCenter + " " + logoContainer}>
                            <Link to="/">
                                <LogoIcon className={logo} width="60px" />
                            </Link>
                        </div>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(Container);
