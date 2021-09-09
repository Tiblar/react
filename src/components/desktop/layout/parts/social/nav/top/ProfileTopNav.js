// @flow

import React, {useCallback, useEffect, useRef, useState} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {isMobile} from "is-mobile";

import { topNav } from "../../../../../../../css/layout/main.css";
import layoutStyles from "../../../../../../../css/layout.css";

import SearchInput from "../../../search/SearchInput";
import Actions from "./Actions";
import Hamburger from "./Hamburger";
import HamburgerVideo from "../../../video/nav/top/Hamburger";

import {
    MAX_MOBILE_WIDTH,
} from "../../../../../../../util/constants";
import {useProfileState} from "../../../profile/context";
import useWindowDimensions from "../../../../../../../util/hooks/useWindowDimensions";
import outsideClick from "../../../../../../../util/components/outsideClick";
import history from "../../../../../../../util/history";
import {themeBackground} from "../../../../../../../util/getTheme";

function ProfileTopNav(props) {
    const { user } = useProfileState();
    const { width } = useWindowDimensions();

    const searchRef = useRef();

    const [manager, setManager] = useState({
        show: false,
        search: "PROFILE",
        location: window.location.pathname,
    });

    useEffect(() => {
        const unlisten = history.listen(location =>  {
            setManager(manager => ({
                ...manager,
                location: location.pathname,
            }))
        });

        return () => {
            unlisten();
        }
    }, [manager.location]);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, []);

    function setShow(show) {
        let search = manager.search;
        if(show === false){
            search = "PROFILE";
        }

        setManager(manager => ({
            ...manager,
            show: show,
            search: search,
        }))
    }

    function setSearch(search) {
        setManager(manager => ({
            ...manager,
            search: search
        }));
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

    let baseChannelUrl = "/channel/" + props.username;

    return (
        <div className={layoutStyles.flex + ' ' + layoutStyles.flexColumn} ref={searchRef}>
            <div className={topNav + themeBackground(user)}>
                <div className={layoutStyles.flex + ' ' + layoutStyles.wF}>
                    {
                        (width <= MAX_MOBILE_WIDTH && (!isMobile() || !manager.show) && props.portal.portal === "SOCIAL")
                        && <Hamburger theme={props.theme} />
                    }
                    {
                        (
                            width <= MAX_MOBILE_WIDTH &&
                            (!isMobile() || !manager.show) &&
                            props.portal.portal === "VIDEO" &&
                            manager.location.startsWith(baseChannelUrl)
                        )
                        && <HamburgerVideo theme={props.theme} />
                    }
                    <SearchInput
                        username={manager.search === "PROFILE" ? props.username : null}
                        profiles={manager.search === "EVERYTHING"}
                        search={manager.search}
                        profileNav={true}
                        show={manager.show}
                        setShow={setShow}
                        setSearch={setSearch}
                        video={props.video} />
                    {width > 600 && <Actions />}
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { auth, portal } = state;
    return { auth: auth, portal: portal };
};

ProfileTopNav.propTypes = {
    theme: PropTypes.string,
    video: PropTypes.bool,
}

ProfileTopNav.defaultProps = {
    theme: null,
    video: false,
}

export default connect(mapStateToProps)(ProfileTopNav);
