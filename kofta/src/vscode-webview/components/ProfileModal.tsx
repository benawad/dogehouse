import React from "react";
import ReactModal from "react-modal";
import { wsend } from "../../createWebsocket";
import { useRoomChatStore } from "../modules/room-chat/useRoomChatStore";
import { Codicon } from "../svgs/Codicon";
import { CurrentRoom, RoomUser } from "../types";
import { Button } from "./Button";
import { modalConfirm } from "./ConfirmModal";
import { UserProfile } from "./UserProfile";
import { UserVolumeSlider } from "./UserVolumeSlider";

interface ProfileModalProps {
  onClose: () => void;
  profile: RoomUser | null | undefined;
  isMe: boolean;
  iAmCreator: boolean;
  iAmMod: boolean;
  room: CurrentRoom;
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
}) => {
  const bannedUserIdMap = useRoomChatStore((s) => s.bannedUserIdMap);
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
                      "Are you sure you want to block this user from joining any room you ever create?",
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
                  block user
                </Button>
              </div>
            ) : null}
          </div>
          <UserProfile profile={profile} />
          {!isMe && profile.roomPermissions?.isSpeaker ? (
            <div className={`mb-4`}>
              <UserVolumeSlider userId={profile.id} />
            </div>
          ) : null}
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
                  {profile.roomPermissions?.isMod ? "unmod" : "make mod"}
                </Button>
              </div>
            </>
          ) : null}
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
                    add as speaker
                  </Button>
                </div>
              ) : null}
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
                    move to listener
                  </Button>
                </div>
              ) : null}
              {!(profile.id in bannedUserIdMap) ? (
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
                    ban from chat
                  </Button>
                </div>
              ) : null}
              <div>
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
                  ban from room
                </Button>
              </div>
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
                go back to listener
              </Button>
            </div>
          ) : null}
        </>
      ) : null}
    </ReactModal>
  );
};
