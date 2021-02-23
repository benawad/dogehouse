import React from "react";
import { useLocation } from "react-router-dom";
import { Backbar } from "../components/Backbar";
import { BodyWrapper } from "../components/BodyWrapper";
import { UserProfile } from "../components/UserProfile";
import { Wrapper } from "../components/Wrapper";
<<<<<<< HEAD
import { RoomUser } from "../types";
=======
import { User } from "@dogehouse/feta/types";
>>>>>>> 76e5e6ddabfa381984235042bbfd5056e7372c0d

export const ViewUserPage = () => {
  const { state } = useLocation<RoomUser>();
  return (
    <Wrapper>
      <Backbar actuallyGoBack />
      <BodyWrapper>
        <UserProfile profile={state} />
      </BodyWrapper>
    </Wrapper>
  );
};
