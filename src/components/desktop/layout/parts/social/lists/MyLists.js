import React from "react";
import {Link} from "react-router-dom";

import cardStyles from "../../../../../../css/components/card.css";
import layoutStyles from "../../../../../../css/layout.css";
import formStyles from "../../../../../../css/form.css";

import errorCardStyles from "../../../../../../css/layout/social/error-card.css";
import EmptyGraphic from "../../../../../../assets/graphics/empty.svg";

import {useListsState} from "./context";

function MyLists(props) {

    const state = useListsState();

    let portal = "social";
    if(props.portal){
        portal = props.portal;
    }

    if(state.lists.length === 0 && !state.loadingLists){
        return (
            <div className={cardStyles.card + ' ' + errorCardStyles.popupShow}>
                <div className={cardStyles.cardBody}>
                    <EmptyGraphic width="100%" />
                </div>
            </div>
        )
    }

    return state.lists.map(list => (
        <div className={cardStyles.card + ' ' + layoutStyles.mB1} key={list.id}>
            <div className={cardStyles.cardBody}>
                <div className={layoutStyles.flex + ' ' + layoutStyles.alignItemsCenter}>
                    <p>{list.title}</p>
                    <Link className={formStyles.button + ' ' + layoutStyles.mL} to={`/${portal}/list/` + list.id}>View</Link>
                </div>
            </div>
        </div>
    ))
}

export default MyLists;
