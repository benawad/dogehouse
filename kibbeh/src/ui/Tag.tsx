import React from "react";

interface TagProps {}

export const Tag: React.FC<TagProps> = ({ children }) => {
  return (
    <div
      className={`cursor-pointer bg-primary-700 hover:bg-primary-600 text-xs px-2 font-bold text-primary-100 justify-center items-center rounded`}
      style={{ height: "22px" }}
    >
      {children}
    </div>
  );
};
