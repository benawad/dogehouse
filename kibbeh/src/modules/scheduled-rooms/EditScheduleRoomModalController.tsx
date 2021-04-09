import { ScheduledRoom } from "@dogehouse/kebab";
import React, { useState } from "react";
import {
  CreateScheduleRoomModal,
  ScheduleRoomFormData,
} from "./CreateScheduledRoomModal";

type State = {
  scheduleRoomToEdit: ScheduledRoom;
  cursor: string;
};

interface EditScheduleRoomModalControllerProps {
  onScheduledRoom: (
    editInfo: State,
    data: ScheduleRoomFormData,
    resp: any
  ) => void;
  children: (x: { onEdit: (y: State) => void }) => React.ReactNode;
}

export const EditScheduleRoomModalController: React.FC<EditScheduleRoomModalControllerProps> = ({
  onScheduledRoom,
  children,
}) => {
  const [editInfo, setScheduleRoomToEdit] = useState<State | null>(null);

  return (
    <>
      {editInfo ? (
        <CreateScheduleRoomModal
          editInfo={{
            id: editInfo.scheduleRoomToEdit.id,
            intialValues: {
              cohosts: [],
              description: editInfo.scheduleRoomToEdit.description,
              name: editInfo.scheduleRoomToEdit.name,
              scheduledFor: new Date(editInfo.scheduleRoomToEdit.scheduledFor),
            },
          }}
          onScheduledRoom={(...vals) => onScheduledRoom(editInfo, ...vals)}
          onRequestClose={() => setScheduleRoomToEdit(null)}
        />
      ) : null}
      {children({ onEdit: setScheduleRoomToEdit })}
    </>
  );
};
