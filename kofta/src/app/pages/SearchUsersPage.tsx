import React, { useState } from "react";
import { useAtom } from "jotai";
import { userSearchAtom } from "../atoms";
import { Backbar } from "../components/Backbar";
import { Button } from "../components/Button";
import { Wrapper } from "../components/Wrapper";
import { Codicon } from "../svgs/Codicon";
import { BodyWrapper } from "../components/BodyWrapper";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";
import "../../css/search.css";
import { BottomVoiceControl } from "../components/BottomVoiceControl";
import { ProfileButton } from "../components/ProfileButton";

interface SearchUsersProps {}

export const SearchUsersPage: React.FC<SearchUsersProps> = ({}) => {
  const [{ loading }] = useAtom(userSearchAtom);
  const [query, setQuery] = useState("");
  const { t } = useTypeSafeTranslation();
  return (
    <div className={`flex flex-col flex-1`}>
      <Wrapper>
        <Backbar>
          <h1
            className={`font-xl flex-1 text-center flex items-center justify-center text-2xl`}
          >
            Search
            {/* {t("modules.scheduledRooms.title")} */}
          </h1>
          <ProfileButton />
        </Backbar>
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
              className={`searchTerm`}
              autoFocus
              placeholder={t("pages.searchUser.search")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button className={`searchButton`} type="submit" variant="small">
              <Codicon name="search" />
            </Button>
          </form>
          {loading ? <div className={`my-8`}>{t("common.loading")}</div> : null}
        </BodyWrapper>
      </Wrapper>
      <BottomVoiceControl />
    </div>
  );
};
