import React from "react";
import { SolidCaretRight } from "../../../icons";

export interface PageHeaderProps {
  title: string | React.ReactNode;
  onBackClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onBackClick,
}) => {
  return (
    <div className="flex w-full px-3 bg-primary-900 text-primary-100 h-8 items-center">
      {onBackClick && (
        <button className="absolute" onClick={onBackClick}>
          <SolidCaretRight
            className="transform -rotate-180"
            height={20}
            width={20}
          />
        </button>
      )}
      {title && (
        <span className="mx-auto font-bold text-xl">
          {title}
        </span>
      )}
    </div>
  );
};
