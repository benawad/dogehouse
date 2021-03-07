import React, { useState } from "react";
import { Button } from "./Button";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";

interface InviteButtonProps {
	onClick: () => void;
}

export const InviteButton: React.FC<InviteButtonProps> = ({ onClick }) => {
  const [invited, setInvited] = useState(false);
  const { t } = useTypeSafeTranslation();

  return (
    <Button
      onClick={() => {
        onClick();
        setInvited(true);
      }}
      disabled={invited}
      variant="small"
    >
      {invited
        ? t("components.inviteButton.invited")
        : t("components.inviteButton.inviteToRoom")}
    </Button>
  );
};
