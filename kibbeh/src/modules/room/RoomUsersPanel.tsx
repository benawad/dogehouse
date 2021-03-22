import { JoinRoomAndGetInfoResponse, Room } from "@dogehouse/kebab";
import React from "react";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { RoomAvatar } from "../../ui/RoomAvatar";
import { RoomSectionHeader } from "../../ui/RoomSectionHeader";
import { UserPreviewModalProvider } from "./UserPreviewModalProvider";
import { useSplitUsersIntoSections } from "./useSplitUsersIntoSections";

interface RoomUsersPanelProps extends JoinRoomAndGetInfoResponse {}

export const RoomUsersPanel: React.FC<RoomUsersPanelProps> = (props) => {
  const { askingToSpeak, listeners, speakers } = useSplitUsersIntoSections(
    props
  );
  const { t } = useTypeSafeTranslation();
  return (
    <div className={`p-4 bg-primary-800`}>
      <div
        style={{
          gridTemplateColumns: "repeat(auto-fit, 90px)",
        }}
        className={`w-full grid gap-5 mb-24`}
      >
        <RoomSectionHeader
          title={t("pages.room.speakers")}
          tagText={"" + speakers.length}
        />
        {speakers}
        {askingToSpeak.length ? (
          <RoomSectionHeader
            title={t("pages.room.requestingToSpeak")}
            tagText={"" + askingToSpeak.length}
          />
        ) : null}
        {askingToSpeak}
        {listeners.length ? (
          <RoomSectionHeader
            title={t("pages.room.listeners")}
            tagText={"" + listeners.length}
          />
        ) : null}
        {listeners}
      </div>
    </div>
  );
};
