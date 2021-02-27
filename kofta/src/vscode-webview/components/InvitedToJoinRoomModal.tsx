import * as React from "react";
import { Modal } from "./Modal";
import create from "zustand";
import { combine } from "zustand/middleware";
import { Button } from "./Button";
import { Avatar } from "./Avatar";

interface Props {}

type Fn = () => void;

export type UserPreviewInfo = {
  username: string;
  displayName: string;
  avatarUrl: string;
};

const useConfirmModalStore = create(
  combine(
    {
      options: null as null | {
        roomName: string;
        userInfo: UserPreviewInfo;
        onConfirm: Fn;
      },
    },
    (set) => ({
      close: () => set({ options: null }),
      set,
    })
  )
);

export const invitedToRoomConfirm = (
  roomName: string,
  userInfo: UserPreviewInfo,
  onConfirm: Fn
) => {
  useConfirmModalStore
    .getState()
    .set({ options: { onConfirm, userInfo, roomName } });
};

export const InvitedToJoinRoomModal: React.FC<Props> = () => {
  const { options, close } = useConfirmModalStore();
  return (
    <Modal isOpen={!!options} onRequestClose={() => close()}>
      {options ? (
        <>
          <h1 className={`text-2xl mb-2`}>Room Invite from</h1>
          <div className={`flex items-center`}>
            <Avatar src={options.userInfo.avatarUrl} />
            <div className={`ml-2`}>
              <div className={`font-semibold`}>
                {options.userInfo.displayName}
              </div>
              <div className={`my-1 flex`}>
                <div>@{options.userInfo.username}</div>
              </div>
            </div>
          </div>
          <div className={`mt-4`}>
            you've been invited to{" "}
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
