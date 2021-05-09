import React, { useEffect, useCallback, useState } from "react";

function getWindowsSize() {
  return { x: window.innerWidth, y: window.innerHeight };
}

export const useResize = () => {
  const [size, setSize] = useState(getWindowsSize());

  const handleResize = useCallback(() => {
    setSize(getWindowsSize());
  }, []);

  // register resize event listener and removes it
  // calls handleResize
  useEffect(() => {
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return size;
};
