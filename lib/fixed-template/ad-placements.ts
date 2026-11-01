/** Insert ad mount points into the approved Fixed Template without splitting its HTML tree. */
export const BANNER_MARKER = "data-adsterra-banner";
export const NATIVE_MARKER = "data-adsterra-native";
const banner = '<div data-adsterra-banner class="adsterra-slot adsterra-banner-slot" aria-label="Advertisement"><span class="adsterra-label">Advertisement</span><div class="adsterra-banner-host"></div></div>';
const native = '<div data-adsterra-native class="adsterra-slot adsterra-native-slot" aria-label="Sponsored advertisement"><span class="adsterra-label">Advertisement · Sponsored</span><div id="container-52fd1c6f0d7a6a0d9419d2e9c35d61f6"></div></div>';

function insertAfterTag(source: string, marker: string, tag: string, snippet: string): string {
  const start = source.indexOf(marker);
  if (start < 0) throw new Error("Ad placement target missing: " + marker);
  const end = source.indexOf("</" + tag + ">", start);
  if (end < 0) throw new Error("Ad placement closing tag missing: " + marker);
  const offset = end + tag.length + 3;
  return source.slice(0, offset) + snippet + source.slice(offset);
}

export function fixedAds(body: string, page: "home" | "inner"): string {
  if (page === "home") {
    // Preserve the entire two-column hero and both CTAs.
    const afterHero = insertAfterTag(body, '<section class="leadgrid hero-banner">', "section", banner);
    // The existing five useful guide links are a genuine content block between ads.
    return insertAfterTag(afterHero, '<section class="grid">', "section", native);
  }
  // Do not interrupt H1, short first-screen answer, or the official game source.
  const afterIntro = insertAfterTag(body, '<p class="site-source-note">', "p", banner);
  // The initial real gameplay section is preserved in place between the two ad units.
  return insertAfterTag(afterIntro, '<section class="site-rich-section"', "section", native);
}
