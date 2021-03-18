import React from "react";
import { apiBaseUrl } from "../../lib/constants";
import { Button } from "../../ui/Button";
import { useSaveTokensFromQueryParams } from "../auth/useSaveTokensFromQueryParams";

interface LandingPageProps {}

export const LandingPage: React.FC<LandingPageProps> = ({}) => {
  useSaveTokensFromQueryParams();

  return (
    <div>
      <Button
        onClick={() => {
          window.location.href = `${apiBaseUrl}/auth/github/web`;
        }}
      >
        login with GitHub
      </Button>
    </div>
  );
};
