import { useRouter } from "next/router";
import React from "react";
import { apiBaseUrl, loginNextPathKey } from "../../lib/constants";
import { Button } from "../../ui/Button";
import { useSaveTokensFromQueryParams } from "../auth/useSaveTokensFromQueryParams";

interface LandingPageProps {}

export const LandingPage: React.FC<LandingPageProps> = ({}) => {
  const { query } = useRouter();
  useSaveTokensFromQueryParams();

  return (
    <div>
      <Button
        onClick={() => {
          if (typeof query.next === "string" && query.next) {
            try {
              localStorage.setItem(loginNextPathKey, query.next);
            } catch {}
          }

          window.location.href = `${apiBaseUrl}/auth/github/web`;
        }}
      >
        login with GitHub
      </Button>
    </div>
  );
};
