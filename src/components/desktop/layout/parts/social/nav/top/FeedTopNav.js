// @flow

import React, {useCallback, useEffect, useRef, useState} from "react";
import { connect } from "react-redux";
import {isMobile} from "is-mobile";

import mainStyles from "../../../../../../../css/layout/main.css";
import layoutStyles from "../../../../../../../css/layout.css";

import SearchInput from "../../../search/SearchInput";
import Actions from "./Actions";
import Hamburger from "./Hamburger";

import useWindowDimensions from "../../../../../../../util/hooks/useWindowDimensions";
import {MAX_MOBILE_WIDTH} from "../../../../../../../util/constants";
import outsideClick from "../../../../../../../util/components/outsideClick";

function FeedTopNav(props) {
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
                <SearchInput show={manager.show} setShow={setShow} />
            </div>
            {width > 600 && <Actions />}
        </div>
    );
}

const mapStateToProps = state => {
    const { auth } = state;
    return { auth: auth };
};

export default connect(mapStateToProps)(FeedTopNav);
