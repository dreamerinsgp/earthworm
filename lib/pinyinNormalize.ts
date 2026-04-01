/**
 * Normalize pinyin for comparison: case, whitespace, tone marks, ü/nü vs nv.
 */

const VOWEL_TONE_TO_PLAIN: Record<string, string> = {
  ā: "a",
  á: "a",
  ǎ: "a",
  à: "a",
  ē: "e",
  é: "e",
  ě: "e",
  è: "e",
  ī: "i",
  í: "i",
  ǐ: "i",
  ì: "i",
  ō: "o",
  ó: "o",
  ǒ: "o",
  ò: "o",
  ū: "u",
  ú: "u",
  ǔ: "u",
  ù: "u",
  ǖ: "v",
  ǘ: "v",
  ǚ: "v",
  ǜ: "v",
  ü: "v",
  Ǖ: "v",
  Ǘ: "v",
  Ǚ: "v",
  Ǜ: "v",
};

export function stripToneMarks(s: string): string {
  let out = "";
  for (const ch of s) {
    out += VOWEL_TONE_TO_PLAIN[ch] ?? ch;
  }
  return out;
}

/** Collapse whitespace, lowercase, strip tones, map ü-like to v for compare. */
export function normalizePinyin(s: string): string {
  const trimmed = s.trim().toLowerCase().replace(/\s+/g, " ");
  const noTones = stripToneMarks(trimmed);
  return noTones.replace(/ü/g, "v");
}

export function pinyinMatches(expected: string, userInput: string): boolean {
  return normalizePinyin(userInput) === normalizePinyin(expected);
}
