import { Router } from "next/router";
import * as React from "react";
import create from "zustand";
import { combine } from "zustand/middleware";
import { useSoundEffectStore } from "../modules/sound-effects/useSoundEffectStore";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { Button } from "../ui/Button";
import { ButtonLink } from "../ui/ButtonLink";
import { Modal } from "../ui/Modal";
import { SingleUser } from "../ui/UserAvatar";

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
  push: Router["push"]
) => {
  useSoundEffectStore.getState().playSoundEffect("roomInvite");
  useConfirmModalStore.getState().set({
    options: {
      ...options,
      onConfirm: () => {
        push(`/room/[id]`, `/room/${options.roomId}`);
      },
    },
  });
};

export const InvitedToJoinRoomModal: React.FC<Props> = () => {
  const { options, close } = useConfirmModalStore();
  const { t } = useTypeSafeTranslation();
  return (
    <Modal isOpen={!!options} onRequestClose={() => close()}>
      <div className="flex flex-col">
        {options ? (
          <div className="flex flex-col text-primary-100">
            <h1 className={`text-2xl mb-2`}>
              {options.type === "someone_you_follow_created_a_room"
                ? t("components.modals.invitedToJoinRoomModal.newRoomCreated")
                : t("components.modals.invitedToJoinRoomModal.roomInviteFrom")}
            </h1>
            <div className={`flex items-center`}>
              <SingleUser size="md" src={options.avatarUrl} />
              <div className={`flex ml-2 flex-col`}>
                <div className={`flex font-bold`}>{options.displayName}</div>
                <div className={`flex my-1 flex`}>
                  <div className="flex">@{options.username}</div>
                </div>
              </div>
            </div>
            <div className={`mt-4`}>
              {options.type === "someone_you_follow_created_a_room"
                ? t("components.modals.invitedToJoinRoomModal.justStarted")
                : t(
                    "components.modals.invitedToJoinRoomModal.inviteReceived"
                  )}{" "}
              <span className={`font-semibold ml-1`}>{options.roomName}</span>
              {t("components.modals.invitedToJoinRoomModal.likeToJoin")}
            </div>
          </div>
        ) : null}
        <div className={`flex mt-4 items-center`}>
          <Button
            onClick={() => {
              close();
              options?.onConfirm();
            }}
            type="submit"
          >
            {t("common.yes")}
          </Button>
          <ButtonLink
            type="button"
            onClick={close}
            className={`ml-4`}
            color="secondary"
          >
            {t("common.cancel")}
          </ButtonLink>
        </div>
      </div>
    </Modal>
  );
};
