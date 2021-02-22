import React from "react";
import { useHistory } from "react-router-dom";
import { tw } from "twind";
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
    <div className={tw`sticky top-0 z-10 flex py-4 mb-12 border-b border-gray-500 bg-gray-800`}>
      {actuallyGoBack ? (
        <button
          className={tw`hover:bg-blue-700 px-2`}
          onClick={() => {
            history.goBack();
          }}
        >
          <ArrowLeft color="#fff" size={30} />
        </button>
      ) : (
        <button
          className={tw`hover:bg-blue-700 px-2`}
          onClick={() => {
            history.push("/");
          }}
        >
          <img className={tw`w-12`} src={DogeHouse} alt="dogehouse" />
        </button>
      )}
      {children}
    </div>
  );
};
