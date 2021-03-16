import React from "react";
import { PageComponent } from "../../types/PageComponent";
import { useVerifyLoggedIn } from "../auth/useVerifyLoggedIn";

interface LoungePageProps {}

export const DashboardPage: PageComponent<LoungePageProps> = ({}) => {
  if (!useVerifyLoggedIn()) {
    return null;
  }

  return <div>hey</div>;
};

DashboardPage.ws = true;
