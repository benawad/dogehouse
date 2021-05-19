import { BotIcon } from "../../icons";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { DeveloperNavButton } from "./DeveloperNavButton";

export const DeveloperPanel: React.FC<unknown> = ({}) => {
  const { t } = useTypeSafeTranslation();
  return (
    <div className="w-full flex flex-col flex-1" data-testid="developer-pages">
      <h4 className="text-primary-100">
        {t("components.settingsDropdown.developer")}
      </h4>
      <div className="flex flex-col mt-3 gap-3">
        <DeveloperNavButton
          title={t("pages.botEdit.bots")}
          href="/developer/bots"
          icon={<BotIcon width={16} height={16} />}
        />
      </div>
    </div>
  );
};
