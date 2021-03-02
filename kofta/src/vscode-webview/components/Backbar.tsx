import React from "react";
import { useHistory } from "react-router-dom";
import DogeHouse from "../../assets/dogehouse.png";
import { ArrowLeft } from "react-feather";

interface BackbarProps {
  actuallyGoBack?: boolean;
}

export const Backbar: React.FC<BackbarProps> = ({
  children,
  actuallyGoBack,
}) => {
  const history = useHistory();
  return (
    <div className={`sticky top-0 z-10 flex py-4 mb-12 border-b border-simple-gray-80 bg-simple-gray-26 h-20`}>
      {actuallyGoBack ? (
        <button
          className={`hover:bg-blue-700 px-2`}
          onClick={() => {
            history.goBack();
          }}
        >
          <ArrowLeft color="#fff" size={30} />
        </button>
      ) : (
        <button
          className={`hover:bg-blue-700 px-2`}
          onClick={() => {
            history.push("/");
          }}
        >
          <img className={`w-12`} src={DogeHouse} alt="dogehouse" />
        </button>
      )}
      {children}
    </div>
  );
};
