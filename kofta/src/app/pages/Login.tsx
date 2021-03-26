import isElectron from "is-electron";
import qs from "query-string";
import React, { useEffect } from "react";
import { AlertModal, modalAlert } from "../components/AlertModal";
import { BodyWrapper } from "../components/BodyWrapper";
import { Button } from "../components/Button";
import { CenterLayout } from "../components/CenterLayout";
import { ConfirmModal } from "../components/ConfirmModal";
import { Footer } from "../components/Footer";
import { ListItem } from "../components/ListItem";
import { modalPrompt, PromptModal } from "../components/PromptModal";
import { Wrapper } from "../components/Wrapper";
import { apiBaseUrl, __prod__, __staging__ } from "../constants";
import { GitHubIcon } from "../svgs/GitHubIcon";
import { Logo } from "../svgs/Logo";
import { TwitterIcon } from "../svgs/TwitterIcon";
import { showErrorToast } from "../utils/showErrorToast";
import { useTokenStore } from "../utils/useTokenStore";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";

const isMac = process.platform === "darwin";

interface LoginProps {}

export const Login: React.FC<LoginProps> = () => {
  const { t } = useTypeSafeTranslation();
  useEffect(() => {
    const { error } = qs.parse(window.location.search);
    if (error && typeof error === "string") {
      showErrorToast(error);
    }
    if (isElectron() && isMac) {
      modalAlert(t("common.requestPermissions"));
    }
  }, [t]);
  return (
    <CenterLayout>
      <Wrapper>
        <BodyWrapper>
          <div className={`my-8`}>
            <Logo />
          </div>
          <div className={`text-4xl mb-4 tracking-tight font-extrabold`}>
            {t("pages.login.headerText")}
          </div>
          <ul className={`my-4 mb-10 text-xl`}>
            <ListItem>{t("pages.login.featureText_1")}</ListItem>
            <ListItem>{t("pages.login.featureText_2")}</ListItem>
            <ListItem>{t("pages.login.featureText_3")}</ListItem>
            <ListItem>
              <a
                href="https://github.com/benawad/dogehouse"
                className={`p-0 text-blue-400`}
                target="_blank"
                rel="noreferrer"
              >
                {t("pages.login.featureText_4")}
              </a>
            </ListItem>
            <ListItem>{t("pages.login.featureText_5")}</ListItem>
            <ListItem>{t("pages.login.featureText_6")}</ListItem>
          </ul>
          <div className={`mb-8`}>
            <Button
              variant="slim"
              style={{ backgroundColor: "#333" }}
              onClick={() =>
                (window.location.href =
                  apiBaseUrl +
                  "/auth/github/web" +
                  (__staging__
                    ? "?redirect_after_base=" + window.location.origin
                    : ""))
              }
            >
              <span className={`inline-flex items-center`}>
                <GitHubIcon className={`h-6 w-6`} />
                <p className={`ml-3`}>{t("pages.login.loginGithub")}</p>
              </span>
            </Button>
          </div>
          {!__staging__ ? (
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
              <span className={`inline-flex items-center`}>
                <TwitterIcon className={`h-6 w-6`} />
                <p className={`ml-3`}>{t("pages.login.loginTwitter")}</p>
              </span>
            </Button>
          ) : null}
          {!__prod__ ? (
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
              {t("pages.login.createTestUser")}
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
