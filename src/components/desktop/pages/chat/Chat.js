import React, {useEffect, useState} from "react";
import axios from "axios";

import Matrix from "./Matrix";

import LoadingGraphic from "../../../../assets/loading/infinite.svg";

import {API_URL} from "../../../../util/constants";

function Chat() {

    const [manager, setManager] = useState({
        loaded: false,
    });

    useEffect(() => {
        if(localStorage.getItem("mx_has_access_token") === "true"){
            setManager(manager => ({
                ...manager,
                loaded: true,
            }));

            return;
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        };

        axios.get(API_URL + '/auth/matrix/login-token', config).then(res => {
            localStorage.setItem("mx_has_access_token", "true");
            localStorage.setItem("mx_is_guest", "false");
            localStorage.setItem("mx_hs_url", res.data.data.home_server)
            localStorage.setItem("mx_access_token", res.data.data.access_token);
            localStorage.setItem("mx_device_id", res.data.data.device_id);
            localStorage.setItem("mx_user_id", res.data.data.user_id);

            setManager(manager => ({
                ...manager,
               loaded: true,
            }));
        })
    }, []);

    if(!manager.loaded){
        return (
            <div>
                <LoadingGraphic height={45} width={45} />
            </div>
        );
    }

    return <Matrix />;
}

export default Chat;
