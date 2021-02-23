import React from "react";
import { useLocation } from "react-router-dom";
import { Backbar } from "../components/Backbar";
import { BodyWrapper } from "../components/BodyWrapper";
import { UserProfile } from "../components/UserProfile";
import { Wrapper } from "../components/Wrapper";
import { RoomUser } from "../types";

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
