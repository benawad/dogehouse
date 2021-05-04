import { Readable } from "stream";

export const convertStringToStream = (stringToConvert: string) => {
  const stream = new Readable();
  stream._read = () => {};
  stream.push(stringToConvert);
  stream.push(null);

  return stream;
};
