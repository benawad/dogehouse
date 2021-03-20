// React
import React, { ReactElement } from "react";

export interface BoxedIconProps {
  classes?: string;
  children?: ReactElement;
  iscircular?: boolean;
}

export const BoxedIcon: React.FC<BoxedIconProps> = ({
  children,
  classes = "",
  iscircular = false,
}) => {
  return (
    <div>
      {iscircular ? (
        <div
          className={`bg-primary-700 hover:bg-primary-600 h-6 w-6 cursor-pointer text-primary-100 justify-center items-center rounded-full
        ${classes}`}
          data-testid="boxed-icon"
        >
          {children}
        </div>
      ) : (
        <div
          className={`bg-primary-700 hover:bg-primary-600 h-6 w-6 cursor-pointer text-primary-100 justify-center items-center rounded
        ${classes}`}
          data-testid="boxed-icon"
        >
          {children}
        </div>
      )}
    </div>
  );
};
