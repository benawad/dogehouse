import React from "react";
import ReactModal from "react-modal";
import { SmSolidPlus } from "../icons";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 1000,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    borderRadius: 8,
    transform: "translate(-50%, -50%)",
    backgroundColor: "var(--color-primary-800)",
    border: "none",
    maxHeight: "80vh",
    width: "90%",
    maxWidth: 530,
  },
};

export const Modal: React.FC<ReactModal["props"]> = ({
  children,
  ...props
}) => {
  const onKeyDown = (event: React.KeyboardEvent) => {
    const currentActive = document.activeElement;

    if (event.key === "ArrowLeft") {
      (currentActive?.previousElementSibling as HTMLElement)?.focus();
    } else if (event.key === "ArrowRight") {
      (currentActive?.nextElementSibling as HTMLElement)?.focus();
    }
  };

  return (
    <ReactModal
      shouldCloseOnEsc
      shouldFocusAfterRender
      style={customStyles}
      {...props}
    >
      <div className={`flex-col`}>
        <div className={`justify-end mb-1`}>
          <button onClick={(e) => props?.onRequestClose?.(e)}>
            <SmSolidPlus className={`transform rotate-45`} />
          </button>
        </div>
        <div
          tabIndex={-1}
          className={`focus:outline-none`}
          onKeyDown={onKeyDown}
        >
          {children}
        </div>
      </div>
    </ReactModal>
  );
};
