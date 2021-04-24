import React from "react";

export const ErrorMessageButton: React.FC<
  React.ComponentPropsWithoutRef<"button">
> = ({ children, className, style, ...props }) => {
  return (
    <button
      className={`rounded-lg px-3 font-bold text-sm bg-secondary-washed-out ${className}`}
      data-testid="error-msg-btn"
      style={{
        paddingTop: 3,
        paddingBottom: 3,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};
