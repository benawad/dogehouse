import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { BodyWrapper } from "../../components/BodyWrapper";
import { Wrapper } from "../../components/Wrapper";
import { NotFoundPage } from "../../pages/NotFoundPage";
import { Logo } from "../../svgs/Logo";
import { ScheduledRoom } from "../../types";
import { EditScheduleRoomModalController } from "./EditScheduleRoomModalController";
import { ScheduledRoomCard } from "./ScheduledRoomCard";

interface ViewScheduledRoomPageProps {}

type GetScheduledRoomById = { room: ScheduledRoom | null };

export const ViewScheduledRoomPage: React.FC<ViewScheduledRoomPageProps> = ({}) => {
	const queryClient = useQueryClient();
	const [deleted, setDeleted] = useState(false);
	const { id } = useParams<{ id: string }>();
	const key = `/scheduled-room/${id}`;
	const { data, isLoading } = useQuery<
		GetScheduledRoomById | { error: string }
	>(key);

	if (isLoading) {
		return null;
	}

	if (!data || "error" in data || !data.room) {
		return <NotFoundPage />;
	}

	return (
		<div className={`flex flex-col flex-1`}>
			<Wrapper>
				<BodyWrapper>
					<div className={`mb-10 mt-8`}>
						<Link to="/">
							<Logo />
						</Link>
					</div>
				</BodyWrapper>
				{deleted ? (
					<div>deleted</div>
				) : (
					<EditScheduleRoomModalController
						onScheduledRoom={(_editInfo, values, _resp) => {
							queryClient.setQueryData<GetScheduledRoomById>(key, {
								room: {
									...data.room!,
									name: values.name,
									description: values.description,
									scheduledFor: values.scheduledFor.toISOString(),
								},
							});
						}}
					>
						{({ onEdit }) => (
							<ScheduledRoomCard
								info={data.room!}
								onDeleteComplete={() => setDeleted(true)}
								noCopyLinkButton
								onEdit={() =>
									onEdit({ scheduleRoomToEdit: data.room!, cursor: "" })
								}
							/>
						)}
					</EditScheduleRoomModalController>
				)}
			</Wrapper>
		</div>
	);
};
