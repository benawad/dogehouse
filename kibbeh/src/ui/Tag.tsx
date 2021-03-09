import React from "react";

interface TagProps { }

export const Tag: React.FC<TagProps> = ({
  children,
}) => {
  return (
    <div
      className={`bg-gray-700 hover:bg-gray-600 text-xs px-2 font-bold text-primary-100 justify-center items-center rounded`}
      style={{ height: "22px" }}
    >
      {children}
    </div>
  );
};
