/**
 * Scans scripts/courses/*.json for statements missing englishGloss (English prompt).
 * Exit 1 if any missing — use after editing course JSON.
 */
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "courses");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
let missing = [];

for (const file of files) {
  const data = JSON.parse(
    fs.readFileSync(path.join(dir, file), "utf8")
  );
  if (!Array.isArray(data)) continue;
  data.forEach((row, i) => {
    if (row.englishGloss == null || String(row.englishGloss).trim() === "") {
      missing.push(`${file} #${i} chinese=${JSON.stringify(row.chinese)}`);
    }
  });
}

if (missing.length) {
  console.error(
    "Missing englishGloss (English prompt) for",
    missing.length,
    "statement(s):"
  );
  missing.slice(0, 50).forEach((m) => console.error(" ", m));
  if (missing.length > 50) {
    console.error(" ... and", missing.length - 50, "more");
  }
  process.exit(1);
}

console.log("All statements in scripts/courses/*.json have englishGloss.");
