import React from "react";

interface TagProps {}

export const Tag: React.FC<TagProps> = ({...props}) => {
  return (
    <span className={"py-1 px-3 bg-gray-700 rounded-md text-white font-bold"}>
      {props.children}
    </span>
  );
};
