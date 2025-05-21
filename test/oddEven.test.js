const { oddEven } = require("./oddEven");

describe("odd or Even", () => {
  it("should return both are even when both numbers are even", () => {
    const result = oddEven(2, 4);
    expect(result).toBe("2 and 4 are both even");
  });

  it("should return both are odd when both numbers are odd", () => {
    const result = oddEven(3, 5);
    expect(result).toBe("3 and 5 are both odd");
  });

  it("should return one is odd and one is even when one number is odd and the other is even", () => {
    const result = oddEven(2, 3);
    expect(result).toBe("One is odd and one is even");
  });
});
