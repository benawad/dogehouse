import React, { useState } from "react";
import { useAtom } from "jotai";
import { userSearchAtom } from "../atoms";
import { Backbar } from "../components/Backbar";
import { Button } from "../components/Button";
import { Wrapper } from "../components/Wrapper";
import { Codicon } from "../svgs/Codicon";
import { BodyWrapper } from "../components/BodyWrapper";
import { useTranslation } from 'react-i18next';

interface SearchUsersProps {}

export const SearchUsersPage: React.FC<SearchUsersProps> = ({}) => {
  const [{ loading }] = useAtom(userSearchAtom);
  const [query, setQuery] = useState("");
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Backbar />
      <BodyWrapper>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query) {
            }
          }}
          className={`flex`}
        >
          <input
            autoFocus
            placeholder={t("pages.searchUsers.search")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" variant="small">
            <Codicon name="search" />
          </Button>
        </form>
        {loading ? <div className={`my-8`}>{t("pages.searchUsers.loading")}</div> : null}
      </BodyWrapper>
    </Wrapper>
  );
};
