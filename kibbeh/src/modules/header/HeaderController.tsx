import React from "react";
import { useConn } from "../../shared-hooks/useConn";
import Header from "../../ui/Header";

interface HeaderControllerProps {}

export const HeaderController: React.FC<HeaderControllerProps> = ({}) => {
  const conn = useConn();
  return (
    <div className={`mt-5 mb-7`}>
      <Header
        searchPlaceholder={"Search for rooms, users or categories"}
        onSearchChange={() => null}
        avatarImg={conn.user.avatarUrl}
      />
    </div>
  );
};
