// @flow

import React from "react";
import {connect} from "react-redux";

import supportStyles from "../../../../../css/layout/support/support.css";
import cardStyles from "../../../../../css/components/card.css";

import Container from "../../../layout/parts/support/Container";
import {SUPPORT_URL} from "../../../../../util/constants";

function Financials(props) {
    return (
        <Container>
            <div className={supportStyles.body}>
                <div className={cardStyles.card}>
                    <div className={cardStyles.cardHeader}>
                        <a href={SUPPORT_URL}>Support Home</a>&nbsp;-&nbsp;Financials
                    </div>
                    <div className={cardStyles.cardBody}>
                        <p>In order to contact support you must currently email me.</p>
                        <p>I am building out the support system, a better implementation is coming.</p>
                        <p>You can send an email at: support [@] formerlychucks [dot] net</p>
                        <hr />
                        <p>
                            Include as much information as you can. This includes your Formerly Chuck's username, PayPal email (if you use PayPal), invoices, etc.
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

export default connect(mapStateToProps)(Financials);
