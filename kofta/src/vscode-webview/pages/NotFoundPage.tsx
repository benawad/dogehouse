import React from "react";
import { Wrapper } from "../components/Wrapper";
import { Logo } from "../svgs/Logo";
import { Link } from "react-router-dom";
import { BodyWrapper } from "../components/BodyWrapper";

interface NotFoundPageProps {}

export const NotFoundPage: React.FC<NotFoundPageProps> = () => {
  return (
    <Wrapper>
      <BodyWrapper>
        <div className={`mb-10 mt-8`}>
          <Logo />
        </div>
        <div className={`text-2xl`}>
          Whoops! This page got lost in conversation.
        </div>
        Not to worry. You can
        <Link to="/" className={`text-blue-400`}>
          go home
        </Link>
      </BodyWrapper>
    </Wrapper>
  );
};
