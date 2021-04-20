import React, { useState } from "react";
import { Link, Link2 } from "react-feather";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { BoxedIcon } from "../../ui/BoxedIcon";
import { copyTextToClipboard } from "./copyToClipboard";

interface CopyLinkButtonProps {
  text: string;
}

export const CopyScheduleRoomLinkButton: React.FC<CopyLinkButtonProps> = ({
  text,
}) => {
  const [copied, setCopied] = useState(false);
  return (
    <BoxedIcon
      onClick={() => {
        if (copyTextToClipboard(text)) {
          setCopied(true);
        }
      }}
    >
      <Link2 size={18} />
    </BoxedIcon>
  );
};
