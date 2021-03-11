import React, { MouseEventHandler, ReactNode } from "react";

export interface BaseOverlayProps {
  title?: string;
  actionButton?: string;
  onActionButtonClicked?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

export const BaseOverlay: React.FC<BaseOverlayProps> = ({
  children,
  title,
  actionButton,
  onActionButtonClicked,
}) => {
  return (
    <div
      style={{ borderRadius: "8px" }}
      className="flex flex-col w-full bg-primary-800 border border-primary-700"
    >
      {title && (
        <div className="px-4 py-3 w-full border-b border-primary-600 flex flex-col justify-center">
          <h4 className="text-primary-100">{title}</h4>
        </div>
      )}

      <div className="flex flex-col w-full text-primary-100">{children}</div>

      {actionButton && (
        <div
          className="w-full px-4 bg-primary-700 text-primary-100"
          style={{
            paddingTop: 8,
            paddingBottom: 12,
          }}
        >
          <button
            className="cursos-pointer outline-none font-bold"
            onClick={onActionButtonClicked}
          >
            {actionButton}
          </button>
        </div>
      )}
    </div>
  );
};
