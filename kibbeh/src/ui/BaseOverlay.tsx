import React, { MouseEventHandler, ReactNode } from "react";
import ProfileHeaderWrapperStory from "../stories/ProfileHeaderWrapper.story";

export interface BaseOverlayProps
  extends React.ComponentPropsWithoutRef<"div"> {
  title?: string;
  actionButton?: string;
  onActionButtonClicked?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  overlay?: ReactNode;
}

export const BaseOverlay: React.FC<BaseOverlayProps> = ({
  children,
  title,
  actionButton,
  overlay,
  onActionButtonClicked,
  ...props
}) => {
  return (
    <div
      className="flex flex-col w-full rounded-8 bg-primary-800 border border-primary-700 overflow-hidden relative"
      data-testid="base-overlay"
      {...props}
    >
      {overlay ? overlay : ""}
      {title && (
        <div className="px-4 py-3 border-b border-primary-600 flex items-center">
          <h4 className="text-primary-100">{title}</h4>
        </div>
      )}

      <div className="flex flex-col text-primary-100">{children}</div>

      {actionButton && (
        <button
          className="flex px-4 bg-primary-700 text-primary-100 outline-none font-bold"
          style={{
            paddingTop: 8,
            paddingBottom: 12,
            borderRadius: "0 0 8px 8px",
          }}
          onClick={onActionButtonClicked}
        >
          {actionButton}
        </button>
      )}
    </div>
  );
};
