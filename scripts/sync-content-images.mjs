// Copies every image in /content into /public/content so the site can serve
// it (e.g. content/projects/robot.png -> /content/projects/robot.png).
// Runs automatically before `npm run dev` and `npm run build`.
// public/content is generated: it's git-ignored and rebuilt from scratch here.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const from = path.join(root, "content");
const to = path.join(root, "public", "content");
const IMAGE = /\.(png|jpe?g|webp|avif|gif|svg)$/i;

fs.rmSync(to, { recursive: true, force: true });

let count = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const src = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(src);
    else if (IMAGE.test(entry.name)) {
      const dest = path.join(to, path.relative(from, src));
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      count++;
    }
  }
}

if (fs.existsSync(from)) walk(from);
console.log(`Synced ${count} content image${count === 1 ? "" : "s"} to public/content`);
