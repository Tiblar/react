import React, {useState} from "react";

import {container} from "../../../css/layout/connection-error.css";
import {card, cardBody} from "../../../css/components/card.css";
import {mB1, mT1, mL, flex} from "../../../css/layout.css";
import {alert, button, buttonSecondary, buttonPrimary} from "../../../css/form.css";

import FrownIcon from "../../../assets/svg/icons/frown.svg";
import LoadingGraphic from "../../../assets/loading/dots.svg";

import store from "../../../store";
import {SUPPORT_URL} from "../../../util/constants";
import {loadUser, logout} from "../../../reducers/auth/actions";

function AuthError(props) {
    const [manager, setManager] = useState({
        sending: false,
    });

    function handleTry() {
        if(manager.sending) return;

        setManager({
            sending: true,
        });

        setTimeout(() => {
            store.dispatch(loadUser());

            setManager({
                sending: false,
            });
        }, 800);
    }

    function handleLogout() {
        if(manager.sending) return;

        store.dispatch(logout());
    }

    return (
        <div>
            <div className={card + ' ' + container}>
                <div className={cardBody}>
                    <h3>
                        <FrownIcon width="18" />
                        Authentication Error
                    </h3>
                    <hr />
                    <div className={flex}>
                        <button onClick={handleTry} className={button + ' ' + buttonPrimary}>Try again</button>
                        <button onClick={handleLogout} className={button + ' ' + buttonSecondary + ' ' + mL}>Logout</button>
                    </div>
                    {
                        !manager.sending &&
                        <div className={alert + ' ' + mB1 + ' ' + mT1}>
                            Unable to authenticate.
                        </div>
                    }
                    {
                        manager.sending &&
                        <div className={alert + ' ' + mB1 + ' ' + mT1}>
                            <LoadingGraphic width={20}/>
                            Attempting to authorize
                        </div>
                    }
                    <small>
                        If this issue persists, you can open a ticket by <a href={SUPPORT_URL}>clicking here</a>.
                    </small>
                </div>
            </div>
        </div>
    );
}

export default AuthError;
