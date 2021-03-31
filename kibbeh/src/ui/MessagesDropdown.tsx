import React from "react";
import { MessageElement, MessageElementProps } from "./MessageElement";
import { BaseOverlay } from "./BaseOverlay";

export interface MessagesDropdownProps {
  messageList: MessageElementProps[];
}

export const MessagesDropdown: React.FC<MessagesDropdownProps> = ({
  messageList = [],
}) => {
  return (
    <BaseOverlay
      title="Messages"
      actionButton={messageList.length ? "Show More" : ""}
    >
      {messageList.length > 0 ? (
        messageList.map((message, idx) => (
          <MessageElement {...message} key={idx} />
        ))
      ) : (
        <p className="py-5 px-4" data-testid="empty-state-msg">
          No new messages
        </p>
      )}
    </BaseOverlay>
  );
};
