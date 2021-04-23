import { kFormatter } from "../kFormatter";

describe("Number formatter", () => {
  it("should return 1", () => {
    expect(kFormatter(1)).toBe("1");
  });
});
