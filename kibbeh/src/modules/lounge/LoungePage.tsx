import React from "react";
import { useVerifyLoggedIn } from "../auth/useVerifyLoggedIn";

interface LoungePageProps {}

export const LoungePage: React.FC<LoungePageProps> = ({}) => {
  if (!useVerifyLoggedIn()) {
    return null;
  }

  return <div>hey</div>;
};
