import React, {useState} from "react";

import layoutStyles from "../../../../../../css/layout.css";
import formStyles from "../../../../../../css/form.css";

import {useListsState} from "./context";
import NewListModal from "./NewListModal";

function ListsHeader() {

    const state = useListsState();

    const [manager, setManager] = useState({
        newList: false,
    })

    function handleNewList() {
        setManager(manager => ({
            newList: !manager.newList
        }));
    }

    return (
        <div className={layoutStyles.flex + ' ' + layoutStyles.alignItemsCenter}>
            {manager.newList && <NewListModal close={handleNewList} />}

            <h3>My Lists</h3>
            {
                (!state.loadingLists && state.lists.length < 15) &&
                <button className={formStyles.button + ' ' + formStyles.buttonPrimary + ' ' + layoutStyles.mL} onClick={handleNewList}>
                    New List
                </button>
            }
        </div>
    );
}

export default ListsHeader;
