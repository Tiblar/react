// @flow

import React from "react";
import {connect} from "react-redux";

import supportStyles from "../../../../../css/layout/support/support.css";
import cardStyles from "../../../../../css/components/card.css";

import Container from "../../../layout/parts/support/Container";
import {SUPPORT_URL} from "../../../../../util/constants";

function ToS(props) {
    return (
        <Container>
            <div className={supportStyles.body}>
                <div className={cardStyles.card}>
                    <div className={cardStyles.cardHeader}>
                        <a href={SUPPORT_URL}>Support Home</a>&nbsp;-&nbsp;Terms of Service
                    </div>
                    <div className={cardStyles.cardBody}>
                        <p>By using Formerly Chuck's or creating an account you agree to all of the following:</p>
                        <ul>
                            <li>All posts on Formerly Chuck's are the responsibility of the individual poster and not the administration of Formerly Chuck's or Formerly Chuck's LLC, pursuant to 47 U.S.C. § 230.</li>
                            <li>You take responsibility and ownership of all the content you post on this website.</li>
                            <li>If it is illegal for you to browse Formerly Chuck's then you will immediately cease to access Formerly Chuck's.</li>
                            <li>If you are under the page of 18 you will immediately cease to access Formerly Chuck's.</li>
                            <li>You agree to all of the rules on the <a href="/support/pages/rules">rules page</a>.</li>
                        </ul>
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

export default connect(mapStateToProps)(ToS);
