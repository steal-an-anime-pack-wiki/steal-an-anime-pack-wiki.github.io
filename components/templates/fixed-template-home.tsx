import { NativeAdSlot } from "@/components/integrations/native-ad-slot";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { HomePageDefinition, InternalLink } from "@/config/types";
import { enabledLegalPages, visibleCorePages } from "@/content/registry";
import { renderFixedDocument } from "@/lib/fixed-template/render";
import { homeSchemas } from "@/lib/schema";
import { assetPath, routePath } from "@/lib/urls";
import { fixedFaq, fixedSections, splitFixedFooter } from "./fixed-template-content";

export function FixedTemplateHome({ home }: { home: HomePageDefinition }) {
  const skin = siteSkin();
  const links: InternalLink[] = visibleCorePages.filter((page) => page.slug).map((page) => ({ slug: page.slug, label: page.navLabel }));
  const entries = links.map((link) => ({ href: routePath(link.slug), title: link.label, text: visibleCorePages.find((page) => page.slug === link.slug)?.description || link.label }));
  const rendered = renderFixedDocument({
    skin, page: "home", accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav: links.map((link) => ({ slug: link.slug, label: link.label, href: routePath(link.slug) })),
    homeHref: "/", logoUrl: assetPath(siteConfig.assets.logo),
    officialUrl: siteConfig.game.officialUrl,
    legalLinks: enabledLegalPages.map((page) => ({ slug: page.slug, label: page.navLabel, href: routePath(page.slug) })),
    bannerUrl: assetPath(siteConfig.assets.cover),
    heading: home.hero.heading, lead: home.hero.lead, entries,
    supplementHtml: `<div class="wrap site-home-supplement">${fixedSections(home.sections)}${fixedFaq(home.faq)}</div>`,
  });
  const { body, footer } = splitFixedFooter(rendered.rest);
  return (
    <>
      <JsonLd data={homeSchemas(home)} />
      <div dangerouslySetInnerHTML={{ __html: body }} />
      <div className="site-container"><NativeAdSlot /></div>
      {footer ? <div dangerouslySetInnerHTML={{ __html: footer }} /> : null}
    </>
  );
}
