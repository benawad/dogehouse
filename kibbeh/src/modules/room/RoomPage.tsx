import { useRouter } from "next/router";
import React from "react";
import { Button } from "../../ui/Button";
import { MainGrid } from "../../ui/MainGrid";
import { HeaderController } from "../header/HeaderController";
import { DesktopLayout } from "../layouts/DesktopLayout";

interface RoomPageProps {}

export const RoomPage: React.FC<RoomPageProps> = ({}) => {
  const { push } = useRouter();
  return (
    <DesktopLayout>
      <div />
      <div>hi</div>
      <div />
    </DesktopLayout>
  );
};
