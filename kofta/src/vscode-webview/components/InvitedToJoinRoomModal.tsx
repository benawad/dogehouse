import * as React from "react";
import { History } from "history";
import { Modal } from "./Modal";
import create from "zustand";
import { combine } from "zustand/middleware";
import { Button } from "./Button";
import { Avatar } from "./Avatar";
import { useSoundEffectStore } from "../modules/sound-effects/useSoundEffectStore";
import { wsend } from "../../createWebsocket";

interface Props {}

type Fn = () => void;

export type JoinRoomModalType = "invite" | "someone_you_follow_created_a_room";

export type UserPreviewInfo = {
  username: string;
  displayName: string;
  avatarUrl: string;
};

type Options = {
  type: JoinRoomModalType;
  roomId: string;
  roomName: string;
  onConfirm: Fn;
} & UserPreviewInfo;

const useConfirmModalStore = create(
  combine(
    {
      options: null as null | Options,
    },
    (set) => ({
      close: () => set({ options: null }),
      set,
    })
  )
);

export const invitedToRoomConfirm = (
  options: Omit<Options, "onConfirm">,
  history: History
) => {
  useSoundEffectStore.getState().playSoundEffect("roomInvite");
  useConfirmModalStore.getState().set({
    options: {
      ...options,
      onConfirm: () => {
        wsend({ op: "join_room", d: { roomId: options.roomId } });
        history.push("/room/" + options.roomId);
      },
    },
  });
};

export const InvitedToJoinRoomModal: React.FC<Props> = () => {
  const { options, close } = useConfirmModalStore();
  return (
    <Modal isOpen={!!options} onRequestClose={() => close()}>
      {options ? (
        <>
          <h1 className={`text-2xl mb-2`}>
            {options.type === "someone_you_follow_created_a_room"
              ? `New Room Created`
              : `Room Invite from`}
          </h1>
          <div className={`flex items-center`}>
            <Avatar src={options.avatarUrl} />
            <div className={`ml-2`}>
              <div className={`font-semibold`}>{options.displayName}</div>
              <div className={`my-1 flex`}>
                <div>@{options.username}</div>
              </div>
            </div>
          </div>
          <div className={`mt-4`}>
            {options.type === "someone_you_follow_created_a_room"
              ? `They just started`
              : `you've been invited to`}{" "}
            <span className={`font-semibold`}>{options.roomName}</span>, would
            you like to join?
          </div>
        </>
      ) : null}
      <div className={`flex mt-8`}>
        <Button
          type="button"
          onClick={close}
          className={`mr-1.5`}
          color="secondary"
        >
          cancel
        </Button>
        <Button
          onClick={() => {
            close();
            options?.onConfirm();
          }}
          type="submit"
          className={`ml-1.5`}
        >
          yes
        </Button>
      </div>
    </Modal>
  );
};
