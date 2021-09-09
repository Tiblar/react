// @flow

import React from "react";

import {wF, positionRelative} from "../../../../../../css/layout.css";
import {container, postContainer} from "../../../../../../css/layout/social/container/main.css";
import listsStyles from "../../../../../../css/layout/social/lists.css";

import MainContainer from "./MainContainer";
import {ListsProvider} from "../lists/context";
import ListsFetcher from "../lists/ListsFetcher";
import RecommendNav from "../nav/right/RecommendNav";

import {MAX_MOBILE_WIDTH} from "../../../../../../util/constants";
import useWindowDimensions from "../../../../../../util/hooks/useWindowDimensions";

function ListsContainer(props) {
    const {width} = useWindowDimensions();

    return (
        <MainContainer>
            <ListsProvider>
                <ListsFetcher>
                    <div className={wF + ' ' + positionRelative}>
                        <div className={container}>
                            <div className={postContainer + ' ' + listsStyles.container}>
                                {props.children}
                            </div>
                        </div>
                    </div>
                </ListsFetcher>
            </ListsProvider>
            {width > MAX_MOBILE_WIDTH ? <RecommendNav /> : null}
        </MainContainer>
    );
}

export default ListsContainer;
