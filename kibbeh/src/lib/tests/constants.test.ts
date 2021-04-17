import { linkRegex } from "../constants";

describe("Link Regex", () => {
  test("Link Regex Test 1(Only Link)", () => {
    const msg1 = "https://abc.com";

    expect(linkRegex.test(msg1)).toBeTruthy();
  });

  test("Link Regex Test 2(Link between text)", () => {
    const msg2 = "some text https://abc.com other text";

    expect(linkRegex.test(msg2)).toBeTruthy();
  });

  test("Link Regex Test 3(Link in brackets)", () => {
    const msg3 = "(https://abc.com)";

    expect(linkRegex.test(msg3)).toBeFalsy();
  });

  test("Link Regex Test 4(Link with parameters)", () => {
    const msg4 = "text after https://abc.com/queries?parameter text after";

    expect(linkRegex.test(msg4)).toBeTruthy();
  });
});
