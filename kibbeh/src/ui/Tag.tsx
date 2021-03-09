import React from "react";

interface TagProps {}

export const Tag: React.FC<TagProps> = ({
  children,
}) => {
  return (
    <div
      className={`bg-primary-600 select-none text-xs px-1 font-bold text-primary-100 justify-center items-center rounded`}
      style={{ height: "22px" }}
    >
      {typeof children === 'string' ? `#` + children : children}
    </div>
  );
};
