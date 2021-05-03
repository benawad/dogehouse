import { useEffect, useState, RefObject, useRef } from "react";

export const useIntersectionObserver = ({
  threshold = 0,
  root = null,
  rootMargin = "0%",
}): IntersectionObserverEntry | undefined => {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const [node, setNode] = useState<Element>();
  const observer = useRef<IntersectionObserver>(null);

  useEffect(() => {
    if (node) {
      if (observer.current) {
        observer?.current?.disconnect();
      }

      if (window.IntersectionObserver) {
        observer.current = new window.IntersectionObserver(
          ([newEntry]) => setEntry(newEntry),
          {
            root,
            rootMargin,
            threshold,
          }
        );

        const { current: currentObserver } = observer;

        currentObserver.observe(node);

        return () => {
          if (currentObserver) {
            currentObserver.disconnect();
          }
        };
      }
    }
  }, [threshold, root, rootMargin, node]);

  return { setNode, entry };
};
