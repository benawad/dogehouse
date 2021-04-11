import React, { useMemo, useState } from "react";
import { RoomChatMessage } from "./chat/useRoomChatStore";

interface UserProfileOverlayProviderProps {}

type Data = { userId: string; message?: RoomChatMessage };

export const UserPreviewModalContext = React.createContext<{
  data?: Data | null;
  setData: (x: Data | null) => void;
}>({ setData: () => {} });

export const UserPreviewModalProvider: React.FC<UserProfileOverlayProviderProps> = ({
  children,
}) => {
  const [data, setData] = useState<Data | null>(null);
  return (
    <UserPreviewModalContext.Provider
      value={useMemo(() => ({ data, setData }), [data, setData])}
    >
      {children}
    </UserPreviewModalContext.Provider>
  );
};
