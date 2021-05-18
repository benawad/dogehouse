import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { DeveloperNavButton } from "./DeveloperNavButton";

export const DeveloperSettingsIcon: React.FC<{}> = ({}) => {
  return (
    <svg width="16" height="16" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.7 18L13.6 8.9C14.5 6.6 14 3.9 12.1 2C10.1 -3.21865e-06 7.1 -0.400003 4.7 0.699997L9 5L6 8L1.6 3.7C0.4 6.1 0.9 9.1 2.9 11.1C4.8 13 7.5 13.5 9.8 12.6L18.9 21.7C19.3 22.1 19.9 22.1 20.3 21.7L22.6 19.4C23.1 19 23.1 18.3 22.7 18Z" fill="white"/>
    </svg>
  );
};

export const BotsIcon: React.FC<{}> = ({}) => {
  return (
    <svg width="16" height="16" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.5 10H17V6C17 4.9 16.1 4 15 4H11V2.5C11 1.1 9.9 0 8.5 0C7.1 0 6 1.1 6 2.5V4H2C0.9 4 0 4.9 0 6V9.8H1.5C3 9.8 4.2 11 4.2 12.5C4.2 14 3 15.2 1.5 15.2H0V19C0 20.1 0.9 21 2 21H5.8V19.5C5.8 18 7 16.8 8.5 16.8C10 16.8 11.2 18 11.2 19.5V21H15C16.1 21 17 20.1 17 19V15H18.5C19.9 15 21 13.9 21 12.5C21 11.1 19.9 10 18.5 10Z" fill="white"/>
    </svg>
  );
};

export const DeveloperPanel: React.FC<{}> = ({}) => {
  const { t } = useTypeSafeTranslation();
  return (
    <div
      className="w-full flex flex-col flex-1"
      data-testid="developer-pages"
    >
      <h4 className="text-primary-100">
        Developer
      </h4>
      <div className="flex flex-col mt-3 gap-3">
        <DeveloperNavButton title="Settings" href="/" icon={<DeveloperSettingsIcon/>}/>
        <DeveloperNavButton title="Bots" href="/developer/bots" icon={<BotsIcon/>} />
      </div>
    </div>
  );
};