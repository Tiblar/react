import React from "react";

import layoutStyles from "../../../../css/layout.css";
import mainStyles from "../../../../css/layout/main.css";
import {container as bottomContainer} from "../../../../css/layout/social/container/main.css";
import historyStyles from "../../../../css/layout/video/history.css";

import {ListsProvider} from "../../layout/parts/social/lists/context";
import ListsFetcher from "../../layout/parts/social/lists/ListsFetcher";
import ListsHeader from "../../layout/parts/social/lists/ListsHeader";
import MyLists from "../../layout/parts/social/lists/MyLists";
import MainContainer from "../../layout/parts/video/container/MainContainer";

function Lists() {

    return (
        <MainContainer>
            <div className={mainStyles.bottomContent}>
                <div className={bottomContainer}>
                    <div className={historyStyles.container}>
                        <ListsProvider>
                            <ListsFetcher>
                                <ListsHeader />
                                <hr className={layoutStyles.mB1} />
                                <MyLists portal="video" />
                            </ListsFetcher>
                        </ListsProvider>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
}

export default Lists;
