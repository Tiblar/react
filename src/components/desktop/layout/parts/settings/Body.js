// @flow

import React, {useEffect, useRef} from "react";

import {
    container,
    outer,
    inner,
    cover,
} from "../../../../../css/layout/social/settings/body.css";

import Cover from "../../../../../assets/graphics/social/settings/cover.svg";

function Body(props) {
    const ref = useRef();

    useEffect(() => {
        if(ref.current){
            ref.current.scrollTop = 0;
        }
    }, [props])

    return (
        <div className={container} ref={ref}>
            <div className={cover}>
                <Cover />
            </div>
            <div className={outer}>
                <div className={inner}>{props.children}</div>
            </div>
        </div>
    );
}

export default Body;
