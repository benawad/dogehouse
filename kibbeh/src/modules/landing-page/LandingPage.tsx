import { useRouter } from "next/router";
import React from "react";
import { apiBaseUrl, loginNextPathKey, __prod__ } from "../../lib/constants";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { Button } from "../../ui/Button";
import { useSaveTokensFromQueryParams } from "../auth/useSaveTokensFromQueryParams";
import { useTokenStore } from "../auth/useTokenStore";

interface LandingPageProps {}

export const LandingPage: React.FC<LandingPageProps> = ({}) => {
  const { query } = useRouter();
  useSaveTokensFromQueryParams();
  const { t } = useTypeSafeTranslation();
  const { push } = useRouter();

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
        Login with GitHub
      </Button>
      {!__prod__ ? (
        <Button
          className={`m-8`}
          onClick={async () => {
            // eslint-disable-next-line no-alert
            const name = window.prompt("username");
            if (!name) {
              return;
            }
            const r = await fetch(
              `${apiBaseUrl}/dev/test-info?username=` + name
            );
            const d = await r.json();
            useTokenStore.getState().setTokens({
              accessToken: d.accessToken,
              refreshToken: d.refreshToken,
            });
            push("/dashboard");
          }}
        >
          {t("pages.login.createTestUser")}
        </Button>
      ) : null}
    </div>
  );
};
