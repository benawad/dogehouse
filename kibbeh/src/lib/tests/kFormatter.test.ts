import { kFormatter } from "../kFormatter";

describe("Number formatter", () => {
  it("should return 1", () => {
    expect(kFormatter(1)).toBe("1");
  });

  it("should return 1k", () => {
    expect(kFormatter(1000)).toBe("1k");
  });

  it("should return 3.8k", () => {
    expect(kFormatter(3821)).toBe("3.8k");
  });

  it("should return 9.9k", () => {
    expect(kFormatter(9999)).toBe("9.9k");
  });

  it("should return 10k", () => {
    expect(kFormatter(10500)).toBe("10k");
  });

  it("should return 101k", () => {
    expect(kFormatter(101800)).toBe("101k");
  });
});
