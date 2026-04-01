/**
 * One-shot: legacy { chinese, english, soundmark } -> { chinese, pinyin, soundmark, englishGloss? }
 * Uses pinyin-pro from chinese text. Re-run safe on already-migrated rows (keeps explicit pinyin).
 */
const fs = require("fs");
const path = require("path");
const { pinyin } = require("pinyin-pro");

const dir = path.join(__dirname, "courses");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

for (const file of files) {
  const fp = path.join(dir, file);
  const raw = fs.readFileSync(fp, "utf8");
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) {
    console.warn(`skip (not array): ${file}`);
    continue;
  }
  const out = data.map((row) => {
    if (row.pinyin != null && row.soundmark != null) {
      const o = {
        chinese: row.chinese,
        pinyin: row.pinyin,
        soundmark: row.soundmark,
      };
      const gloss = row.englishGloss ?? row.english;
      if (gloss) o.englishGloss = gloss;
      return o;
    }
    const toneless = pinyin(row.chinese, {
      type: "array",
      toneType: "none",
      segment: true,
    });
    const toned = pinyin(row.chinese, {
      type: "array",
      toneType: "symbol",
      segment: true,
    });
    const o = {
      chinese: row.chinese,
      pinyin: toneless.join(" "),
      soundmark: toned.join(" "),
    };
    const gloss = row.englishGloss ?? row.english;
    if (gloss) o.englishGloss = gloss;
    return o;
  });
  fs.writeFileSync(fp, JSON.stringify(out, null, "\t") + "\n");
  console.log(`migrated ${file}`);
}
