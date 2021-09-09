// @flow

import React, {useEffect, useRef} from "react";
import PerfectScrollbar from "perfect-scrollbar";
import {connect} from "react-redux";

import {wF, positionRelative, contentWrapper, flex} from "../../../../../../css/layout.css";
import {container} from "../../../../../../css/layout/social/container/main.css";
import mainStyles from "../../../../../../css/layout/main.css";

import AccountCenterNav from "../nav/right/AccountCenterNav";
import HomeNavSocial from "../nav/left/HomeNav";
import HomeNavVideo from "../../video/nav/left/HomeNav";
import TopNavSocial from "../nav/top/FeedTopNav";
import TopNavVideo from "../../video/nav/top/TopNav";

import {AccountCenterProvider} from "../notifications/context";
import useWindowDimensions from "../../../../../../util/hooks/useWindowDimensions";
import {MAX_MOBILE_WIDTH} from "../../../../../../util/constants";

function AccountCenterContainer(props) {
    const containerRef = useRef();
    const {width} = useWindowDimensions();

    useEffect(() => {
        new PerfectScrollbar(containerRef.current, {
            suppressScrollX: true
        });
    }, [containerRef.current]);

    return (
        <div className={contentWrapper}>
            {
                (width > MAX_MOBILE_WIDTH && props.portal.portal === "SOCIAL") &&
                <HomeNavSocial />
            }
            {
                (width > MAX_MOBILE_WIDTH && props.portal.portal === "VIDEO") &&
                <HomeNavVideo />
            }
            <div className={mainStyles.container}>
                <div className={mainStyles.wrapper}>
                    {
                        props.portal.portal === "SOCIAL" &&
                        <TopNavSocial />
                    }
                    {
                        props.portal.portal === "VIDEO" &&
                        <TopNavVideo />
                    }
                    <div className={flex + " " + mainStyles.container}>
                        <div className={mainStyles.bottomContent}>
                            <AccountCenterProvider>
                                <div className={wF + ' ' + positionRelative}>
                                    <div className={container} ref={containerRef}>
                                        {props.children}
                                    </div>
                                </div>
                                {
                                    width > MAX_MOBILE_WIDTH &&
                                    <AccountCenterNav />
                                }
                            </AccountCenterProvider>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { portal } = state;
    return { portal: portal };
};

export default connect(mapStateToProps)(AccountCenterContainer);
