// @flow

import React from "react";

import {flex, contentWrapper} from "../../../../../../css/layout.css";
import mainStyles from "../../../../../../css/layout/main.css";

import TopNav from "../nav/top/TopNav";
import HomeNav from "../nav/left/HomeNav";

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
                        <div className={mainStyles.bottomContent}>
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainContainer;
