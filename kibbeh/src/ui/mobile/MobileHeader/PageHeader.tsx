import React from "react";
import { SolidCaretRight } from "../../../icons";

export interface PageHeaderProps {
  title: string;
  onBackClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => null;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onBackClick,
}) => {
  return (
    <div className="w-full px-3 py-4 bg-primary-900 text-primary-100">
      {onBackClick && (
        <button className="absolute" onClick={onBackClick}>
          <SolidCaretRight
            className="transform -rotate-180"
            height={20}
            width={20}
          />
        </button>
      )}
      {title && <span className="mx-auto">{title}</span>}
    </div>
  );
};
