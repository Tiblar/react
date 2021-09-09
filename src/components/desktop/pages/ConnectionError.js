import React, {useEffect} from "react";

import {container} from "../../../css/layout/connection-error.css";
import {card, cardBody} from "../../../css/components/card.css";
import {mB1, mT1} from "../../../css/layout.css";
import {alert} from "../../../css/form.css";

import FrownIcon from "../../../assets/svg/icons/frown.svg";
import ErrorGraphic from "../../../assets/graphics/connection-error.svg";
import LoadingGraphic from "../../../assets/loading/dots.svg";

import store from "../../../store";
import {testConnection} from "../../../reducers/connection/actions";
import {connect} from "react-redux";

function ConnectionError(props) {
    useEffect(() => {
        let interval = setInterval(() => {
            store.dispatch(testConnection());
        }, 3500);

        return () => {
            clearInterval(interval);
        }
    }, []);

    return (
        <div>
            <div className={card + ' ' + container}>
                <div className={cardBody}>
                    <h3>
                        <FrownIcon width="18" />
                        Connection Error
                    </h3>
                    <hr />
                    <ErrorGraphic width="100%" />
                    <div className={alert + ' ' + mB1 + ' ' + mT1}>
                        <LoadingGraphic width={24}/>
                        Attempting to connect
                    </div>
                    <small>
                        You can report this issue by&nbsp;<a href="https://status.formerlychucks.net">clicking here</a>.
                    </small>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { connection } = state;
    return { connection: connection };
};

export default connect(mapStateToProps)(ConnectionError);
