// @flow

import React, {useState, useCallback, useEffect} from "react";

import { flex } from "../../../../../css/layout.css";
import {
  container,
  mobile,
  close
} from "../../../../../css/layout/social/settings/container.css";

import CloseIcon from "../../../../../assets/svg/icons/windowClose.svg";

import Nav from "./Nav";
import Body from "./Body";
import Layer from "../Layer";
import MobileNav from "./MobileNav";

import {
  CONTAINER,
  REVERT,
  useLayerDispatch,
  useLayerState
} from "../../layer/context";
import { SettingsProvider } from "./context";

import useWindowDimensions from "../../../../../util/hooks/useWindowDimensions";
import {MAX_MOBILE_WIDTH} from "../../../../../util/constants";

function Container() {
  const dispatch = useLayerDispatch();
  const { layer } = useLayerState();

  const {width} = useWindowDimensions();

  const [manager, setManager] = useState({
    showMobileSidebar: false,
  });

  useEffect(() => {
    setManager(manager => ({
      ...manager,
      showMobileSidebar: false,
    }))
  }, [layer]);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  const toggleMobileSidebar = () => {
    setManager(manager => ({
      ...manager,
      showMobileSidebar: !manager.showMobileSidebar
    }))
  }

  const resetMatrix = () => {
    let matrixChat = document.getElementById("matrix-iframe");

    if(matrixChat){
      let tmpSRC = matrixChat.src;
      matrixChat.src = '/matrix/index.html';
      matrixChat.src = tmpSRC;
    }
  }

  const handleClick = e => {
    resetMatrix();
    dispatch({ type: CONTAINER, payload: REVERT });
  };

  const escFunction = useCallback(e => {
    resetMatrix();
    if (e.keyCode === 27) {
      dispatch({ type: CONTAINER, payload: REVERT });
    }
  }, []);

  return (
      <SettingsProvider>
        <Layer>
          {
            width > MAX_MOBILE_WIDTH &&
            <button onClick={handleClick} className={close}>
              <CloseIcon width="35" />
            </button>
          }
          {
            width <= MAX_MOBILE_WIDTH &&
            <MobileNav toggleMobileSidebar={toggleMobileSidebar} mobileSidebar={manager.showMobileSidebar} />
          }
          <div className={flex + ' ' + container + (width <= MAX_MOBILE_WIDTH ? ' ' + mobile : '')}>
            {
              (width > MAX_MOBILE_WIDTH || !manager.showMobileSidebar) &&
              <Body>{layer}</Body>
            }
            {
              (width > MAX_MOBILE_WIDTH || manager.showMobileSidebar) &&
              <Nav />
            }
          </div>
        </Layer>
      </SettingsProvider>
  );
}

export default Container;
