import * as React from "react";
import { SolidPlus } from "../icons";

export type BannerDurations = "default" | "sticky";

export interface BannerProps {
  message: string;
  button?: React.ReactNode;
  duration?: BannerDurations;
  onClose?: () => void;
}

export const Banner: React.FC<BannerProps> = ({
  message,
  button,
  duration = "default",
  onClose,
}) => {
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;
  React.useEffect(() => {
    if (duration === "sticky") {
      return;
    }

    const timer = setTimeout(() => {
      onCloseRef.current?.();
    }, 7000);

    return () => {
      clearTimeout(timer);
    };
  }, [duration]);

  return (
    <div
      className={`flex rounded-8 p-3 relative w-full items-center justify-center text-button transition-transform duration-300 bg-secondary`}
      data-testid="banner-message"
    >
      {onClose ? (
        <div
          className={`flex absolute cursor-pointer`}
          style={{
            top: 5,
            right: 7,
            width: 13,
            height: 13,
          }}
          onClick={onClose}
          data-testid="close-btn"
        >
          <SolidPlus style={{ transform: "rotate(45deg)" }} />
        </div>
      ) : null}
      <div className={`flex space-x-4 items-center`}>
        <div className={`bold`}>{message}</div>
        {button}
      </div>
    </div>
  );
};
