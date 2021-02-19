import React, { useState } from "react";
import { useAtom } from "jotai";
import { tw } from "twind";
import { userSearchAtom } from "../atoms";
import { Backbar } from "../components/Backbar";
import { Button } from "../components/Button";
import { Wrapper } from "../components/Wrapper";
import { Codicon } from "../svgs/Codicon";

interface SearchUsersProps {}

export const SearchUsersPage: React.FC<SearchUsersProps> = ({}) => {
  const [{ loading }] = useAtom(userSearchAtom);
  const [query, setQuery] = useState("");
  return (
    <Wrapper>
      <Backbar />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (query) {
          }
        }}
        className={tw`flex`}
      >
        <input
          autoFocus
          placeholder="search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" variant="small">
          <Codicon name="search" />
        </Button>
      </form>
      {loading ? <div className={tw`my-8`}>loading...</div> : null}
    </Wrapper>
  );
};
