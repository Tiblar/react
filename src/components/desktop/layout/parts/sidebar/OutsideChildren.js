import React from "react";
import {useSidebarState} from "./context";

const OutsideChildren = () => {
    const state = useSidebarState();

    return <div>{state.outsideChildren}</div>;
}

export default OutsideChildren;
