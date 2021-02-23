import React from "react";
import { useLocation } from "react-router-dom";
import { Backbar } from "../components/Backbar";
import { UserProfile } from "../components/UserProfile";
import { Wrapper } from "../components/Wrapper";
import { User } from "@dogehouse/feta/types";

interface ViewUserPageProps {}

export const ViewUserPage: React.FC<ViewUserPageProps> = () => {
  const { state } = useLocation<User>();
  return (
    <Wrapper>
      <Backbar actuallyGoBack />
      <UserProfile profile={state} />
    </Wrapper>
  );
};
