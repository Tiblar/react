import React from "react";

import constructionStyles from "../../../css/components/construction.css";

import Taken from "../../../assets/graphics/social/settings/taken.svg";

import Analytics from "./social/Analytics";

import useWindowDimensions from "../../../util/hooks/useWindowDimensions";
import {MAX_MOBILE_WIDTH} from "../../../util/constants";

function Construction(props) {
    const {width} = useWindowDimensions();

    if(width > MAX_MOBILE_WIDTH) {
        return (
            <div className={constructionStyles.container}>
                <div className={constructionStyles.graphic}>
                    <Taken width="50%"/>
                    <h2>Under construction!</h2>
                </div>
            </div>
        );
    }

    return <Analytics />
}

export default Construction;

