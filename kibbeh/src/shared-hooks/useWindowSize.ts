import { debounce } from "lodash";
import { useEffect, useState } from "react";

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const debounced = debounce(handleResize, 1000);

    window.addEventListener("resize", debounced);

    handleResize();

    return () => {
      debounced.cancel(); // Prevents killing func while handleResize is running
      window.removeEventListener("resize", debounced);
    };
  }, []);

  return windowSize;
};

export default useWindowSize;
