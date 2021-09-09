// @flow

import React from "react";
import ReactTooltip from "react-tooltip";
import PropTypes from "prop-types";

import formStyles from "../../../../../../css/form.css";
import financialStyles from "../../../../../../css/layout/social/settings/pages/financials.css";
import layoutStyles from "../../../../../../css/layout.css";

import TiblarGraphic from "../../../../../../assets/svg/logo-icon.svg";

import ProfilePicture from "../../../../layout/parts/user/ProfilePicture";

import {formatDate} from "../../../../../../util/date";
import useWindowDimensions from "../../../../../../util/hooks/useWindowDimensions";
import {MAX_MOBILE_WIDTH} from "../../../../../../util/constants";

function OrderRow(props) {
    const {width} = useWindowDimensions();

    function handleClick() {
        if(props.setModal){
            props.setModal(props.order.id);
        }
    }

    let order = props.order;

    if(width < MAX_MOBILE_WIDTH){
        return (
            <div className={financialStyles.order + ' ' + financialStyles.mobile} onClick={handleClick}>
                <div>
                    {
                        order.seller !== null &&
                        <div className={financialStyles.shrink}>
                            <ProfilePicture user={order.seller} small={true} tooltip={true} />
                        </div>
                    }
                    {
                        order.seller === null &&
                        <div className={financialStyles.shrink}>
                            <TiblarGraphic width={40} height={40} data-tip data-for={"order-profile-" + order.id} />
                            <ReactTooltip id={"order-profile-" + order.id} place="right" type="dark" effect="solid">
                                <span>Formerly Chuck's</span>
                            </ReactTooltip>
                        </div>
                    }
                    {
                        order.recurring && order.active &&
                        <div className={financialStyles.shrink + ' ' + layoutStyles.mL}>
                            <div className={formStyles.badge + ' ' + formStyles.success}>
                                Active
                            </div>
                        </div>
                    }
                    {
                        order.recurring && !order.active &&
                        <div className={financialStyles.shrink + ' ' + layoutStyles.mL}>
                            <div>
                                Inactive
                            </div>
                        </div>
                    }
                    {
                        !order.recurring &&
                        <div className={financialStyles.shrink + ' ' + layoutStyles.mL}>
                            -
                        </div>
                    }
                </div>
                <div className={financialStyles.divide}>
                    <hr />
                </div>
                <div>
                    <div>
                        <p>
                            {order.product.title}
                        </p>
                    </div>
                    <div className={layoutStyles.mL}>
                        <p data-tip data-for={"order-time-" + order.id}>{formatDate(order.timestamp)}</p>
                        <ReactTooltip id={"order-time-" + order.id} place="top" type="dark" effect="solid">
                            <span>Last invoice</span>
                        </ReactTooltip>
                    </div>
                </div>
                <div className={financialStyles.divide}>
                    <hr />
                </div>
                <div>
                    <div className={layoutStyles.flex}>
                        <div>
                            <p>
                                {order.price}&nbsp;{order.currency}{order.frequency !== null && " / " + order.frequency.toLowerCase()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={financialStyles.order} onClick={handleClick}>
            {
                order.seller !== null &&
                <div className={financialStyles.shrink}>
                    <ProfilePicture user={order.seller} small={true} tooltip={true} />
                </div>
            }
            {
                order.seller === null &&
                <div className={financialStyles.shrink}>
                    <TiblarGraphic width={40} height={40} data-tip data-for={"order-profile-" + order.id} />
                    <ReactTooltip id={"order-profile-" + order.id} place="right" type="dark" effect="solid">
                        <span>Formerly Chuck's</span>
                    </ReactTooltip>
                </div>
            }
            <div>
                <p data-tip data-for={"order-time-" + order.id}>{formatDate(order.timestamp)}</p>
                <ReactTooltip id={"order-time-" + order.id} place="top" type="dark" effect="solid">
                    <span>Last invoice</span>
                </ReactTooltip>
            </div>
            <div>
                <p>
                    {order.product.title}
                </p>
            </div>
            <div>
                <p>
                    {order.price}&nbsp;{order.currency}{order.frequency !== null && " / " + order.frequency.toLowerCase()}
                </p>
            </div>
            {
                order.recurring && order.active &&
                <div className={financialStyles.shrink}>
                    <div className={formStyles.badge + ' ' + formStyles.success}>
                        Active
                    </div>
                </div>
            }
            {
                order.recurring && !order.active &&
                <div className={financialStyles.shrink}>
                    <div>
                        Inactive
                    </div>
                </div>
            }
            {
                !order.recurring &&
                <div className={financialStyles.shrink}>
                    -
                </div>
            }
        </div>
    );
}

OrderRow.propTypes = {
    order: PropTypes.object,
    setModal: PropTypes.func,
};

export default OrderRow;

