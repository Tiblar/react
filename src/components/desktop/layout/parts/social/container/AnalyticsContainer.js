// @flow

import React from "react";

import {wF, positionRelative} from "../../../../../../css/layout.css";
import {container} from "../../../../../../css/layout/social/container/main.css";

import MainContainer from "./MainContainer";
import {AnalyticsProvider} from "../analytics/context";
import AnalyticsFetcher from "../analytics/AnalyticsFetcher";

import useWindowDimensions from "../../../../../../util/hooks/useWindowDimensions";

function AnalyticsContainer(props) {
    const {width} = useWindowDimensions();

    return (
        <MainContainer cover={false}>
            <AnalyticsProvider>
                <AnalyticsFetcher>
                    <div className={wF + ' ' + positionRelative}>
                        <div className={container}>
                            {props.children}
                        </div>
                    </div>
                </AnalyticsFetcher>
            </AnalyticsProvider>
        </MainContainer>
    );
}

export default AnalyticsContainer;
