import { useState, useEffect } from "react";
import { Gist, File } from "../types/Gist";
import { Button } from "../ui/Button";

export interface GistPopupProps {
  id: string;
}

export const GistPopup: React.FC<GistPopupProps> = ({ id }) => {
  const [gistData, setGistData] = useState<Gist | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/gists/${id}`)
      .then((res) => res.json())
      .then(setGistData);
  }, [id]);

  if (!gistData) return <div>Loading...</div>;
  const files = Object.values(gistData.files);
  if (!selectedFile) {
    setSelectedFile(files[0]);
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full bg-primary-800 flex-col text-primary-100 max-w-2xl rounded-8 max-h-24">
      <div>
        <a
          className="text-xl font-bold mb-2 flex-1 truncate p-4 pb-0 inline-block"
          href={gistData.html_url}
        >
          {gistData.description}
        </a>
        <button className="font-mono pr-4 pt-2 text-2xl ml-auto">×</button>
      </div>
      <div className="px-4 pb-2 pt-0">
        <div className="w-full overflow-x-auto gap-2">
          {files.map((file) => (
            <Button
              key={file.filename}
              onClick={() => setSelectedFile(file)}
              className="mb-2"
              color={
                file.filename === selectedFile.filename
                  ? "primary"
                  : "secondary"
              }
            >
              {file.filename}
            </Button>
          ))}
        </div>
      </div>
      <div className="p-4 pt-2">
        <code className="whitespace-pre-wrap">{selectedFile.content}</code>
      </div>
    </div>
  );
};
