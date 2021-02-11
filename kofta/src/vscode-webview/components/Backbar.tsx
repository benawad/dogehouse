import React from "react";
import { useHistory } from "react-router-dom";
import { tw } from "twind";
import DogeHouse from "../../assets/dogehouse.png";

interface BackbarProps {}

export const Backbar: React.FC<BackbarProps> = ({ children }) => {
  const history = useHistory();
  return (
    <div className={tw`flex py-2 mb-6`}>
      <button
        className={tw`hover:bg-buttonHover`}
        onClick={() => {
          history.push("/");
        }}
      >
        <img style={{ width: 50 }} src={DogeHouse} alt="dogehouse" />
      </button>
      {children}
    </div>
  );
};
