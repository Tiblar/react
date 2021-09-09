// @flow

import React, { useEffect, useState } from "react";
import type { Node } from "react";

import { PartProvider } from "./context";

function PartContainer(props): Node {
  return (
    <PartProvider>
      <div>{props.children}</div>
    </PartProvider>
  );
}

PartContainer.propTypes = {};

export default PartContainer;
