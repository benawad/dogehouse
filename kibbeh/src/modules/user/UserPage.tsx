import { useRouter } from "next/router";
import React from "react";
import { PageComponent } from "../../types/PageComponent";
import { HeaderController } from "../display/HeaderController";
import { DefaultDesktopLayout } from "../layouts/DefaultDesktopLayout";
import { MiddlePanel } from "../layouts/GridPanels";
import { UserProfileController } from "./UserProfileController";

interface UserPageProps {}

export const UserPage: PageComponent<UserPageProps> = ({}) => {
  const { query } = useRouter();
  return (
    <DefaultDesktopLayout>
      <HeaderController
        title={
          query.username && !Array.isArray(query.username) ? query.username : ""
        }
      />
      <MiddlePanel>
        <UserProfileController
          key={typeof query.username === "string" ? query.username : ""}
        />
      </MiddlePanel>
    </DefaultDesktopLayout>
  );
};

UserPage.ws = true;
