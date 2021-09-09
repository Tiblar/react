import React, {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import axios from "axios";

import cardStyles from "../../../../css/components/card.css";
import layoutStyles from "../../../../css/layout.css";

import CheckIcon from "../../../../assets/svg/icons/check.svg";
import TimesIcon from "../../../../assets/svg/icons/times.svg";
import LaughBeamIcon from "../../../../assets/svg/icons/laughBeam.svg";
import FrownIcon from "../../../../assets/svg/icons/frown.svg";
import LoadingGraphic from "../../../../assets/loading/infinite.svg";

import Container from "../../layout/parts/connection/Container";

import {API_URL, CONNECTION_DISCORD_CODE_ERROR, SUPPORT_URL} from "../../../../util/constants";

function Discord() {
    const _isMounted = useRef(true);

    const [manager, setManager] = useState({
        connected: false,
        loading: true,
        codeError: false,
    });

    useEffect(() => {
        return () => {
            _isMounted.current = false
        }
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        let data = {
          code: code,
        };

        axios.post(API_URL + `/users/@me/connections/discord`, data, config)
            .then(function (res) {
                if(_isMounted.current){
                    setManager(manager => ({
                        ...manager,
                        connected: true,
                        loading: false,
                    }))
                }
            })
            .catch(function (err) {
                if(!_isMounted.current){
                    return;
                }

                if(err.response.data && err.response.data.errors.code === CONNECTION_DISCORD_CODE_ERROR){
                    setManager(manager => ({
                        ...manager,
                        connected: false,
                        loading: false,
                        codeError: true
                    }))

                    return;
                }

                setManager(manager => ({
                    ...manager,
                    connected: false,
                    loading: false,
                }))
            });
    }, []);

    const Success = () => (
        <div className={cardStyles.card}>
            <div className={cardStyles.cardHeader}>
                <h3 className={layoutStyles.textSuccess}>
                    <CheckIcon height={16} /> Connected Discord
                </h3>
            </div>
            <div className={cardStyles.cardBody}>
                <div className={
                    layoutStyles.flex + ' ' + layoutStyles.justifyContentCenter
                    + ' ' + layoutStyles.mB2 + ' ' + layoutStyles.textSuccess
                }>
                    <LaughBeamIcon width="45%" />
                </div>
                <div className={layoutStyles.alert}>
                    <p>
                        You have successfully connected Discord to your Formerly Chuck's account.
                    </p>
                </div>
            </div>
        </div>
    );

    const Fail = () => (
        <div className={cardStyles.card}>
            <div className={cardStyles.cardHeader}>
                <h3 className={layoutStyles.textDanger}>
                    <TimesIcon height={16} /> Connected Discord
                </h3>
            </div>
            <div className={cardStyles.cardBody}>
                <div className={
                    layoutStyles.flex + ' ' + layoutStyles.justifyContentCenter
                    + ' ' + layoutStyles.mB2 + ' ' + layoutStyles.textDanger
                }>
                    <FrownIcon width="45%" />
                </div>
                <div className={layoutStyles.alert}>
                    {
                        manager.codeError &&
                        <p>
                            The code sent back by Discord is expired or invalid. Try again.
                        </p>
                    }
                    {
                        !manager.codeError &&
                        <p>
                            There was an error, please try and link your account again. If this issue persists and you
                            believe you are doing everything correctly, <Link to={SUPPORT_URL}>contact support</Link>.
                        </p>
                    }
                </div>
            </div>
        </div>
    );

    return (
        <Container>
            {
                !manager.connected && manager.loading &&
                <div className={layoutStyles.flex + ' ' + layoutStyles.justifyContentCenter}>
                    <LoadingGraphic width={100} />
                </div>
            }
            {!manager.connected && !manager.loading && <Fail />}
            {manager.connected && !manager.loading && <Success />}
        </Container>
    );
}

export default Discord;
