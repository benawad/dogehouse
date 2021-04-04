import React from "react";
import { PageComponent } from "../../types/PageComponent";
import { DefaultDesktopLayout } from "../layouts/DefaultDesktopLayout";
import { MiddlePanel } from "../layouts/GridPanels";
import { UserProfileController } from "./UserProfileController";

interface UserPageProps {}

export const UserPage: PageComponent<UserPageProps> = ({}) => {
  return (
    <DefaultDesktopLayout>
      <MiddlePanel>
        <UserProfileController />
      </MiddlePanel>
    </DefaultDesktopLayout>
  );
};

UserPage.ws = true;
