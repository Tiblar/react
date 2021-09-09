import React from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

import { background, logoContainer, logo, cover, auth } from "../../../../css/layout/auth.css";

import Cover from "../../../../assets/graphics/auth/cover.svg";
import LogoIcon from "../../../../assets/svg/logo-icon.svg";
import FrownIcon from "../../../../assets/svg/icons/frown.svg";

import layoutStyles, {flex, justifyContentCenter} from "../../../../css/layout.css";
import {container} from "../../../../css/layout/main.css";
import {card, cardBody} from "../../../../css/components/card.css";
import formStyles from "../../../../css/form.css";

function Invite(props) {

    let search = window.location.search;
    search = search.replace(/\+/g, '%2b');

    const urlParams = new URLSearchParams(search);
    let to = urlParams.get('to');

    let valid = true;

    if(typeof to !== "string"){
        valid = false;
    }else if(!to.startsWith("/chat#/")){
        valid = false;
    }

    if(valid){
        to = encodeURI(to);
        to = to.replace(/#/g, '%23');
        to = to.replace(/\+/g, '%2b');
    }

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
                        {
                            valid &&
                            <div className={formStyles.alert}>
                                You have been invited to chat.
                            </div>
                        }
                        {
                            !props.auth.isAuthenticated && valid &&
                            <div className={layoutStyles.flex + ' ' + layoutStyles.flexColumn}>
                                <Link className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + layoutStyles.mT1} to={"/login?to=" + to}>
                                    Login
                                </Link>
                                <Link className={formStyles.button + ' ' + formStyles.buttonPrimaryOutline + ' ' + layoutStyles.mT1} to={"/register?to=" + to}>
                                    Register
                                </Link>
                            </div>
                        }
                        {
                            props.auth.isAuthenticated && valid &&
                            <div className={layoutStyles.flex + ' ' + layoutStyles.flexColumn}>
                                <button className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + layoutStyles.mT1} onClick={() => { window.location.replace(decodeURIComponent(to)); }}>
                                    Continue
                                </button>
                            </div>
                        }
                        {
                            !valid &&
                            <div>
                                <hr />
                                <div className={
                                    layoutStyles.flex + ' ' + layoutStyles.justifyContentCenter
                                    + ' ' + layoutStyles.mB1 + ' ' + layoutStyles.mT1
                                }>
                                    <FrownIcon width="35%" />
                                </div>
                                <div className={formStyles.alert}>
                                    The invite link you used is invalid.
                                </div>
                            </div>
                        }
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

export default connect(mapStateToProps)(Invite);
