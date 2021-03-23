import React, { useMemo, useState } from "react";

interface UserProfileOverlayProviderProps {}

export const UserPreviewModalContext = React.createContext<{
  userId?: string | null;
  setUserId: (u: string | null) => void;
}>({ setUserId: () => {} });

export const UserPreviewModalProvider: React.FC<UserProfileOverlayProviderProps> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  return (
    <UserPreviewModalContext.Provider
      value={useMemo(() => ({ userId, setUserId }), [userId, setUserId])}
    >
      {children}
    </UserPreviewModalContext.Provider>
  );
};
