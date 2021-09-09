// @flow

import React, {useEffect} from "react";
import {connect} from "react-redux";

import {layerShow, layerHide, siteWrapper} from "../../../css/layout.css";

import {REVERT, useLayerState} from "./layer/context";
import store from "../../../store";
import {loadUser, refreshToken} from "../../../reducers/auth/actions";
import {testConnection} from "../../../reducers/connection/actions";
import {updateSocialNotificationsCount} from "../../../reducers/notifications/actions";
import {makeIsAuthenticated, makeTokenTimeout} from "../../../reducers/auth/selectors";

function AutoAuth(props) {
    useEffect(() => {
        store.dispatch(loadUser());
        store.dispatch(testConnection());
    }, []);

    useEffect(() => {
        if(!props.isAuthenticated){
            return;
        }

        const interval = setInterval(() => {
            store.dispatch(refreshToken());
        }, props.tokenTimeout);

        return () => {
            clearInterval(interval)
        }
    }, [props.tokenTimeout]);

    useEffect(() => {
        if(!props.isAuthenticated){
            return;
        }

        const interval = setInterval(() => {
            fetch();
        }, 60000);

        function fetch() {
            if(props.isAuthenticated){
               store.dispatch(updateSocialNotificationsCount())
            }
        }

        fetch();

        return () => {
            clearInterval(interval)
        }
    }, [props.isAuthenticated]);

    let { container } = useLayerState();

    let style = "";
    if (container === REVERT) {
        style = layerHide;
    } else if (container !== null) {
        style = layerShow;
    }

    return (
        <div className={siteWrapper + " " + style}>
            {props.children}
        </div>
    );
}

const mapStateToProps = () => {
    const getIsAuthenticated = makeIsAuthenticated();
    const getTokenTimeout = makeTokenTimeout();

    return (state) => {
        const isAuthenticated = getIsAuthenticated(state);
        const tokenTimeout = getTokenTimeout(state);

        return {
            isAuthenticated: isAuthenticated,
            tokenTimeout: tokenTimeout,
        }
    };
};

export default connect(mapStateToProps)(AutoAuth);
