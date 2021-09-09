// @flow

import React, {useEffect} from "react";
import PropTypes from "prop-types";

import ChangeAccount from "./ChangeAccount";
import CurrentAccount from "./CurrentAccount";
import ChangePassword from "./ChangePassword";
import {UPDATE_EMAIL, UPDATE_USERNAME, useAccountDispatch, useAccountState} from "./context";

function ChangeOrCurrentAccount(props) {
    const dispatch = useAccountDispatch();
    const {username, email, editing, editingPassword} = useAccountState();

    useEffect(() => {
        dispatch({ type: UPDATE_USERNAME, payload: { ...username, value: props.username } })
        dispatch({ type: UPDATE_EMAIL, payload: { ...email, value: props.email } })
    }, [props.username, props.email])

    if(editingPassword){
        return <ChangePassword />;
    }

    if(editing){
        return <ChangeAccount email={props.email} username={props.username} />;
    }

    return <CurrentAccount email={props.email} username={props.username} />
}

ChangeOrCurrentAccount.propTypes = {
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
};

export default ChangeOrCurrentAccount;
