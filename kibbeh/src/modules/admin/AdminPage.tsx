import * as React from "react";
import { PageComponent } from "../../types/PageComponent";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { DefaultDesktopLayout } from "../layouts/DefaultDesktopLayout";
import { AdminPageForm } from "./AdminPageForm";

interface Props {}

export const AdminPage: PageComponent<Props> = () => {
  return (
    <WaitForWsAndAuth>
      <DefaultDesktopLayout>
        <AdminPageForm />
      </DefaultDesktopLayout>
    </WaitForWsAndAuth>
  );
};

AdminPage.ws = true;
