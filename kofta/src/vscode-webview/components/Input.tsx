import React, { forwardRef } from "react";
import { tw } from "twind";

export const Input = forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
>((props, ref) => {
  return (
    <input
      ref={ref}
      className={tw`py-2 px-3 text-xl text-input bg-input`}
      {...props}
    />
  );
});
