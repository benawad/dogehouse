import { User } from "@dogehouse/kebab";
import { useRouter } from "next/router";
import React from "react";
import { apiBaseUrl } from "../../lib/constants";
import { PageComponent } from "../../types/PageComponent";
import { HeaderController } from "../display/HeaderController";
import { DefaultDesktopLayout } from "../layouts/DefaultDesktopLayout";
import { MiddlePanel } from "../layouts/GridPanels";
import { UserProfileController } from "./UserProfileController";

interface UserPageProps {
  username: string;
  user: User;
}


export const UserPage: PageComponent<UserPageProps> = ({ username, user }) => {
  const { query } = useRouter();
  return (
    <DefaultDesktopLayout>
      <HeaderController title={user.displayName} embed={{ image: user.avatarUrl }} description={user.bio ? user.bio : undefined} />
      <MiddlePanel>
        <UserProfileController key={username} />
      </MiddlePanel>
    </DefaultDesktopLayout>
  );
};

UserPage.getInitialProps = async ({ query }) => {
  const username = typeof query.username === "string" ? query.username : "";
  const res = await fetch(`${apiBaseUrl}/user/${username}`);
  const user: { user: User } = await res.json();
  console.log(user);
  return { username, user: user.user };
};

UserPage.ws = true;
