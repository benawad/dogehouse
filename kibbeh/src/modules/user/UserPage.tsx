import { useRouter } from "next/router";
import React from "react";
import { PageComponent } from "../../types/PageComponent";
import { DefaultDesktopLayout } from "../layouts/DefaultDesktopLayout";
import { MiddlePanel } from "../layouts/GridPanels";
import { UserProfileController } from "./UserProfileController";

interface UserPageProps {}

export const UserPage: PageComponent<UserPageProps> = ({}) => {
  const { query } = useRouter();
  return (
    <DefaultDesktopLayout>
      <MiddlePanel>
        <UserProfileController
          key={typeof query.username === "string" ? query.username : ""}
        />
      </MiddlePanel>
    </DefaultDesktopLayout>
  );
};

UserPage.ws = true;
