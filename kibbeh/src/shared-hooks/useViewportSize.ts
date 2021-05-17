import { debounce } from "lodash";
import { useEffect, useState } from "react";

interface WindowSize {
  width: number;
  height: number;
}

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: visualViewport.width ?? window.innerWidth,
    height: visualViewport.height ?? window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: visualViewport.width ?? window.innerWidth,
        height: visualViewport.height ?? window.innerHeight,
      });
    };

    const debounced = debounce(handleResize, 1000);

    if(!visualViewport) {
      window.addEventListener("resize", debounced);
    } else {
      visualViewport.addEventListener("resize", debounced);
    }

    handleResize();

    return () => {
      debounced.cancel(); // Prevents killing func while handleResize is running
      if(!visualViewport) {
        window.removeEventListener("resize", debounced);
      } else {
        visualViewport.removeEventListener("resize", debounced);
      }
    };
  }, []);

  return windowSize;
};

export default useWindowSize;
