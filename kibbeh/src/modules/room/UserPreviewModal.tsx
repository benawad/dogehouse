import { JoinRoomAndGetInfoResponse, RoomUser } from "@dogehouse/kebab";
import React, { useContext } from "react";
import { useConn } from "../../shared-hooks/useConn";
import { useCurrentRoomInfo } from "../../shared-hooks/useCurrentRoomInfo";
import { useTypeSafeMutation } from "../../shared-hooks/useTypeSafeMutation";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { Button } from "../../ui/Button";
import { Modal } from "../../ui/Modal";
import { Spinner } from "../../ui/Spinner";
import { VerticalUserInfoWithFollowButton } from "../user/VerticalUserInfoWithFollowButton";
import { RoomChatMessage, useRoomChatStore } from "./chat/useRoomChatStore";
import { UserPreviewModalContext } from "./UserPreviewModalProvider";
import { VolumeSliderController } from "./VolumeSliderController";

const UserPreview: React.FC<{
  message?: RoomChatMessage;
  id: string;
  isMe: boolean;
  iAmCreator: boolean;
  iAmMod: boolean;
  isCreator: boolean;
  roomPermissions?: RoomUser["roomPermissions"];
  onClose: () => void;
}> = ({
  id,
  isCreator,
  isMe,
  iAmCreator,
  iAmMod,
  message,
  roomPermissions,
  onClose,
}) => {
  const { t } = useTypeSafeTranslation();
  const { mutateAsync: setListener } = useTypeSafeMutation("setListener");
  const { mutateAsync: changeModStatus } = useTypeSafeMutation(
    "changeModStatus"
  );
  const { mutateAsync: changeRoomCreator } = useTypeSafeMutation(
    "changeRoomCreator"
  );
  const { mutateAsync: addSpeaker } = useTypeSafeMutation("addSpeaker");
  const { mutateAsync: deleteRoomChatMessage } = useTypeSafeMutation(
    "deleteRoomChatMessage"
  );
  const { mutateAsync: blockFromRoom } = useTypeSafeMutation("blockFromRoom");
  const { mutateAsync: banFromRoomChat } = useTypeSafeMutation(
    "banFromRoomChat"
  );
  const { data, isLoading } = useTypeSafeQuery(["getUserProfile", id], {}, [
    id,
  ]);
  const bannedUserIdMap = useRoomChatStore((s) => s.bannedUserIdMap);

  if (isLoading) {
    return (
      <div
        style={{ height: "400px", maxHeight: "100%" }}
        className={`items-center justify-center w-full`}
      >
        <Spinner />
      </div>
    );
  }

  if (!data) {
    return <div className={`text-primary-100`}>This user is gone.</div>;
  }

  // @todo pretty sure this is some what bugged
  // will add it back when 100% works
  // const setNewCreatorButton = (
  //   <Button
  //     onClick={() => {
  //       onClose();
  //       changeRoomCreator([id]);
  //     }}
  //   >
  //     {t("components.modals.profileModal.makeRoomCreator")}
  //   </Button>
  // );

  const canDoModStuffOnThisUser = !isMe && (iAmCreator || iAmMod) && !isCreator;

  // [shouldShow, key, onClick, text]
  const buttonData = [
    [
      !isMe && iAmCreator,
      "makeMod",
      () => {
        onClose();
        changeModStatus([id, !roomPermissions?.isMod]);
      },
      roomPermissions?.isMod
        ? t("components.modals.profileModal.unmod")
        : t("components.modals.profileModal.makeMod"),
    ],
    [
      canDoModStuffOnThisUser &&
        !roomPermissions?.isSpeaker &&
        roomPermissions?.askedToSpeak,
      "addSpeakerButton",
      () => {
        onClose();
        addSpeaker([id]);
      },
      t("components.modals.profileModal.addAsSpeaker"),
    ],
    [
      canDoModStuffOnThisUser && roomPermissions?.isSpeaker,
      "moveToListenerButton",
      () => {
        onClose();
        setListener([id]);
      },
      t("components.modals.profileModal.moveToListener"),
    ],
    [
      canDoModStuffOnThisUser &&
        !(id in bannedUserIdMap) &&
        (iAmCreator || !roomPermissions?.isMod),
      "banFromChat",
      () => {
        onClose();
        banFromRoomChat([id]);
      },
      t("components.modals.profileModal.banFromChat"),
    ],
    [
      canDoModStuffOnThisUser && (iAmCreator || !roomPermissions?.isMod),
      "blockFromRoom",
      () => {
        onClose();
        blockFromRoom([id]);
      },
      t("components.modals.profileModal.banFromRoom"),
    ],
    [
      isMe &&
        !iAmCreator &&
        (roomPermissions?.askedToSpeak || roomPermissions?.isSpeaker),
      "goBackToListener",
      () => {
        onClose();
        setListener([id]);
      },
      t("components.modals.profileModal.goBackToListener"),
    ],
    [
      !!message,
      "deleteMessage",
      () => {
        if (message?.id) {
          deleteRoomChatMessage([message.userId, message.id]);

          onClose();
        }
      },
      t("components.modals.profileModal.deleteMessage"),
    ],
  ] as const;

  return (
    <div className={`flex-col w-full`}>
      <div className={`bg-primary-900 flex-col`}>
        <VerticalUserInfoWithFollowButton
          idOrUsernameUsedForQuery={data.id}
          user={data}
        />
      </div>
      {!isMe && (isCreator || roomPermissions?.isSpeaker) ? (
        <div className={`bg-primary-800`}>
          <VolumeSliderController userId={id} />
        </div>
      ) : null}
      <div className="mt-1 flex-col">
        {buttonData.map(([shouldShow, key, onClick, text]) => {
          return shouldShow ? (
            <Button
              color="secondary"
              className={`mb-3`}
              key={key}
              onClick={onClick}
            >
              {text}
            </Button>
          ) : null;
        })}
      </div>
    </div>
  );
};

export const UserPreviewModal: React.FC<JoinRoomAndGetInfoResponse> = ({
  room,
  users,
}) => {
  const { isCreator: iAmCreator, isMod } = useCurrentRoomInfo();
  const { data, setData } = useContext(UserPreviewModalContext);
  const conn = useConn();
  return (
    <Modal
      variant="userPreview"
      onRequestClose={() => setData(null)}
      isOpen={!!data}
    >
      {!data ? null : (
        <UserPreview
          id={data.userId}
          isCreator={room.creatorId === data.userId}
          roomPermissions={
            users.find((u) => u.id === data.userId)?.roomPermissions
          }
          iAmCreator={iAmCreator}
          isMe={conn.user.id === data.userId}
          iAmMod={isMod}
          message={data.message}
          onClose={() => setData(null)}
        />
      )}
    </Modal>
  );
};
