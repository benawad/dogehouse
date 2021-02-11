import React, { useState } from "react";
import { Button } from "./Button";

interface InviteButtonProps {
  onClick: () => void;
}

export const InviteButton: React.FC<InviteButtonProps> = ({ onClick }) => {
  const [invited, setInvited] = useState(false);
  return (
    <Button
      onClick={() => {
        onClick();
        setInvited(true);
      }}
      disabled={invited}
      variant="small"
    >
      {invited ? "invited" : "invite to room"}
    </Button>
  );
};
