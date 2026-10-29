#!/usr/bin/env node
// Production guard for the approved GitHub Pages user-domain and six READY routes.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const origin = "https://steal-an-anime-pack-wiki.github.io";
const obsolete = /https?:\/\/steal-an-anime-pack\.github\.io(?:\/|\b)/i;
const output = join(process.cwd(), "out");
const paths = ["", "how-to-play", "how-to-steal-packs", "pack-merging", "how-to-open-packs", "speed-training"];
const errors = [];
function load(relativePath) {
  const path = join(output, relativePath);
  if (!existsSync(path)) {
    errors.push(`Missing exported file: ${relativePath}`);
    return "";
  }
  return readFileSync(path, "utf8");
}

for (const slug of paths) {
  const name = slug ? `${slug}/index.html` : "index.html";
  const html = load(name);
  if (!html) continue;
  const expectedCanonical = `${origin}/${slug ? `${slug}/` : ""}`;
  const canonical = html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i)?.[0] || "";
  if (!canonical.includes(`href="${expectedCanonical}"`)) {
    errors.push(`${name}: canonical does not point to ${expectedCanonical}`);
  }
  if (!/<h1(?:\s|>)/i.test(html)) errors.push(`${name}: missing H1`);
  if (obsolete.test(html)) errors.push(`${name}: obsolete domain found`);
}
const sitemap = load("sitemap.xml");
const robots = load("robots.txt");
const manifest = load("manifest.webmanifest");
for (const slug of paths) {
  const url = `${origin}/${slug ? `${slug}/` : ""}`;
  if (!sitemap.includes(url)) errors.push(`Sitemap missing ${url}`);
}
if (!robots.includes(`${origin}/sitemap.xml`)) errors.push("robots.txt sitemap points to a different domain");
if (/Disallow:\s*\/\s*(?:\r?\n|$)/i.test(robots)) errors.push("robots.txt disallows the site root");
for (const [name, text] of [["sitemap.xml", sitemap], ["robots.txt", robots], ["manifest.webmanifest", manifest]]) {
  if (obsolete.test(text)) errors.push(`${name}: obsolete domain found`);
}
if (existsSync(join(output, "CNAME"))) errors.push("Unexpected CNAME in a github.io user-site deployment");
if (errors.length) {
  errors.forEach((error) => console.error(`FAIL: ${error}`));
  process.exit(1);
}
console.log(`Domain check PASS: ${paths.length} indexable pages, canonical, sitemap, robots, no CNAME.`);
