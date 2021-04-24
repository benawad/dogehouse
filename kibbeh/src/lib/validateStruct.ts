import { Struct } from "superstruct";

export const validateStruct = <T>(struct: Struct<T>) => (values: T) => {
  const errors: Record<string, string> = {};
  const [result] = struct.validate(values);
  for (const failure of result?.failures() || []) {
    errors[failure.path[0]] = failure.message;
  }
  return errors;
};
