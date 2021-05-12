import { User } from "@dogehouse/kebab";
import React from "react";
import { apiBaseUrl } from "../../lib/constants";
import { PageComponent } from "../../types/PageComponent";
import { HeaderController } from "../display/HeaderController";
import { DefaultDesktopLayout } from "../layouts/DefaultDesktopLayout";
import { MiddlePanel } from "../layouts/GridPanels";
import { UserProfileController } from "./UserProfileController";

interface UserPageProps {
  username: string;
  user: User | null;
}

export const UserPage: PageComponent<UserPageProps> = ({ username, user }) => {
  return (
    <>
      {user ? (
        <HeaderController
          title={user.displayName}
          embed={{ image: user.avatarUrl }}
          description={user.bio ? user.bio : undefined}
        />
      ) : (
        <HeaderController />
      )}
      <DefaultDesktopLayout>
        <MiddlePanel>
          <UserProfileController key={username} />
        </MiddlePanel>
      </DefaultDesktopLayout>
    </>
  );
};

UserPage.getInitialProps = async ({ query }) => {
  const username = typeof query.username === "string" ? query.username : "";
  try {
    const res = await fetch(`${apiBaseUrl}/user/${username}`);
    const { user }: { user: User | null } = await res.json();
    return { username, user };
  } catch {
    return { username, user: null };
  }
};

UserPage.ws = true;
