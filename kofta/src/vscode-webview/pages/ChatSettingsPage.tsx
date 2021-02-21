import React from "react";
import { Backbar } from "../components/Backbar";
import { ChatSettings } from "../components/ChatSettings";
import { Wrapper } from "../components/Wrapper";

interface ChatSettingsPageProps {}

export const ChatSettingsPage: React.FC<ChatSettingsPageProps> = () => {
  return (
    <Wrapper>
      <Backbar actuallyGoBack />
      <ChatSettings />
    </Wrapper>
  );
};
