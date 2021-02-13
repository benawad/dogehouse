import React, { useEffect } from "react";
import { tw } from "twind";
import { Button } from "../components/Button";
import { Footer } from "../components/Footer";
import { Wrapper } from "../components/Wrapper";
import { apiBaseUrl } from "../constants";
import { Logo } from "../svgs/Logo";
import { useTokenStore } from "../utils/useTokenStore";
import qs from "query-string";
import { showErrorToast } from "../utils/showErrorToast";
import { CenterLayout } from "../components/CenterLayout";

interface LoginProps {}

export const Login: React.FC<LoginProps> = () => {
  useEffect(() => {
    const { error } = qs.parse(window.location.search);
    if (error && typeof error === "string") {
      showErrorToast(error);
    }
  }, []);
  return (
    <CenterLayout>
      <Wrapper>
        <div className={tw`my-8`}>
          <Logo />
        </div>
        <div className={tw`text-2xl`}>The home for voice conversations.</div>
        <ul className={tw`my-4 mb-8 text-xl`}>
          <li>- Dark theme</li>
          <li>- Open sign ups</li>
          <li>- Cross platform support</li>
          <li>
            -{" "}
            <a
              style={{ color: "var(--vscode-textLink-foreground)" }}
              href="https://github.com/benawad/dogehouse"
            >
              Open Source
            </a>
          </li>
          <li>- Powered by Doge</li>
        </ul>
        <Button
          onClick={() =>
            (window.location.href = apiBaseUrl + "/auth/github/web")
          }
        >
          login with GitHub
        </Button>
        {process.env.NODE_ENV === "development" ? (
          <Button
            style={{ marginTop: 10 }}
            onClick={async () => {
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
            }}
          >
            create test user
          </Button>
        ) : null}
      </Wrapper>
      <div
        style={{
          padding: "0 var(--container-paddding)",
        }}
        className={tw`mb-6`}
      >
        <Footer />
      </div>
    </CenterLayout>
  );
};
