import React from "react";

interface TagProps {
  glow?: boolean;
}

// @todo the tag doesn't really glow like in figma right now
export const Tag: React.FC<TagProps> = ({ children, glow }) => {
  return (
    <div
<<<<<<< HEAD
      className={`cursor-pointer bg-primary-700 hover:bg-primary-600 text-xs px-2 font-bold text-primary-100 justify-center items-center rounded`}
      style={{ height: "22px", boxShadow: "0px 0px 7px rgba(253, 77, 77, 0.3)", borderColor: "#FD4D4D", borderStyle: "solid", borderWidth: 0.2 }}
=======
      className={`cursor-pointer bg-primary-700 hover:bg-primary-600 text-xs px-2 font-bold text-primary-100 justify-center items-center rounded ${
        glow ? `border` : ``
      }`}
      style={{
        height: "22px",
        boxShadow: glow ? "0px 0px 7px var(--color-accent-glow)" : "",
        border: glow ? ".5px solid var(--color-accent)" : "",
      }}
>>>>>>> efa67978626deb01f424f619ef8abad23e897cdd
    >
      {children}
    </div>
  );
};
