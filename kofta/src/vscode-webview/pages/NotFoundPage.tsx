import React from "react";
import { Wrapper } from "../components/Wrapper";
import { tw } from "twind";
import { Logo } from "../svgs/Logo";
import { Link } from "react-router-dom";

interface NotFoundPageProps {}

export const NotFoundPage: React.FC<NotFoundPageProps> = () => {
  return (
    <Wrapper>
      <div className={tw`mb-10 mt-8`}>
        <Logo />
      </div>
      <div style={{ fontSize: "24px" }}>
        Whoops! This page got lost in conversation.
      </div>
      Not to worry. You can
      <Link to="/" style={{ color: "var(--vscode-textLink-foreground)" }}>
        go home
      </Link>
    </Wrapper>
  );
};
