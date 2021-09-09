// @flow

import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {connect} from "react-redux";
import {toast} from "react-toastify";

import formStyles from "../../../../../../css/form.css";
import layoutStyles from "../../../../../../css/layout.css";
import connectionsStyles from "../../../../../../css/layout/social/settings/pages/connections.css";
import cardStyles from "../../../../../../css/layout/social/settings/card.css";

import DiscordIcon from "../../../../../../assets/svg/logos/discord.svg";
import LoadingGraphic from "../../../../../../assets/loading/dots.svg";

import {API_URL, CONNECTION_DISCORD_URL} from "../../../../../../util/constants";
import store from "../../../../../../store";
import {loadUser} from "../../../../../../reducers/auth/actions";

function Discord(props) {
    const _isMounted = useRef(true);

    useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, []);

    useEffect(() => {
       return () => {
            clearInterval(manager.interval);
       }
    });

    const [manager, setManager] = useState({
        waiting: false,
        interval: null
    })

    function checkConnection() {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios
            .get(API_URL + "/users/@me/connections/discord/status", config)
            .then(res => {
                clearInterval(manager.interval);

                if(_isMounted.current){
                    setManager(manager => ({
                        ...manager,
                        waiting: false,
                    }))
                }

                store.dispatch(loadUser());
            })
            .catch(err => {
                if(err.response && err.response.status !== 404){
                    const Notification = () => (
                        <div>
                            There was an error!
                        </div>
                    );

                    toast.error(<Notification />, {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            });
    }

    function handleConnect() {
        window.open(CONNECTION_DISCORD_URL)

        setManager(manager => ({
            ...manager,
            waiting: true,
            interval: setInterval(checkConnection, 1500)
        }))
    }

    function handleDisconnect() {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        axios
            .delete(API_URL + "/users/@me/connections/discord", config)
            .then(res => {
                if(_isMounted.current){
                    setManager(manager => ({
                        ...manager,
                        waiting: false,
                    }))
                }

                store.dispatch(loadUser());

                clearInterval(manager.interval);
            })
            .catch(err => {
                if(err.response && err.response.status !== 404){
                    const Notification = () => (
                        <div>
                            There was an error!
                        </div>
                    );

                    toast.error(<Notification />, {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            });
    }

    let isConnected = props.auth.user !== null && props.auth.user.connections.find(c => (
        c.service === 'discord'
    ))

    return (
        <div className={cardStyles.card}>
            <div
                className={
                    cardStyles.cardBody +
                    " " +
                    layoutStyles.flex +
                    " " +
                    layoutStyles.flexRow +
                    " " +
                    layoutStyles.alignItemsCenter
                }
            >
                <DiscordIcon height="35" />
                <div className={layoutStyles.mL1}>
                    <p>Discord</p>
                    <p className={connectionsStyles.disconnected}>Disconnected</p>
                </div>
                <div className={layoutStyles.mL}>
                    {
                        !isConnected && !manager.waiting &&
                        <button className={formStyles.button} onClick={handleConnect}>
                            Connect
                        </button>
                    }
                    {
                        manager.waiting &&
                        <LoadingGraphic width={50} />
                    }
                    {
                        isConnected &&
                        <button className={formStyles.button + ' ' + formStyles.buttonSecondary} onClick={handleDisconnect}>
                            Disconnect
                        </button>
                    }
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(Discord);