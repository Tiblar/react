// @flow

import React, {useState, useRef} from "react";
import ReactTooltip from "react-tooltip";
import { connect } from "react-redux";

import {icon} from "../../../../../../../css/layout/social/nav/top.css";
import {flex, mL, mR1, mR2} from "../../../../../../../css/layout.css";

import BullhornIcon from "../../../../../../../assets/svg/icons/bullhorn.svg";
import UserIcon from "../../../../../../../assets/svg/icons/userPlus.svg";
import HelpIcon from "../../../../../../../assets/svg/icons/info.svg";

import history from "../../../../../../../util/history";
import QuickFollow from "./QuickFollow";
import outsideClick from "../../../../../../../util/components/outsideClick";
import {MAX_MOBILE_WIDTH} from "../../../../../../../util/constants";
import useWindowDimensions from "../../../../../../../util/hooks/useWindowDimensions";

function Actions(props) {
    const [manager, setManager] = useState({
        quickFollow: false,
    });

    const quickRef = useRef();
    const {width} = useWindowDimensions();

    function handleQuickFollow() {
        setManager(manager => ({
            ...manager,
            quickFollow: true
        }));
    }

    outsideClick(quickRef, () => {
        setManager(manager => ({
            ...manager,
            quickFollow: false,
        }));
    })

    if(!props.auth.isAuthenticated){
      return (
          <div className={flex + " " + mL}>
              <div data-tip data-for="help" onClick={() => { history.push("/support") }} className={icon + " " + (width <= MAX_MOBILE_WIDTH ? mR1 : mR2)}>
                  <HelpIcon width={28} />
              </div>
              <ReactTooltip id="help" place="bottom" type="dark" effect="solid">
                  <span>Help/Info</span>
              </ReactTooltip>
          </div>
      )
    }

    return (
                <div className={flex + " " + mL}>
                    {
                        width > MAX_MOBILE_WIDTH &&
                        <div
                            data-tip
                            data-for="mentions"
                            className={icon + " " + mL + " " + mR2}
                        >
                            <BullhornIcon width={28} />
                        </div>
                    }
                    <ReactTooltip id="mentions" place="bottom" type="dark" effect="solid">
                        <span>Coming soon!</span>
                    </ReactTooltip>
                    <div ref={quickRef} className={flex}>
                        <div data-tip data-for="friend" className={icon + " " + mR2} onClick={handleQuickFollow}>
                            <UserIcon width={28} />
                        </div>
                        {
                            manager.quickFollow &&
                            <QuickFollow />
                        }
                    </div>
                    <ReactTooltip id="friend" place="bottom" type="dark" effect="solid">
                        <span>Quick follow</span>
                    </ReactTooltip>
                    <div data-tip data-for="help" onClick={() => { history.push("/support") }} className={icon + " " + (width <= MAX_MOBILE_WIDTH ? mR1 : mR2)}>
                        <HelpIcon width={28} />
                    </div>
                    <ReactTooltip id="help" place="bottom" type="dark" effect="solid">
                        <span>Help/Info</span>
                    </ReactTooltip>
                </div>
            )
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(Actions);
