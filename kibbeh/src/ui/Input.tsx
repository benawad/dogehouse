import React, { forwardRef } from "react";

export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  textarea?: boolean;
  rows?: number;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, textarea, error, ...props }, ref) => {
    const cn = `w-full py-2 pr-4 bg-transparent text-primary-100 placeholder-primary-300 focus:outline-none ${className} ${
      error ? `ring-1 ring-secondary` : ``
    }`;

    return textarea ? (
      <textarea ref={ref as any} className={cn} {...(props as any)} />
    ) : (
      <input ref={ref} className={cn} {...props} />
    );
  }
);

Input.displayName = "Input";
