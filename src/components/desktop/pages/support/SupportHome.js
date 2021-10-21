// @flow

import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

import supportStyles from "../../../../css/layout/support/support.css";
import cardStyles from "../../../../css/components/card.css";

import Container from "../../layout/parts/support/Container";

function SupportHome(props) {
    return (
        <Container>
            <div className={supportStyles.body}>
                <div className={cardStyles.card}>
                    <div className={cardStyles.cardHeader}>
                        Formerly Chuck's Support
                    </div>
                    <div className={cardStyles.cardBody}>
                        <p>This webpage is still under development.</p>
                        <ul>
                            <li><Link to="/support/pages/contact">How to contact support.</Link></li>
                            <li><Link to="/support/pages/rules">Rules Page</Link></li>
                            <li><Link to="/support/pages/tos">Terms of Service</Link></li>
                            <li><Link to="/support/pages/financials">Billing/financials</Link></li>
                            <li><Link to="/support/pages/about">Mission statement and About Formerly Chuck's</Link></li>
                            <li><a href="https://one_free_man.artstation.com/">Source of login page art work</a></li>
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

export default connect(mapStateToProps)(SupportHome);
