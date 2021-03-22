import React, { useMemo, useState } from "react";

interface UserProfileOverlayProviderProps {}

export const UserProfileOverlayContext = React.createContext<{
  userId?: string | null;
  setUserId: (u: string) => void;
}>({ setUserId: () => {} });

export const UserProfileOverlayProvider: React.FC<UserProfileOverlayProviderProps> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  return (
    <UserProfileOverlayContext.Provider
      value={useMemo(() => ({ userId, setUserId }), [userId, setUserId])}
    >
      {children}
    </UserProfileOverlayContext.Provider>
  );
};
