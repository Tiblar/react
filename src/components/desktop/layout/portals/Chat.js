// @flow

import React  from "react";
import AutoAuth from "../AutoAuth";

function Chat(props) {

    return (
        <AutoAuth>
            {props.children}
        </AutoAuth>
  );
}

export default Chat;
