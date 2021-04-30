import { ScheduledRoom } from "@dogehouse/kebab";
import router, { useRouter } from "next/router";
import { validate } from "uuid";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { InfoText } from "../../ui/InfoText";
import { MainLayout } from "../layouts/MainLayout";
import { MiddlePanel } from "../layouts/GridPanels";
import { EditScheduleRoomModalController } from "../scheduled-rooms/EditScheduleRoomModalController";
import { ScheduledRoomCard } from "../scheduled-rooms/ScheduledRoomCard";
import { HeaderController } from "../display/HeaderController";
import { PageHeader } from "../../ui/mobile/MobileHeader";

interface ViewScheduledRoomPageProps {}

type GetScheduledRoomById = { room: ScheduledRoom | null };

export const ViewScheduledRoomPage: React.FC<ViewScheduledRoomPageProps> = ({}) => {
  const queryClient = useQueryClient();
  const [deleted, setDeleted] = useState(false);
  const { query } = useRouter();
  const id = typeof query.id === "string" ? query.id : "";
  const key = `/scheduled-room/${id}`;
  const { data, isLoading } = useQuery<
    GetScheduledRoomById | { error: string }
  >(key, { enabled: validate(id) });

  if (!data || isLoading) {
    return null;
  }

  if ("error" in data || !data.room) {
    return (
      <MainLayout>
        <InfoText>could not find room</InfoText>
      </MainLayout>
    );
  }

  return (
    <MainLayout mobileHeader={<PageHeader title="Scheduled Room" onBackClick={() => router.push('/dash')}/>}>
      <HeaderController title={data.room.name} embed={{}} />
      <MiddlePanel>
        {deleted ? (
          <InfoText>deleted</InfoText>
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
      </MiddlePanel>
    </MainLayout>
  );
};
