#!/usr/bin/env node
/* eslint-disable no-var -- runnable on very old Node for a clear message */
var major = parseInt(process.version.replace(/^v/, "").split(".")[0], 10);
if (major < 18) {
  console.error(
    "Earthworm requires Node.js 18 or newer (for Prisma and Next.js).",
    "\nCurrent version:",
    process.version,
    "\nFix: nvm install 20 && nvm use 20   (or use Node 18+ from your OS package manager.)"
  );
  process.exit(1);
}
