// @flow

import React from "react";
import {connect} from "react-redux";

import supportStyles from "../../../../../css/layout/support/support.css";
import cardStyles from "../../../../../css/components/card.css";
import formStyles from "../../../../../css/form.css";
import layoutStyles from "../../../../../css/layout.css";

import SneedStaff from "../../../../../assets/about/sneed_staff.jpg";

import Container from "../../../layout/parts/support/Container";
import {MAX_MOBILE_WIDTH, SUPPORT_URL} from "../../../../../util/constants";
import useWindowDimensions from "../../../../../util/hooks/useWindowDimensions";

function About() {
    const {width} = useWindowDimensions();

    return (
        <Container>
            <div className={supportStyles.body}>
                <div className={cardStyles.card}>
                    <div className={cardStyles.cardHeader}>
                        <a href={SUPPORT_URL}>Support Home</a>&nbsp;-&nbsp;About/Mission Statement
                    </div>
                    <div className={cardStyles.cardBody}>
                        <div className={cardStyles.card}>
                            <div className={cardStyles.cardHeader}>
                                Mission Statement
                            </div>
                            <div className={cardStyles.cardBody}>
                                <p>
                                    Formerly Chuck's goal is to be a privacy centered platform that allows people to communicate through posting, messaging, and streaming.
                                </p>
                            </div>
                        </div>
                        <div className={cardStyles.card + ' ' + layoutStyles.mT1}>
                            <div className={cardStyles.cardHeader}>
                                About
                            </div>
                            <div className={cardStyles.cardBody}>
                                {
                                    MAX_MOBILE_WIDTH < width &&
                                    <div className={layoutStyles.flex}>
                                        <div style={{maxWidth: "400px"}}>
                                            <div style={{width: "400px", height: "400px", background: "url(" + SneedStaff + ")", backgroundSize: "cover"}} />
                                            <div className={formStyles.alert + ' ' + layoutStyles.mT1}>
                                                Formerly Chuck's staff members
                                            </div>
                                        </div>
                                        <div className={layoutStyles.mL2 + ' ' + layoutStyles.flexColumn}>
                                            <p>
                                                We follow and respect United States law. We are a registered LLC in the United States.
                                            </p>
                                            {/*
                                            <div className={layoutStyles.mT2}>
                                                Our community office:
                                                <hr />
                                                <p>Formerly Chuck's Community Services</p>
                                                <p>Vladimir Polezhanovski Rd 43</p>
                                                <p>Skopje 1000</p>
                                                <p>North Macedonia</p>
                                            </div>
                                            */ }
                                        </div>
                                    </div>
                                }
                                {
                                    MAX_MOBILE_WIDTH >= width &&
                                    <div className={layoutStyles.flex + ' ' + layoutStyles.flexColumn}>
                                        <p>
                                            We follow and respect United States law. We are a registered LLC in the United States.
                                        </p>
                                        {/*
                                        <div className={layoutStyles.mT2}>
                                            Our community office:
                                            <hr />
                                            <p>Formerly Chuck's Community Services</p>
                                            <p>Vladimir Polezhanovski Rd 43</p>
                                            <p>Skopje 1000</p>
                                            <p>North Macedonia</p>
                                        </div>
                                        */}
                                        <hr />
                                        <div>
                                            <div style={{width: "100%", height: "0", paddingTop: "100%", background: "url(" + TiblarStaff + ")", backgroundSize: "cover"}} />
                                            <div className={formStyles.alert + ' ' + layoutStyles.mT1}>
                                                Formerly Chuck's staff members
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
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

export default connect(mapStateToProps)(About);
