import React from "react";
import { useHistory } from "react-router-dom";
import { tw } from "twind";
import DogeHouse from "../../assets/dogehouse.png";
import { ArrowLeft } from "react-feather";
import { useRoomChatStore } from "../modules/room-chat/useRoomChatStore";

interface BackbarProps {
  actuallyGoBack?: boolean;
}

export const Backbar: React.FC<BackbarProps> = ({
  children,
  actuallyGoBack,
}) => {
  const history = useHistory();
  const [open, toggleOpen] = useRoomChatStore((s) => [s.open, s.toggleOpen]);
  return (
    <div
      style={{
        backgroundColor: "#262626",
        borderBottom: "1px solid #808080",
      }}
      className={tw`flex py-4 mb-12`}
    >
      {actuallyGoBack ? (
        <button
          style={{ padding: "0 9px" }}
          className={tw`hover:bg-buttonHover`}
          onClick={() => {
            if (open) toggleOpen();
            history.goBack();
          }}
        >
          <ArrowLeft color="#fff" size={30} />
        </button>
      ) : (
        <button
          style={{ padding: "0 9px" }}
          className={tw`hover:bg-buttonHover`}
          onClick={() => {
            if (open) toggleOpen();
            history.push("/");
          }}
        >
          <img style={{ width: 50 }} src={DogeHouse} alt="dogehouse" />
        </button>
      )}
      {children}
    </div>
  );
};
