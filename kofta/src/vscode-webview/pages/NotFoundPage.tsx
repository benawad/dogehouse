import React from "react";
import { Wrapper } from "../components/Wrapper";
import { tw } from "twind";
import { Logo } from "../svgs/Logo";
import { Link } from "react-router-dom";
import { BodyWrapper } from "../components/BodyWrapper";

interface NotFoundPageProps {}

export const NotFoundPage: React.FC<NotFoundPageProps> = () => {
  return (
    <Wrapper>
      <BodyWrapper>
        <div className={tw`mb-10 mt-8`}>
          <Logo />
        </div>
        <div className={tw`text-2xl`}>
          Whoops! This page got lost in conversation.
        </div>
        Not to worry. You can
        <Link to="/" className={tw`text-blue-400`}>
          go home
        </Link>
      </BodyWrapper>
    </Wrapper>
  );
};
