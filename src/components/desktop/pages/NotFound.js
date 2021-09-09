import React from "react";
import {Link} from "react-router-dom";

import notFoundStyles from "../../../css/components/not-found.css";

import FrownIcon from "../../../assets/svg/icons/frown.svg";
import ScreamGraphic from "../../../assets/graphics/scream.svg";

import useWindowDimensions from "../../../util/hooks/useWindowDimensions";

function NotFound(props) {
    const {width} = useWindowDimensions();

    return (
        <div className={notFoundStyles.container}>
            <div className={notFoundStyles.info}>

                    {
                        width > 600 &&
                            <div>
                                <h1>
                                    <FrownIcon width="28" />
                                    404 - Page not found
                                </h1>
                                <hr />
                                <h3><Link to="/">Home</Link></h3>
                            </div>
                    }
                    {
                        width <= 600 &&
                        <div>
                            <h1>Page not found</h1>
                            <hr />
                            <h3><Link to="/">Home</Link></h3>
                        </div>
                    }
            </div>
            {
                width > 880 &&
                <div className={notFoundStyles.graphic}>
                    <ScreamGraphic width="100%" />
                </div>
            }
        </div>
    );
}

export default NotFound;
