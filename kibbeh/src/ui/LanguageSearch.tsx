import React from "react";

export const LanguageSearch: React.FC<{
  onChange: (value: string) => void;
}> = ({ onChange }: { onChange: (value: string) => void }) => {
  const classes = `
  flex w-full items-center px-4 py-4 md:py-2 md:border-none border-primary-700 text-primary-100 focus:outline-no-chrome whitespace-nowrap overflow-ellipsis bg-primary-900
  `;
  return (
    <input
      className={classes}
      onChange={(v) => onChange(v.target.value)}
      style={{ borderBottom: "1px solid var(--color-primary-700)" }}
      placeholder="Search"
      autoFocus
    />
  );
};
