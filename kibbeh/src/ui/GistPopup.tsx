import { useState, useEffect } from "react";
import { Gist, File } from "../types/Gist";

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
      <div className="p-4 pb-2">
        <div className="w-full overflow-x-auto">
          {files.map((file) => (
            <button
              key={file.filename}
              className={`mb-2 rounded-5 px-4 py-2 transition-colors bg-primary-${
                file.filename === selectedFile.filename ? "700" : "800"
              }`}
              onClick={() => setSelectedFile(file)}
            >
              {file.filename}
            </button>
          ))}
        </div>
        <button className="font-mono p-2 ml-2 text-2xl">×</button>
      </div>
      <div className="p-4 pt-2 rounded-t-none">
        <pre>{selectedFile.content}</pre>
      </div>
    </div>
  );
};
