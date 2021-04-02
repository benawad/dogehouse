/* eslint-disable no-unused-expressions */
import React, { forwardRef } from "react";

export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  textarea?: boolean;
  rows?: number;
  error?: string;
  transparent?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, textarea, error, transparent, ...props }, ref) => {
    let cn = `w-full py-2 px-4 rounded-8 text-primary-100 placeholder-primary-300 focus:outline-none ${className} `;

    transparent ? (cn += `bg-transparent`) : (cn += `bg-primary-700`);
    error ? (cn += `ring-1 ring-secondary`) : null;

    return textarea ? (
      <textarea
        ref={ref as any}
        className={cn}
        {...(props as any)}
        data-testid="textarea"
      />
    ) : (
      <input ref={ref} className={cn} {...props} data-testid="input" />
    );
  }
);

Input.displayName = "Input";
