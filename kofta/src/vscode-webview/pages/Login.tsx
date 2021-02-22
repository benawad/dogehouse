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
import { modalPrompt, PromptModal } from "../components/PromptModal";
import { AlertModal } from "../components/AlertModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { BodyWrapper } from "../components/BodyWrapper";
import { ListItem } from "../components/ListItem";
import { GitHubIcon } from "../svgs/GitHubIcon";
import { TwitterIcon } from "../svgs/TwitterIcon";

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
          <div className={tw`my-8`}>
            <Logo />
          </div>
          <div className={tw`text-4xl mb-4 tracking-tight font-extrabold`}>
            The home for voice conversations.
          </div>
          <ul className={tw`my-4 mb-10 text-xl`}>
            <ListItem>Dark theme</ListItem>
            <ListItem>Open sign ups</ListItem>
            <ListItem>Cross platform support</ListItem>
            <ListItem>
              <a
                style={{
                  color: "var(--vscode-textLink-foreground)",
                  padding: "0px",
                }}
                href="https://github.com/benawad/dogehouse"
              >
                Open Source
              </a>
            </ListItem>
            <ListItem>Text chat</ListItem>
            <ListItem>Powered by Doge</ListItem>
          </ul>
          <div className={tw`mb-8`}>
            <Button
              variant="slim"
              style={{ backgroundColor: "#333" }}
              onClick={() =>
                (window.location.href =
                  apiBaseUrl +
                  "/auth/github/web" +
                  (process.env.REACT_APP_IS_STAGING === "true"
                    ? "?redirect_after_base=" + window.location.origin
                    : ""))
              }
            >
              <span className={tw`inline-flex items-center`}>
                <GitHubIcon className={tw`h-6 w-6`} />
                <p className={tw`ml-3`}>login with GitHub</p>
              </span>
            </Button>
          </div>
          <Button
            variant="slim"
            style={{ backgroundColor: "#0C84CF" }}
            onClick={() =>
              (window.location.href =
                apiBaseUrl +
                "/auth/twitter/web" +
                (process.env.REACT_APP_IS_STAGING === "true"
                  ? "?redirect_after_base=" + window.location.origin
                  : ""))
            }
          >
            <span className={tw`inline-flex items-center`}>
              <TwitterIcon className={tw`h-6 w-6`} />
              <p className={tw`ml-3`}>login with Twitter</p>
            </span>
          </Button>
          {process.env.NODE_ENV === "development" ? (
            <Button
              variant="slim"
              style={{ marginTop: 32 }}
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
      <div
        style={{
          padding: "0 var(--container-paddding)",
        }}
        className={tw`mb-6`}
      >
        <Footer isLogin />
      </div>
      <AlertModal />
      <PromptModal />
      <ConfirmModal />
    </CenterLayout>
  );
};
