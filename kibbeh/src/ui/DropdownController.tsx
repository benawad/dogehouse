import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";

export const DropdownController: React.FC<{
  overlay: (c: () => void) => React.ReactNode;
}> = ({ children, overlay }) => {
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

  return (
    <React.Fragment>
      <button
        className="focus:outline-no-chrome"
        ref={referenceRef}
        onClick={() => setVisibility(!visible)}
      >
        {children}
      </button>
      {createPortal(
        <div
          className="z-20 absolute top-9 right-3 md:right-0"
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
        </div>,
        document.querySelector("#main")!
      )}
    </React.Fragment>
  );
};
