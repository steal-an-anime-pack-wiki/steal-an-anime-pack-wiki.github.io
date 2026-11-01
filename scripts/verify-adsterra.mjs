#!/usr/bin/env node
// Production-only ad integration guard; no mocking and no claims about impressions.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
const out = join(process.cwd(), "out");
const slugs = ["", "how-to-play", "how-to-steal-packs", "pack-merging", "how-to-open-packs", "speed-training"];
const urls = [
  "https://bauval.org/22/7829fa60ded529d242b4501d0705cefb",
  "https://bauval.org/22/2b8fa2f7f6c25f987b942285ef6111ee",
  "https://bauval.org/21/52fd1c6f0d7a6a0d9419d2e9c35d61f6",
  "https://bauval.org/14/c46cd0f834aacc8064a3f4b19cd736d8",
];
const errors = [];
for (const slug of slugs) {
  const name = slug ? `${slug}/index.html` : "index.html";
  const filename = join(out, name);
  if (!existsSync(filename)) { errors.push("Missing page " + name); continue; }
  const html = readFileSync(filename, "utf8");
  for (const marker of ["data-adsterra-banner", "data-adsterra-native"]) {
    const count = html.split(marker).length - 1;
    if (count !== 1) errors.push(name + ": expected 1 " + marker + ", got " + count);
  }
  if (!html.includes('container-52fd1c6f0d7a6a0d9419d2e9c35d61f6')) errors.push(name + ": missing official native container");
  if (html.indexOf('data-adsterra-banner') > html.indexOf('data-adsterra-native')) errors.push(name + ": Banner / Native order reversed");
  if (html.indexOf("data-adsterra-native") > html.indexOf("<footer")) errors.push(name + ": Native after footer");
}
function javascriptFiles(folder) {
  if (!existsSync(folder)) return [];
  return readdirSync(folder).flatMap((name) => {
    const file = join(folder, name);
    if (statSync(file).isDirectory()) return javascriptFiles(file);
    return /\.js$/.test(name) ? [file] : [];
  });
}
const js = javascriptFiles(join(out, "_next")).map((f) => readFileSync(f, "utf8")).join("\n");
for (const url of urls) if (!js.includes(url)) errors.push("Client build missing official Adsterra URL " + url);
if (errors.length) { errors.forEach((e) => console.error("FAIL: " + e)); process.exit(1); }
console.log("Adsterra code guard PASS: 6 page placements and 4 official unit URLs bundled (not proof of network fill).");
