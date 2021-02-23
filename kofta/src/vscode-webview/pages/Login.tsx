import React, { useEffect } from "react";
import { Button } from "../components/Button";
import { Footer } from "../components/Footer";
import { Wrapper } from "../components/Wrapper";
import { apiBaseUrl } from "../constants";
import { Logo } from "../svgs/Logo";
import { useTokenStore } from "../utils/useTokenStore";
import qs from "query-string";
import { showErrorToast } from "../utils/showErrorToast";
import { CenterLayout } from "../components/CenterLayout";
import { modalPrompt, PromptModal } from "../components/PromptModal";
import { AlertModal } from "../components/AlertModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { BodyWrapper } from "../components/BodyWrapper";
import { ListItem } from "../components/ListItem";

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
        <BodyWrapper>
          <div className={`my-8`}>
            <Logo />
          </div>
          <div className={`text-4xl mb-4 tracking-tight font-extrabold`}>
            The home for voice conversations.
          </div>
          <ul className={`my-4 mb-10 text-xl`}>
            <ListItem>Dark theme</ListItem>
            <ListItem>Open sign ups</ListItem>
            <ListItem>Cross platform support</ListItem>
            <ListItem>
              <a
                href="https://github.com/benawad/dogehouse"
                className={`p-0 text-blue-400`}
              >
                Open Source
              </a>
            </ListItem>
            <ListItem>Text chat</ListItem>
            <ListItem>Powered by Doge</ListItem>
          </ul>
          <div className={`mb-8`}>
            <Button
              variant="slim"
              onClick={() =>
                (window.location.href =
                  apiBaseUrl +
                  "/auth/github/web" +
                  (process.env.REACT_APP_IS_STAGING === "true"
                    ? "?redirect_after_base=" + window.location.origin
                    : ""))
              }
            >
              login with GitHub
            </Button>
          </div>
          <Button
            variant="slim"
            onClick={() =>
              (window.location.href =
                apiBaseUrl +
                "/auth/twitter/web" +
                (process.env.REACT_APP_IS_STAGING === "true"
                  ? "?redirect_after_base=" + window.location.origin
                  : ""))
            }
          >
            login with Twitter
          </Button>
          {process.env.NODE_ENV === "development" ? (
            <Button
              variant="slim"
              className={`m-8`}
              onClick={() => {
                modalPrompt("username", async (name) => {
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
                });
              }}
            >
              create test user
            </Button>
          ) : null}
        </BodyWrapper>
      </Wrapper>
      <div className={`mb-6 px-5`}>
        <Footer isLogin />
      </div>
      <AlertModal />
      <PromptModal />
      <ConfirmModal />
    </CenterLayout>
  );
};
