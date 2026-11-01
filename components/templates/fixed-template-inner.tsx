import { fixedAds } from "@/lib/fixed-template/ad-placements";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { SeoPageDefinition } from "@/config/types";
import { enabledLegalPages, getRelatedPages, visibleCorePages } from "@/content/registry";
import { esc, renderFixedDocument } from "@/lib/fixed-template/render";
import { pageSchemas } from "@/lib/schema";
import { assetPath, routePath } from "@/lib/urls";
import { fixedFaq, fixedSections, splitFixedFooter } from "./fixed-template-content";

export function FixedTemplateInner({ page }: { page: SeoPageDefinition }) {
  const skin = siteSkin();
  const nav = visibleCorePages.filter((item) => item.slug).map((item) => ({ slug: item.slug, label: item.navLabel, href: routePath(item.slug) }));
  const related = getRelatedPages(page);
  const relatedHtml = related.length
    ? `<section class="site-rich-section site-related" id="related"><h2>Related Guides</h2><nav aria-label="Related guides" class="site-context-links">${related.map((item) =>
      `<a href="${esc(routePath(item.slug))}"><strong>${esc(item.navLabel)}</strong><small>${esc(item.description)}</small></a>`).join("")}</nav></section>`
    : "";
  const articleHtml = `<p class="site-article-lead">${esc(page.hero.lead)}</p>` +
    `<p class="site-source-note">Game: <a href="${esc(siteConfig.game.officialUrl ?? "#")}" rel="noopener noreferrer" target="_blank">official Roblox experience by Anime Tuff Games</a> · Guide reviewed ${esc(page.lastReviewed)}.</p>` +
    fixedSections(page.sections) + fixedFaq(page.faq) + relatedHtml;
  const rendered = renderFixedDocument({
    skin, page: "inner", accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav, currentSlug: page.slug, homeHref: "/",
    logoUrl: assetPath(siteConfig.assets.logo),
    officialUrl: siteConfig.game.officialUrl,
    legalLinks: enabledLegalPages.map((item) => ({ slug: item.slug, label: item.navLabel, href: routePath(item.slug) })),
    heading: page.hero.heading, lead: page.hero.lead, articleHtml,
  });
  const { body, footer } = splitFixedFooter(rendered.rest);
  const adBody = fixedAds(body, "inner");
  return (
    <>
      <JsonLd data={pageSchemas(page)} />
      <div dangerouslySetInnerHTML={{ __html: adBody }} />
      {footer ? <div dangerouslySetInnerHTML={{ __html: footer }} /> : null}
    </>
  );
}
