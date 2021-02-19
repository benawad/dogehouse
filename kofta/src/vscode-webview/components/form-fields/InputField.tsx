import { useField } from "formik";
import React from "react";
import { tw } from "twind";
import { Input } from "../Input";
import { InputErrorMsg } from "../InputErrorMsg";

export const InputField: React.FC<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & {
    name: string;
    errorMsg?: string;
    label?: string;
    textarea?: boolean;
    altErrorMsg?: string;
  }
> = ({ label, textarea, errorMsg, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div>
      {label ? <div className={tw`mb-2`}>{label}</div> : null}
      <Input textarea={textarea} {...field} />
      {meta.error && meta.touched ? (
        <div className={tw`mt-1`}>
          <InputErrorMsg>{errorMsg || meta.error}</InputErrorMsg>
        </div>
      ) : null}
    </div>
  );
};
