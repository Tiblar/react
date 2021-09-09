// @flow

import React from "react";
import PropTypes from "prop-types";

import {flex, contentWrapper} from "../../../../../../css/layout.css";
import mainStyles from "../../../../../../css/layout/main.css";

import Cover from "../../../../../../assets/graphics/social/cover.svg";

import TopNav from "../nav/top/FeedTopNav";
import HomeNav from "../nav/left/HomeNav";

import history from "../../../../../../util/history";
import useWindowDimensions from "../../../../../../util/hooks/useWindowDimensions";
import {MAX_MOBILE_WIDTH} from "../../../../../../util/constants";

function MainContainer(props) {

    const {width} = useWindowDimensions();

    if(width > MAX_MOBILE_WIDTH){
        return (
            <div className={contentWrapper}>
                <HomeNav />
                <div className={mainStyles.container}>
                    <div className={mainStyles.wrapper}>
                        <TopNav />
                        <div className={flex + " " + mainStyles.container}>
                            {
                                (!history.location.pathname.startsWith("/search/") && props.cover) &&
                                <div className={mainStyles.cover}>
                                    <Cover />
                                </div>
                            }
                            <div className={mainStyles.bottomContent}>
                                {props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={contentWrapper}>
            <div className={mainStyles.container}>
                <div className={mainStyles.wrapper}>
                    <TopNav />
                    <div className={flex + " " + mainStyles.container}>
                        {
                            ! history.location.pathname.startsWith("/search/") &&
                            <div className={mainStyles.cover}>
                                <Cover />
                            </div>
                        }
                        <div className={mainStyles.bottomContent}>
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

MainContainer.propTypes = {
    cover: PropTypes.bool,
}

MainContainer.defaultProps = {
    cover: true,
}

export default MainContainer;
