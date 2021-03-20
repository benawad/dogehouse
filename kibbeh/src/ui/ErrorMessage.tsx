import * as React from "react";
import { SolidPlus } from "../icons";

export interface ErrorMessageProps {
  message?: string;
  button?: string;
  autoClose?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "An error has occurred",
  button = "Refresh",
  autoClose = false,
  ...props
}) => {
  const [closed, setClosed] = React.useState<boolean>(true);

  React.useEffect(() => {
    setClosed(false);
  }, []);

  React.useEffect(() => {
    if (closed || !autoClose) {
      return;
    }

    const timer = setTimeout(() => {
      setClosed(true);
    }, 7000);

    return () => {
      clearTimeout(timer);
    };
  }, [autoClose, closed]);

  return (
    <div
      className={`rounded-t-8 w-full fixed items-center justify-center text-button transition-transform duration-300`}
      style={{
        height: 50,
        backgroundColor: "#5575E7",
        bottom: 0,
        left: 0,
        transform: closed ? "translateY(100%)" : "translateY(0%)",
      }}
      data-testid="error-message"
    >
      <div
        className={`absolute cursor-pointer`}
        style={{
          top: 5,
          right: 7,
          width: 13,
          height: 13,
        }}
        onClick={() => setClosed(true)}
        data-testid="close-btn"
      >
        <SolidPlus style={{ transform: "rotate(45deg)" }} />
      </div>
      <div className={`flex space-x-4 items-center`}>
        <p className={`bold`}>{message}</p>
        {button ? (
          <button
            className={`rounded-lg px-3 font-bold text-sm`}
            style={{
              backgroundColor: "#879EED",
              paddingTop: 3,
              paddingBottom: 3,
            }}
            {...props}
          >
            {button}
          </button>
        ) : null}
      </div>
    </div>
  );
};
