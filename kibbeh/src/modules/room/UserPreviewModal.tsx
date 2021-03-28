import { JoinRoomAndGetInfoResponse, RoomUser } from "@dogehouse/kebab";
import React, { useContext } from "react";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { Modal } from "../../ui/Modal";
import { Spinner } from "../../ui/Spinner";
import { VerticalUserInfoWithFollowButton } from "../user/VerticalUserInfoWithFollowButton";
import { UserPreviewModalContext } from "./UserPreviewModalProvider";
import { VolumeSliderController } from "./VolumeSliderController";

const UserPreview: React.FC<{
  id: string;
  roomPermissions?: RoomUser["roomPermissions"];
}> = ({ id, roomPermissions }) => {
  const { data, isLoading } = useTypeSafeQuery(["getUserProfile", id], {}, [
    id,
  ]);

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

  return (
    <div className={`flex-col w-full`}>
      <div className={`bg-primary-900 flex-col`}>
        <VerticalUserInfoWithFollowButton
          idOrUsernameUsedForQuery={data.id}
          user={data}
        />
      </div>
      <div className={`bg-primary-800`}>
        <VolumeSliderController userId={id} />
      </div>
    </div>
  );
};

export const UserPreviewModal: React.FC<JoinRoomAndGetInfoResponse> = ({}) => {
  const { setUserId, userId } = useContext(UserPreviewModalContext);
  return (
    <Modal
      variant="userPreview"
      onRequestClose={() => setUserId(null)}
      isOpen={!!userId}
    >
      {!userId ? null : <UserPreview id={userId} />}
    </Modal>
  );
};
