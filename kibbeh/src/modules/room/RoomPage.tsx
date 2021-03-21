import { useRouter } from "next/router";
import React from "react";
import { Button } from "../../ui/Button";

interface RoomPageProps {}

export const RoomPage: React.FC<RoomPageProps> = ({}) => {
  const { push } = useRouter();
  return (
    <div>
      <Button onClick={() => push("/dashboard")}>go back to dashboard</Button>
    </div>
  );
};
