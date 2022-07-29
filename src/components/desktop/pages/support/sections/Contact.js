// @flow

import React from "react";
import {connect} from "react-redux";

import supportStyles from "../../../../../css/layout/support/support.css";
import cardStyles from "../../../../../css/components/card.css";

import Container from "../../../layout/parts/support/Container";
import {SUPPORT_URL} from "../../../../../util/constants";

function Contact(props) {
    return (
        <Container>
            <div className={supportStyles.body}>
                <div className={cardStyles.card}>
                    <div className={cardStyles.cardHeader}>
                        <a href={SUPPORT_URL}>Support Home</a>&nbsp;-&nbsp;Contact support
                    </div>
                    <div className={cardStyles.cardBody}>
                        <p>
                          In order to contact support you can:
                          <ul>
                            <li>send an email at: infiend [@] firemail [dot] cc</li>
                            <li>join our <a href="https://discord.gg/QzcXudsA3c" target="_blank" rel="nofollow">discord</a></li>
                            {/*
                            <li>join our <a href="https://telegram.com/" target=_blank rel=nofollow>telegram</a></li>
                            <p>I am building out the support system, a better implementation is coming.</p>
                            */}
                          </ul>
                        </p>
                    </div>
                </div>
            </div>
        </Container>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(Contact);
