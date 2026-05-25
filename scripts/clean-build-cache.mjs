import { rmSync } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const targets = [".next", ".open-next"];

for (const target of targets) {
  const fullPath = path.join(projectRoot, target);
  rmSync(fullPath, { recursive: true, force: true });
  console.log(`Removed ${target} if it existed.`);
}
