import { useEffect } from "react";

const outsideClick = (ref, callback) => {
  const handleClick = e => {

    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    window.__app_mount.addEventListener("click", handleClick);

    return () => {
      window.__app_mount.removeEventListener("click", handleClick);
    };
  });
};

export default outsideClick;
