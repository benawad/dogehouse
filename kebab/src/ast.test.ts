import { tokensToString, stringToToken } from "./ast";

test("to tokens", () => {
  expect(stringToToken("abcd")).toEqual([{ t: "text", v: "abcd" }]);
});

test("to string", () => {
  expect(tokensToString([{ t: "text", v: "abcd" }])).toEqual("abcd");
  expect(tokensToString([{ t: "nonexistent-type", v: "abcd" }])).toEqual("");
});
