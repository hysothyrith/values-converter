import { describe, it, expect, test } from "vitest";
import { charToNumericIndex, lettersToNumericIndex } from "./lib";

describe("charToNumericIndex", () => {
  it("should return the correct index", () => {
    expect(charToNumericIndex("a")).toBe(0);
    expect(charToNumericIndex("A")).toBe(0);
    expect(charToNumericIndex("b")).toBe(1);
    expect(charToNumericIndex("B")).toBe(1);
    expect(charToNumericIndex("z")).toBe(25);
    expect(charToNumericIndex("Z")).toBe(25);
  });
});

describe("lettersToNumericIndex", () => {
  it("should return the correct index", () => {
    expect(lettersToNumericIndex("a")).toBe(0);
    expect(lettersToNumericIndex("A")).toBe(0);

    expect(lettersToNumericIndex("aa")).toBe(26);
    expect(lettersToNumericIndex("AA")).toBe(26);
    expect(lettersToNumericIndex("aA")).toBe(26);

    expect(lettersToNumericIndex("AB")).toBe(27);
    expect(lettersToNumericIndex("AZ")).toBe(51);

    expect(lettersToNumericIndex("BA")).toBe(52);
    expect(lettersToNumericIndex("Bb")).toBe(53);
  });
});
