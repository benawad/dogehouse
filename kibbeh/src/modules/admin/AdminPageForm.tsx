import { wrap } from "@dogehouse/kebab";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { showErrorToast } from "../../lib/showErrorToast";
import { useConn } from "../../shared-hooks/useConn";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { MiddlePanel } from "../layouts/GridPanels";

interface SearchUsersProps {}

export const AdminPageForm: React.FC<SearchUsersProps> = ({}) => {
  const conn = useConn();
  const [username, setUsername] = useState("");
  const [reason, setReason] = useState("");
  const [contributions, setContributions] = useState(0);
  const [isStaff, setIsStaff] = useState(false);
  const { t } = useTypeSafeTranslation();
  const { replace } = useRouter();
  const wrapper = wrap(conn);

  useEffect(() => {
    if (conn.user.username !== "benawad") {
      showErrorToast("nice try");
      replace("/dash");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (conn.user.username !== "benawad") {
    return <MiddlePanel />;
  }

  return (
    <MiddlePanel>
      <h3 className="text-primary-100">{t("pages.admin.username")}</h3>
      <div className="flex">
        <Input
          autoFocus
          placeholder={t("pages.admin.usernamePlaceholder")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mt-6">
        <h3 className="text-primary-100">{t("pages.admin.ban")}</h3>
        <Input
          className={`mb-4`}
          autoFocus
          placeholder={t("pages.admin.reason")}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <Button
          onClick={() => {
            if (username && reason) {
              wrapper.mutation.ban(username, reason);
            }
          }}
        >
          {t("pages.admin.ban")}
        </Button>
      </div>
      <div className="mt-6">
        <h3 className="text-primary-100">{t("pages.admin.usrStaff")}</h3>

        <label className="inline-flex mb-4">
          <div className={`text-primary-100`}>{t("pages.admin.staff")}</div>
          <input
            type="checkbox"
            className="ml-2 mt-1"
            checked={isStaff}
            onChange={(e) => setIsStaff(e.target.checked)}
          />
        </label>
        <div className="flex">
          <Button
            onClick={() => {
              wrapper.mutation.userAdminUpdate(username, { staff: isStaff });
            }}
          >
            {t("common.save")}
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-primary-100">
          {t("pages.admin.usrContributions")}
        </h3>
        <Input
          className={`mb-4`}
          autoFocus
          placeholder={t("pages.admin.contributions")}
          value={contributions}
          onChange={(e) => setContributions(Number(e.target.value))}
          type="number"
        />
        <div className="flex pb-5">
          <Button
            onClick={() => {
              wrapper.mutation.userAdminUpdate(username, { contributions });
            }}
          >
            {t("common.save")}
          </Button>
        </div>
      </div>
    </MiddlePanel>
  );
};
