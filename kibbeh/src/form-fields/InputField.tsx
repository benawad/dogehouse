import { useField } from "formik";
import React from "react";
import { Input } from "../ui/Input";
import { InputErrorMsg } from "../ui/InputErrorMsg";

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
    rows?: number;
  }
> = ({ label, textarea, errorMsg, ref: _, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className={`h-full w-full block`}>
      {label ? <div className={`mb-2 text-primary-300`}>{label}</div> : null}
      <Input error={meta.error} textarea={textarea} {...field} {...props} />
      {meta.error && meta.touched ? (
        <div className={`mt-1`}>
          <InputErrorMsg>{errorMsg || meta.error}</InputErrorMsg>
        </div>
      ) : null}
    </div>
  );
};
