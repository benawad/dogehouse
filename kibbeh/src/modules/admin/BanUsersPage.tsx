import * as React from "react";
import { PageComponent } from "../../types/PageComponent";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { DefaultDesktopLayout } from "../layouts/DefaultDesktopLayout";
import { BanUsersForm } from "./BanUsersForm";

interface Props {}

export const BanUserPage: PageComponent<Props> = () => {
  return (
    <WaitForWsAndAuth>
      <DefaultDesktopLayout>
        <BanUsersForm />
      </DefaultDesktopLayout>
    </WaitForWsAndAuth>
  );
};

BanUserPage.ws = true;
