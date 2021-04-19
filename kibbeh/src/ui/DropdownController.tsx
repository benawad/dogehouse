import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";

export const DropdownController: React.FC<{
  portal?: boolean;
  className?: string;
  overlay: (c: () => void) => React.ReactNode;
}> = ({ children, className, overlay, portal = true }) => {
  const [visible, setVisibility] = useState(false);

  const referenceRef = useRef<HTMLButtonElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);

  const { styles, attributes } = usePopper(
    referenceRef.current,
    popperRef.current,
    {
      modifiers: [{ name: "eventListeners", enabled: visible }],
      placement: "left",
    }
  );

  useEffect(() => {
    const handleDocumentClick = (event: any) => {
      if (
        referenceRef.current?.contains(event.target) ||
        popperRef.current?.contains(event.target)
      ) {
        return;
      }
      setVisibility(false);
    };
    // listen for clicks and close dropdown on body
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  const body = (
    <div
      className={`z-20 absolute ${className}`}
      ref={popperRef}
      {...attributes.popper}
    >
      <div
        style={styles.offset}
        className={`${
          visible ? "" : "hidden"
        } fixed transform -translate-x-full`}
      >
        {visible ? overlay(() => setVisibility(false)) : null}
      </div>
    </div>
  );

  return (
    <React.Fragment>
      <button
        className="focus:outline-no-chrome"
        ref={referenceRef}
        onClick={() => setVisibility(!visible)}
      >
        {children}
      </button>
      {portal ? createPortal(body, document.querySelector("#main")!) : body}
    </React.Fragment>
  );
};
