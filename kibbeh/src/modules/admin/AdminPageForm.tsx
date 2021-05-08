import { UserWithFollowInfo, wrap } from "@dogehouse/kebab";
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
  const [user, setUser] = useState<UserWithFollowInfo>();
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

  useEffect(() => {
    wrapper.query.getUserProfile(username).then((u) => {
      // @ts-ignore
      if (u && !u.error) {
        // @ts-ignore
        setUser(u);
      }
    });
  }, [username]);

  useEffect(() => {
    if (user) {
      setContributions(user.contributions);
      setIsStaff(user.staff);
    }
  }, [user]);

  if (conn.user.username !== "benawad") {
    return <MiddlePanel />;
  }

  return (
    <MiddlePanel>
      <div>
        <h3 className="text-primary-100">Ban</h3>
        <div className="flex">
          <Input
            className={`mb-4`}
            autoFocus
            placeholder="username to ban..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <Input
          className={`mb-4`}
          autoFocus
          placeholder="reason"
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
          {t("pages.banUser.ban")}
        </Button>
      </div>
      <div className="mt-6">
        <h3 className="text-primary-100">User Staff & Contributions</h3>
        <Input
          className={`mb-4`}
          autoFocus
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          className={`mb-4`}
          autoFocus
          placeholder="Contributions"
          value={contributions}
          onChange={(e) => setContributions(Number(e.target.value))}
          type="number"
        />
        <label className="inline-flex mb-4">
          <div className={`text-primary-100`}>Staff: </div>
          <Input
            className={`ml-2`}
            autoFocus
            placeholder="Contributions"
            checked={isStaff}
            onChange={(e) => setIsStaff(e.target.checked)}
            type="checkbox"
          />
        </label>
      </div>
      <div className="flex">
        <Button
          onClick={() => {
            wrapper.mutation.userSetContributions(username, contributions);
            wrapper.mutation.userSetStaff(username, isStaff);
          }}
        >
          Save
        </Button>
      </div>
    </MiddlePanel>
  );
};
