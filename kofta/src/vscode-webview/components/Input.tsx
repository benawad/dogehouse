import React, { forwardRef, useState } from "react";
import { tw } from "twind";

export const Input = forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & { textarea?: boolean; hint?: string }
>(({ textarea, hint, ...props }, ref) => {
  const cn = tw`py-2 px-3 text-xl text-input bg-input`;

  const [showHint, setShowHint] = useState(false);

  return (
    <div className={tw``}>
      {textarea ? (
        <textarea
          ref={ref as any}
          className={cn}
          {...(props as any)}
          onFocus={() => setShowHint(true)}
          onBlur={() => setShowHint(false)}
        />
      ) : (
        <input
          ref={ref}
          className={cn}
          {...props}
          onFocus={() => setShowHint(true)}
          onBlur={() => setShowHint(false)}
        />
      )}
      {hint && showHint ? (
        <span className={tw`text-sm text-tmpC1`}>{hint}</span>
      ) : null}
    </div>
  );
});
