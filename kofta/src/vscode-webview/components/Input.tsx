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

  const hintEvents = {
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      !props.onFocus || props.onFocus(e);
      setShowHint(true);
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      !props.onBlur || props.onBlur(e);
      setShowHint(false);
    },
  };

  return (
    <div className={tw``}>
      {textarea ? (
        <textarea
          ref={ref as any}
          className={cn}
          {...(props as any)}
          {...hintEvents}
        />
      ) : (
        <input ref={ref} className={cn} {...props} {...hintEvents} />
      )}
      {hint && showHint ? (
        <span className={tw`text-sm text-tmpC1`}>{hint}</span>
      ) : null}
    </div>
  );
});
