import React, { useState } from "react";
import { SolidHelp } from "../../icons";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { Button } from "../../ui/Button";
import { copyTextToClipboard } from "./copyToClipboard";

interface CopyLinkButtonProps {
  text: string;
}

export const CopyScheduleRoomLinkButton: React.FC<CopyLinkButtonProps> = ({
  text,
}) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTypeSafeTranslation();
  return (
    <Button
      type="button"
      size="small"
      className="flex"
      onClick={() => {
        if (copyTextToClipboard(text)) {
          setCopied(true);
        }
      }}
    >
      {/* @todo replace with real icon */}
      <SolidHelp className="mr-2" />
      {copied ? t("common.copied") : t("common.copyLink")}
    </Button>
  );
};
