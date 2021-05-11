import React from "react";
import { MessageElement, MessageElementProps } from "./MessageElement";
import { BaseOverlay } from "./BaseOverlay";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";

export interface MessagesDropdownProps {
  messageList: MessageElementProps[];
}

export const MessagesDropdown: React.FC<MessagesDropdownProps> = ({
  messageList = [],
}) => {
  const { t } = useTypeSafeTranslation();
  return (
    <BaseOverlay
      title={t("components.messagesDropdown.title")}
      actionButton={
        messageList.length ? t("components.messagesDropdown.showMore") : ""
      }
    >
      {messageList.length > 0 ? (
        messageList.map((message, idx) => (
          <MessageElement {...message} key={idx} />
        ))
      ) : (
        <div className="py-5 px-4" data-testid="empty-state-msg">
          {t("components.messagesDropdown.noMessages")}
        </div>
      )}
    </BaseOverlay>
  );
};
