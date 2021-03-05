import React, { useState } from "react";
import { ScheduledRoom } from "../../types";
import { ScheduleRoomFormData, ScheduleRoomModal } from "./ScheduleRoomModal";

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
				<ScheduleRoomModal
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
