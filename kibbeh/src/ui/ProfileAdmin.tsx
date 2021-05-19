import { BaseUser, wrap } from "@dogehouse/kebab";
import React, { useEffect, useState } from "react";
import { useConn } from "../shared-hooks/useConn";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { Button } from "./Button";

export interface ProfileAdminProps
  extends React.HTMLAttributes<HTMLDivElement> {
  user: BaseUser;
  className?: string;
}

export const ProfileAdmin: React.FC<ProfileAdminProps> = ({
  user,
  className = "",
}) => {
  const { t } = useTypeSafeTranslation();
  const conn = useConn();
  const wrapper = wrap(conn);
  const [contributions, setContributions] = useState(0);
  const [isStaff, setIsStaff] = useState(false);
  useEffect(() => {
    setContributions(user.contributions);
    setIsStaff(user.staff);
  }, [user]);
  return (
    <div
      className={`block mt-2 bg-primary-800 p-4 rounded-8 w-full leading-8 ${className}`}
      style={{ maxWidth: 640 }}
    >
      <div>
        <label className="inline-flex mb-4">
          <div className={`text-primary-100`}>
            {t("pages.admin.contributions")}:
          </div>
          <input
            type="number"
            className="px-2 ml-2 text-primary-100 placeholder-primary-300 focus:outline-none bg-primary-700"
            value={contributions}
            onChange={(e) => setContributions(Number(e.target.value))}
          />
          <Button
            size="tiny"
            className="ml-4"
            onClick={() => {
              wrapper.mutation.userAdminUpdate(user.id, {
                contributions,
              });
            }}
          >
            {t("common.save")}
          </Button>
        </label>
      </div>
      <div>
        <label className="inline-flex mb-4">
          <div className={`text-primary-100`}>{t("pages.admin.staff")}</div>
          <input
            type="checkbox"
            className="ml-2 mt-1"
            checked={isStaff}
            onChange={(e) => setIsStaff(e.target.checked)}
          />
          <Button
            size="tiny"
            className="ml-4"
            onClick={() => {
              wrapper.mutation.userAdminUpdate(user.id, {
                staff: isStaff,
              });
            }}
          >
            {t("common.save")}
          </Button>
        </label>
      </div>
    </div>
  );
};
