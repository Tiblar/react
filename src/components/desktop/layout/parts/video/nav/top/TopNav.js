// @flow

import React, {useCallback, useEffect, useRef, useState} from "react";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import {isMobile} from "is-mobile";

import HelpIcon from "../../../../../../../assets/svg/icons/info.svg";

import mainStyles from "../../../../../../../css/layout/main.css";
import layoutStyles from "../../../../../../../css/layout.css";
import topStyles from "../../../../../../../css/layout/social/nav/top.css";

import SearchInput from "../../../search/SearchInput";
import Hamburger from "./Hamburger";

import useWindowDimensions from "../../../../../../../util/hooks/useWindowDimensions";
import history from "../../../../../../../util/history";
import {MAX_MOBILE_WIDTH} from "../../../../../../../util/constants";
import outsideClick from "../../../../../../../util/components/outsideClick";

function TopNav(props) {
    const {width} = useWindowDimensions();
    const searchRef = useRef();

    const [manager, setManager] = useState({
        show: false,
    });

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, []);

    function setShow(show) {
        setManager(manager => ({
            ...manager,
            show: show
        }))
    }

    const escFunction = useCallback(e => {
        window.focus();
        if (e.keyCode === 27) {
            setShow(false);
        }
    }, []);

    outsideClick(searchRef, () => {
        setShow(false)
    })

    return (
        <div className={mainStyles.topNav}>
            {width <= MAX_MOBILE_WIDTH && (!isMobile() || !manager.show) && <Hamburger />}
            <div className={layoutStyles.flex + ' ' + layoutStyles.flexGrow} ref={searchRef}>
                <SearchInput video={true} show={manager.show} setShow={setShow} />
            </div>
            <div className={layoutStyles.flex + ' ' + layoutStyles.mL}>
                <div
                    data-tip
                    data-for="help"
                    onClick={() => { history.push("/support") }}
                    className={topStyles.icon + " " + (width <= MAX_MOBILE_WIDTH ? layoutStyles.mR1 : layoutStyles.mR2)}
                >
                    <HelpIcon width={28} />
                </div>
                <ReactTooltip id="help" place="bottom" type="dark" effect="solid">
                    <span>Help/Info</span>
                </ReactTooltip>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(TopNav);
