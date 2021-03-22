import { JoinRoomAndGetInfoResponse } from "@dogehouse/kebab";
import React, { useContext } from "react";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { Button } from "../../ui/Button";
import { Modal } from "../../ui/Modal";
import { Spinner } from "../../ui/Spinner";
import { VerticalUserInfo } from "../../ui/VerticalUserInfo";
import { UserPreviewModalContext } from "./UserPreviewModalProvider";

const UserPreview: React.FC<{ id: string }> = ({ id }) => {
  const { t } = useTypeSafeTranslation();
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
        <VerticalUserInfo user={data} />
        <div className={`mb-2`}>
          <Button size="small">{t("pages.viewUser.followHim")}</Button>
        </div>
      </div>
      <div className={`bg-primary-800`}>hey</div>
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
