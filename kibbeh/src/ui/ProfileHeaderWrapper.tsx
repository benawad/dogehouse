import React, { ReactNode } from "react";

export interface ProfileHeaderWrapperProps {
  children: ReactNode;
  coverUrl: string;
}

export const ProfileHeaderWrapper: React.FC<ProfileHeaderWrapperProps> = ({
  children,
  coverUrl,
  ...props
}) => {
  return (
    <div className="bg-primary-800 rounded-8" {...props}>
      <img
        alt="cover"
        src={coverUrl}
        className="rounded-t-8 w-full object-cover"
      />
      <div className="p-4">{children}</div>
    </div>
  );
};
