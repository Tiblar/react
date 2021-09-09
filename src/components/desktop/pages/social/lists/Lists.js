import React from "react";

import layoutStyles from "../../../../../css/layout.css";

import ListsContainer from "../../../layout/parts/social/container/ListsContainer";
import MyLists from "../../../layout/parts/social/lists/MyLists";
import ListsHeader from "../../../layout/parts/social/lists/ListsHeader";

function Lists() {

    return (
        <ListsContainer>
            <ListsHeader />
            <hr className={layoutStyles.mB1} />
            <MyLists />
        </ListsContainer>
    );
}

export default Lists;