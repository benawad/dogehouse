import { debounce } from "lodash";
import { useEffect, useState } from "react";

interface WindowSize {
  width: number;
  height: number;
}

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.visualViewport?.width ?? window.innerWidth,
    height: window.visualViewport?.height ?? window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.visualViewport?.width ?? window.innerWidth,
        height: window.visualViewport?.height ?? window.innerHeight,
      });
    };

    const debounced = debounce(handleResize, 1000);

    if(!window.visualViewport) {
      window.addEventListener("resize", debounced);
    } else {
      window.visualViewport.addEventListener("resize", debounced);
    }

    handleResize();

    return () => {
      debounced.cancel(); // Prevents killing func while handleResize is running
      if(!window.visualViewport) {
        window.removeEventListener("resize", debounced);
      } else {
        window.visualViewport.removeEventListener("resize", debounced);
      }
    };
  }, []);

  return windowSize;
};

export default useWindowSize;
