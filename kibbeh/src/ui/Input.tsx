import React, { forwardRef } from "react";

export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  textarea?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, textarea, ...props }, ref) => {
    const cn = `w-full py-2 pr-4 bg-transparent text-primary-100 placeholder-primary-300 focus:outline-none ${className}`;

    return textarea ? (
      <textarea ref={ref as any} className={cn} {...(props as any)} />
    ) : (
      <input ref={ref} className={cn} {...props} />
    );
  }
);

Input.displayName = "Input";
