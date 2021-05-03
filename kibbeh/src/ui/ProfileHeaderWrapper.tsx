import React, { ReactNode } from "react";
import { useHostStore } from "../global-stores/useHostStore";
import isElectron from "is-electron";
import { useScreenType } from "../shared-hooks/useScreenType";

export interface ProfileHeaderWrapperProps {
  children: ReactNode;
  coverUrl: string;
}

export const ProfileHeaderWrapper: React.FC<ProfileHeaderWrapperProps> = ({
  children,
  coverUrl,
  ...props
}) => {
  const screenType = useScreenType();
  return (
    <div
      className="bg-primary-800 rounded-8 relative"
      {...props}
      style={
        screenType === "fullscreen" &&
        isElectron() &&
        !useHostStore.getState().isLinux
          ? { marginTop: "30px" }
          : {}
      }
    >
      <img
        alt="cover"
        src={coverUrl}
        className="rounded-t-8 w-full object-cover"
        style={{ height: "155px" }}
      />
      <div className="container mx-auto flex p-4 relative">{children}</div>
    </div>
  );
};
