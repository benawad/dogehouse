import React from "react";
import { Loader } from "../components/Loader";
import { Wrapper } from "../components/Wrapper";
import { Backbar } from "../components/Backbar";
import { tw } from "twind";
import { useQuery } from "react-query";
import { changeLogUrl } from "../constants";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import "../../css/markdown.css";

interface ChangeLogProps {}

export const ChangeLog: React.FC<ChangeLogProps> = () => {
  const { data, isLoading } = useQuery("changelog", () =>
    fetch(changeLogUrl).then((res) => res.text())
  );

  return (
    <Wrapper>
      <Backbar actuallyGoBack={true} />

      {isLoading ? (
        <Loader className={tw`mt-80`} />
      ) : (
        <ReactMarkdown className="markdown" plugins={[gfm]}>
          {data || ""}
        </ReactMarkdown>
      )}
    </Wrapper>
  );
};
