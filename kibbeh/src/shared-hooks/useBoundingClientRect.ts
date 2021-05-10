import { MutableRefObject, useState, useEffect, useCallback } from "react";

function getBoundingClientRect(
  element: HTMLElement
): ClientRect | DOMRect | null {
  return element.getBoundingClientRect();
}

function useBoundingClientRect(
  ref: MutableRefObject<HTMLElement | null>
): ClientRect | DOMRect | null {
  const [value, setValue] = useState<ClientRect | DOMRect | null>(null);

  const update = useCallback(() => {
    setValue(ref.current ? getBoundingClientRect(ref.current) : null);
  }, [ref]);

  useEffect(() => {
    update();
  }, [update]);

  return value;
}

export { useBoundingClientRect };
