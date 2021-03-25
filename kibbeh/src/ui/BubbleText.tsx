import * as React from "react";

export interface BubbleTextProps {
  live?: boolean;
  children: React.ReactNode;
}

export const BubbleText: React.FC<BubbleTextProps> = ({ live, children }) => {
  return (
    <div
      className="text-primary-200 font-bold items-center"
      data-testid="bubble-text"
    >
      <div
        className={`inline-block mr-2 w-2 h-2 rounded-full ${
          live ? "bg-accent" : "bg-primary-300"
        }`}
      ></div>
      {children}
    </div>
  );
};
