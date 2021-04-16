import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useTokenStore } from "../modules/auth/useTokenStore";
import { ElectronHeader } from "../modules/layouts/ElectronHeader";
import { ButtonLink } from "../ui/ButtonLink";

interface logoutProps {}

// purpose of this page is to wait for token store to be cleared
// should be done by the component sending the user here
// then it should redirect to landing page
const Logout: React.FC<logoutProps> = ({}) => {
  const [hasTokens, setTokens] = useTokenStore((s) => [
    !!(s.accessToken && s.refreshToken),
    s.setTokens,
  ]);
  const { replace } = useRouter();
  useEffect(() => {
    if (!hasTokens) {
      replace("/");
    }
  }, [hasTokens, replace]);

  return (
    <>
      <ElectronHeader />
      <ButtonLink
        onClick={() => setTokens({ accessToken: "", refreshToken: "" })}
      >
        click here if you are not automatically redirected
      </ButtonLink>
    </>
  );
};

export default Logout;
