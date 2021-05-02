import { useEffect, useState } from "react";

const usePageVisibility = () => {
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const handleVisibility = () => {
      const isVisible = document.visibilityState === "visible" || !document.hidden;
      setVisible(isVisible);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return visible;
};

export default usePageVisibility;
