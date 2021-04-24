import React from "react";
import { HeaderController } from "../modules/display/HeaderController";
import { ElectronHeader } from "../modules/layouts/ElectronHeader";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { Button } from "../ui/Button";

interface ConnectionTakenProps {}

const ConnectionTaken: React.FC<ConnectionTakenProps> = ({}) => {
  const { t } = useTypeSafeTranslation();
  return (
    <>
      <HeaderController title="Connection Taken" embed={{}} />
      <div className="flex w-full h-full flex-col items-center justify-center p-8">
        <ElectronHeader />
        <h4 className="text-primary-100 mb-4">
          {t("components.wsKilled.description")}
        </h4>
        <Button
          onClick={() => {
            window.location.href = window.location.origin + "/dash";
          }}
        >
          {t("components.wsKilled.reconnect")}
        </Button>
      </div>
    </>
  );
};

export default ConnectionTaken;
