import React from "react";
import { useHistory } from "react-router-dom";
import { tw } from "twind";
import { Codicon } from "../svgs/Codicon";

interface BackbarProps {
  to?: string;
  onBack?: () => void;
}

export const Backbar: React.FC<BackbarProps> = ({ onBack, to, children }) => {
  const history = useHistory();
  return (
    <div className={tw`flex py-2 mb-6`}>
      {children ? (
        children
      ) : (
        <button
          className={tw`hover:bg-buttonHover p-2`}
          onClick={() => {
            onBack?.();
            if (to) {
              history.push(to);
            } else {
              history.goBack();
            }
          }}
        >
          <Codicon name="arrowLeft" />
        </button>
      )}
    </div>
  );
};
