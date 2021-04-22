import { useMediaQuery } from "react-responsive";

export const useScreenType = () => {
  const is3Cols = useMediaQuery({ minWidth: 1336 });
  const is2Cols = useMediaQuery({ minWidth: 1265 });
  const is1Cols = useMediaQuery({ minWidth: 800 });

  if (is3Cols) {
    return "3-cols";
  }
  if (is2Cols) {
    return "2-cols";
  }
  if (is1Cols) {
    return "1-cols";
  }

  return "fullscreen";
};
