// @flow

import React from "react";
import { Link } from "react-router-dom";

import { flex, justifyContentCenter } from "../../../../../css/layout.css";
import { container } from "../../../../../css/layout/main.css";
import { background, logoContainer, logo, cover, auth } from "../../../../../css/layout/auth.css";
import { card, cardBody } from "../../../../../css/components/card.css";

import LogoIcon from "../../../../../assets/svg/logo-icon.svg";
import Cover from "../../../../../assets/graphics/auth/cover.svg";

function Container(props) {
    return (
        <div
            className={
                flex + " " + container + " " + justifyContentCenter + " " + background
            }
        >
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

export default Container;
