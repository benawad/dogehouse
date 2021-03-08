import React from "react";
import { apiBaseUrl } from "../../lib/constants";
import { useSaveTokensFromQueryParams } from "../auth/useSaveTokensFromQueryParams";

interface LandingPageProps {}

export const LandingPage: React.FC<LandingPageProps> = ({}) => {
  useSaveTokensFromQueryParams();

  return (
    <div>
      <button
        onClick={() => {
          window.location.href = `${apiBaseUrl}/auth/github/web`;
        }}
      >
        login with GitHub
      </button>
    </div>
  );
};
