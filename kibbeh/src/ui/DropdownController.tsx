import React, { useState, useEffect, useRef } from "react";
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
      placement: "bottom",
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
      <button ref={referenceRef} onClick={() => setVisibility(!visible)}>
        {children}
      </button>
      <div
        className="z-10"
        ref={popperRef}
        style={styles.popper}
        {...attributes.popper}
      >
        <div style={styles.offset} className={`${visible ? "" : "hidden"}`}>
          {overlay(() => setVisibility(false))}
        </div>
      </div>
    </React.Fragment>
  );
};
