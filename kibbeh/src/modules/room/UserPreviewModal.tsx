import { JoinRoomAndGetInfoResponse, RoomUser } from "@dogehouse/kebab";
import React, { useContext } from "react";
import { SolidFriends } from "../../icons";
import { useTypeSafeMutation } from "../../shared-hooks/useTypeSafeMutation";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { useTypeSafeUpdateQuery } from "../../shared-hooks/useTypeSafeUpdateQuery";
import { Button } from "../../ui/Button";
import { Modal } from "../../ui/Modal";
import { Spinner } from "../../ui/Spinner";
import { VerticalUserInfo } from "../../ui/VerticalUserInfo";
import { VolumeSlider } from "../../ui/VolumeSlider";
import { UserPreviewModalContext } from "./UserPreviewModalProvider";
import { VolumeSliderController } from "./VolumeSliderController";

const UserPreview: React.FC<{
  id: string;
  roomPermissions?: RoomUser["roomPermissions"];
}> = ({ id, roomPermissions }) => {
  const { t } = useTypeSafeTranslation();
  const { data, isLoading } = useTypeSafeQuery(["getUserProfile", id], {}, [
    id,
  ]);
  const updater = useTypeSafeUpdateQuery();
  const { mutateAsync, isLoading: followLoading } = useTypeSafeMutation(
    "follow"
  );

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
        <VerticalUserInfo user={data} />
        <div className={`mb-2 items-center w-full justify-center`}>
          {/* @todo add real icon */}
          <Button
            loading={followLoading}
            onClick={async () => {
              await mutateAsync([id, !data.youAreFollowing]);
              updater(["getUserProfile", id], (u) =>
                !u
                  ? u
                  : {
                      ...u,
                      numFollowers:
                        u.numFollowers + (data.youAreFollowing ? -1 : 1),
                      youAreFollowing: !data.youAreFollowing,
                    }
              );
            }}
            size="small"
            icon={<SolidFriends />}
          >
            {data.youAreFollowing
              ? t("pages.viewUser.unfollow")
              : t("pages.viewUser.followHim")}
          </Button>
        </div>
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
