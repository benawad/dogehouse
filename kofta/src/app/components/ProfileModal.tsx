import React from "react";
import ReactModal from "react-modal";
import { wsend } from "../../createWebsocket";
import {
  RoomChatMessage,
  useRoomChatStore,
} from "../modules/room-chat/useRoomChatStore";
import { Codicon } from "../svgs/Codicon";
import { CurrentRoom, RoomUser } from "../types";
import { Button } from "./Button";
import { modalConfirm } from "./ConfirmModal";
import { UserProfile } from "./UserProfile";
import { UserVolumeSlider } from "./UserVolumeSlider";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";

interface ProfileModalProps {
  onClose: () => void;
  profile: RoomUser | null | undefined;
  isMe: boolean;
  iAmCreator: boolean;
  iAmMod: boolean;
  room: CurrentRoom;
  messageToBeDeleted?: RoomChatMessage | null;
}

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0,0,0,.5)",
    zIndex: 999,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#3c3c3c",
    border: "none",
    width: "100%",
    maxWidth: 500,
  },
};

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  onClose,
  isMe,
  iAmCreator,
  iAmMod,
  room,
  messageToBeDeleted,
}) => {
  const bannedUserIdMap = useRoomChatStore((s) => s.bannedUserIdMap);
  const { t } = useTypeSafeTranslation();
  return (
    <ReactModal
      isOpen={!!profile}
      contentLabel="profile"
      style={customStyles}
      onRequestClose={() => onClose()}
    >
      {profile ? (
        <>
          <div className={`mb-4 flex`}>
            <button
              onClick={() => {
                onClose();
              }}
              className={`p-2 -ml-2`}
            >
              <Codicon width={24} height={24} name="close" />
            </button>
            {iAmCreator && !isMe ? (
              <div className={`ml-auto`}>
                <Button
                  variant="small"
                  onClick={() => {
                    modalConfirm(
                      t("components.modals.profileModal.blockUserConfirm"),
                      () => {
                        onClose();
                        wsend({
                          op: "block_user_and_from_room",
                          d: {
                            userId: profile.id,
                          },
                        });
                      }
                    );
                  }}
                >
                  {t("components.modals.profileModal.blockUser")}
                </Button>
              </div>
            ) : null}
          </div>

          {/* Profile */}
          <UserProfile profile={profile} />

          {/* User volume */}
          {!isMe && profile.roomPermissions?.isSpeaker ? (
            <div className={`mb-4`}>
              <UserVolumeSlider userId={profile.id} />
            </div>
          ) : null}

          {/* Make mod button */}
          {!isMe && iAmCreator ? (
            <>
              <div className={`mb-4`}>
                <Button
                  onClick={() => {
                    onClose();
                    wsend({
                      op: "change_mod_status",
                      d: {
                        userId: profile.id,
                        value: !profile.roomPermissions?.isMod,
                      },
                    });
                  }}
                >
                  {profile.roomPermissions?.isMod
                    ? t("components.modals.profileModal.unmod")
                    : t("components.modals.profileModal.makeMod")}
                </Button>
              </div>
            </>
          ) : null}

          {/* Set new creator */}
          {!isMe && iAmCreator && profile.roomPermissions?.isSpeaker ? (
            <div className="mb-4">
              <Button
                onClick={() => {
                  onClose();
                  wsend({
                    op: "change_room_creator",
                    d: {
                      userId: profile.id,
                    },
                  });
                }}
              >
                {t("components.modals.profileModal.makeRoomCreator")}
              </Button>
            </div>
          ) : null}

          {/* Add speaker button */}
          {!isMe && (iAmCreator || iAmMod) && profile.id !== room.creatorId ? (
            <>
              {!profile.roomPermissions?.isSpeaker &&
              profile.roomPermissions?.askedToSpeak ? (
                <div className={`mb-4`}>
                  <Button
                    onClick={() => {
                      onClose();
                      wsend({
                        op: "add_speaker",
                        d: {
                          userId: profile.id,
                        },
                      });
                    }}
                  >
                    {t("components.modals.profileModal.addAsSpeaker")}
                  </Button>
                </div>
              ) : null}

              {/* Set listener */}
              {profile.roomPermissions?.isSpeaker ? (
                <div className={`mb-4`}>
                  <Button
                    onClick={() => {
                      onClose();
                      wsend({
                        op: "set_listener",
                        d: {
                          userId: profile.id,
                        },
                      });
                    }}
                  >
                    {t("components.modals.profileModal.moveToListener")}
                  </Button>
                </div>
              ) : null}

              {/* Ban from chat */}
              {!(profile.id in bannedUserIdMap) &&
              (iAmCreator || !profile.roomPermissions?.isMod) ? (
                <div className={`mb-4`}>
                  <Button
                    onClick={() => {
                      onClose();
                      wsend({
                        op: "ban_from_room_chat",
                        d: {
                          userId: profile.id,
                        },
                      });
                    }}
                  >
                    {t("components.modals.profileModal.banFromChat")}
                  </Button>
                </div>
              ) : null}

              {/* Block from room */}
              {iAmCreator || !profile.roomPermissions?.isMod ? (
                <div className="mb-4">
                  <Button
                    onClick={() => {
                      onClose();
                      wsend({
                        op: "block_from_room",
                        d: {
                          userId: profile.id,
                        },
                      });
                    }}
                  >
                    {t("components.modals.profileModal.banFromRoom")}
                  </Button>
                </div>
              ) : null}
            </>
          ) : null}

          {isMe &&
          !iAmCreator &&
          (profile.roomPermissions?.askedToSpeak ||
            profile.roomPermissions?.isSpeaker) ? (
            <div className={`mb-4`}>
              <Button
                onClick={() => {
                  onClose();
                  wsend({
                    op: "set_listener",
                    d: {
                      userId: profile.id,
                    },
                  });
                }}
              >
                {t("components.modals.profileModal.goBackToListener")}
              </Button>
            </div>
          ) : null}

          {/* Delete message */}
          {messageToBeDeleted ? (
            <Button
              color="red"
              onClick={() => {
                wsend({
                  op: "delete_room_chat_message",
                  d: {
                    messageId: messageToBeDeleted.id,
                    userId: messageToBeDeleted.userId,
                  },
                });

                !onClose || onClose();
              }}
            >
              {t("components.modals.profileModal.deleteMessage")}
            </Button>
          ) : null}
        </>
      ) : null}
    </ReactModal>
  );
};
