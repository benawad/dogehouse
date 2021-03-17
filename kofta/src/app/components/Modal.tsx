import React from "react";
import ReactModal from "react-modal";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0,0,0,.5)",
    zIndex: 1000,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#262626",
    border: "none",
    maxHeight: "80vh",
    width: "90%",
    maxWidth: 500,
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
      <div tabIndex={-1} onKeyDown={onKeyDown}>
        {children}
      </div>
    </ReactModal>
  );
};
