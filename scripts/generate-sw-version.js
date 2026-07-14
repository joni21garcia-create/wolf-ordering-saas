const fs = require("fs");
const path = require("path");

const swPath = path.join(
  process.cwd(),
  "public",
  "sw.js"
);

const version =
  process.env.VERCEL_GIT_COMMIT_SHA ||
  Date.now().toString();

let sw = fs.readFileSync(swPath, "utf8");

sw = sw.replace(
  /const VERSION = ".*?";/,
  `const VERSION = "${version}";`
);

fs.writeFileSync(swPath, sw);

console.log("✅ SW Version:", version);