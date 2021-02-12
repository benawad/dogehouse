import React from "react";
import ReactModal from "react-modal";
import { tw } from "twind";
import { wsend } from "../../createWebsocket";
import { Codicon } from "../svgs/Codicon";
import { CurrentRoom, User } from "../types";
import { Button } from "./Button";
import { UserProfile } from "./UserProfile";

interface ProfileModalProps {
  onClose: () => void;
  profile: User | null | undefined;
  isMe: boolean;
  iAmCreator: boolean;
  iAmMod: boolean;
  room: CurrentRoom;
}

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0,0,0,.5)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "var(--vscode-dropdown-border)",
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
  return (
    <ReactModal
      isOpen={!!profile}
      contentLabel="profile"
      style={customStyles}
      onRequestClose={() => onClose()}
    >
      {profile ? (
        <>
          <div className={tw`mb-4 flex`}>
            <button
              onClick={() => {
                onClose();
              }}
              className={tw`p-2 -ml-2`}
            >
              <Codicon width={24} height={24} name="close" />
            </button>
            {iAmCreator && !isMe ? (
              <div
                style={{
                  marginLeft: "auto",
                }}
              >
                <Button
                  variant="small"
                  onClick={() => {
                    const y = window.confirm(
                      "Are you sure you want to block this user from joining any room you ever create?"
                    );
                    if (y) {
                      onClose();
                      wsend({
                        op: "block_user_and_from_room",
                        d: {
                          userId: profile.id,
                        },
                      });
                    }
                  }}
                >
                  block user
                </Button>
              </div>
            ) : null}
          </div>
          <UserProfile profile={profile} />
          {!isMe && iAmCreator ? (
            <>
              <div className={tw`mb-4`}>
                <Button
                  onClick={() => {
                    onClose();
                    wsend({
                      op: "change_mod_status",
                      d: {
                        userId: profile.id,
                        value: !(profile.modForRoomId === room.id),
                      },
                    });
                  }}
                >
                  {profile.modForRoomId === room.id ? "unmod" : "make mod"}
                </Button>
              </div>
            </>
          ) : null}
          {!isMe && (iAmCreator || iAmMod) && profile.id !== room.creatorId ? (
            <>
              {profile.canSpeakForRoomId !== room.id &&
              profile.id in room.raiseHandMap ? (
                <div className={tw`mb-4`}>
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
              {profile.canSpeakForRoomId === room.id ? (
                <div className={tw`mb-4`}>
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
          {isMe && !iAmCreator && profile.canSpeakForRoomId === room.id ? (
            <div className={tw`mb-4`}>
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
