import React, { forwardRef } from "react";

export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  textarea?: boolean;
  rows?: number;
  error?: string;
  transparent?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, textarea, error, transparent, ...props }, ref) => {
    const cn = `w-full py-2 px-4 rounded-8 ${
      transparent ? `bg-transparent` : `bg-primary-700`
    } text-primary-100 placeholder-primary-300 focus:outline-none ${className} ${
      error ? `ring-1 ring-secondary` : ``
    }`;

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
