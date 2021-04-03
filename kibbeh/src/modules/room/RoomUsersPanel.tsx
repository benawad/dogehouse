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
    <div
      className={`pt-4 px-4 flex-1 bg-primary-800 scrollbar-thin scrollbar-thumb-primary-700`}
    >
      <div
        style={{
          gridTemplateColumns: "repeat(auto-fit, 90px)",
        }}
        className={`w-full grid gap-5`}
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
        <div className={`h-3 w-full col-span-5`}></div>
      </div>
    </div>
  );
};
