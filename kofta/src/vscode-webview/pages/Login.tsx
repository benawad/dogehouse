import React from "react";
import { tw } from "twind";
import { Button } from "../components/Button";
import { Wrapper } from "../components/Wrapper";
import { apiBaseUrl } from "../constants";
import { Logo } from "../svgs/Logo";
import { useTokenStore } from "../utils/useTokenStore";

interface LoginProps {}

export const Login: React.FC<LoginProps> = () => {
  return (
    <Wrapper>
      <div className={tw`mb-8`}>
        <Logo />
      </div>
      <div className={tw`text-2xl`}>
        An audio livestreaming social network that may or may not be a Clubhouse
        clone with:
      </div>
      <ul className={tw`my-4 mb-8 text-xl`}>
        <li>- Less features</li>
        <li>- Dark theme</li>
        <li>- Open sign ups</li>
        <li>- Cross platform support</li>
      </ul>
      <Button
        onClick={() => (window.location.href = apiBaseUrl + "/auth/github/web")}
      >
        login with Github
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
  );
};
