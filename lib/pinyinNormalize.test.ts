import { describe, expect, it } from "vitest";
import { normalizePinyin, pinyinMatches, stripToneMarks } from "./pinyinNormalize";

describe("stripToneMarks", () => {
  it("strips common marked vowels", () => {
    expect(stripToneMarks("nǐ hǎo")).toBe("ni hao");
  });

  it("handles ü tones as v", () => {
    expect(stripToneMarks("nǚ")).toBe("nv");
  });
});

describe("normalizePinyin", () => {
  it("collapses spaces and lowercases", () => {
    expect(normalizePinyin("  Ni   HAO  ")).toBe("ni hao");
  });

  it("strips tones", () => {
    expect(normalizePinyin("nǐ hǎo")).toBe("ni hao");
  });

  it("maps ü to v", () => {
    expect(normalizePinyin("nǚ")).toBe("nv");
    expect(normalizePinyin("nv")).toBe("nv");
  });
});

describe("pinyinMatches", () => {
  it("accepts toneless vs toned expected", () => {
    expect(pinyinMatches("ni hao", "nǐ hǎo")).toBe(true);
  });

  it("accepts nv vs nü", () => {
    expect(pinyinMatches("nǚ", "nv")).toBe(true);
  });

  it("rejects wrong syllables", () => {
    expect(pinyinMatches("ni hao", "nihao")).toBe(false);
    expect(pinyinMatches("ni hao", "hao ni")).toBe(false);
  });
});
