// @flow

import React, {useEffect} from "react";
import {connect} from "react-redux";

import supportStyles from "../../../../../css/layout/support/support.css";

import Top from "./nav/Top";
import store from "../../../../../store";
import {loadUser} from "../../../../../reducers/auth/actions";
import {testConnection} from "../../../../../reducers/connection/actions";

function SupportHome(props) {
    useEffect(() => {
        store.dispatch(loadUser());
        store.dispatch(testConnection());
    }, []);

    return (
        <div className={supportStyles.container}>
            <Top />
            {props.children}
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(SupportHome);
