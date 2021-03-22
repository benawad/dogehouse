import { BaseUser } from "@dogehouse/kebab";
import React from "react";
import { Modal } from "./Modal";
import { VerticalUserInfo } from "./VerticalUserInfo";
import { VolumeSliderProps } from "./VolumeSlider";

interface UserPreviewModalProps {
  isOpen: boolean;
  onRequestClose(): void;
  user: BaseUser;
  theyFollowMe: boolean;
  iFollowThem: boolean | null; // pass in null if the user is you
  volumeProps?: VolumeSliderProps;
  onMoveToListener?: () => void;
  onKickFromRoom?: () => void;
  onBanFromChat?: () => void;
  onBanFromRoom?: () => void;
}

export const UserPreviewModal: React.FC<UserPreviewModalProps> = ({
  isOpen,
  onRequestClose,
  user,
}) => {
  return (
    <Modal onRequestClose={onRequestClose} isOpen={isOpen}>
      <VerticalUserInfo user={user} />
    </Modal>
  );
};
