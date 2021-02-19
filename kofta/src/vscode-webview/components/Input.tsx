import React, { forwardRef } from "react";
import { tw } from "twind";

export const Input = forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & { textarea?: boolean }
>(({ textarea, ...props }, ref) => {
  const cn = tw`py-2 px-3 text-xl text-input bg-input`;

  return textarea ? (
    <textarea ref={ref as any} className={cn} {...(props as any)} />
  ) : (
    <input ref={ref} className={cn} {...props} />
  );
});
