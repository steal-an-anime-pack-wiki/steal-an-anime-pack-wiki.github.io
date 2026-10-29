import type { FaqItem, PageSection } from "@/config/types";
import { esc } from "@/lib/fixed-template/render";
import { routePath } from "@/lib/urls";

/** Semantic, server-rendered guide markup within the approved fixed Yorich skin. */
export function fixedSections(sections: PageSection[]): string {
  return sections.map((section) => {
    const prose = [section.intro, ...(section.paragraphs ?? [])].filter(Boolean)
      .map((text) => `<p>${esc(text!)}</p>`).join("");
    const subsections = section.subsections?.length
      ? `<div class="site-content-grid">${section.subsections.map((sub) => {
        const text = sub.paragraphs.map((item) => `<p>${esc(item)}</p>`).join("");
        const bullets = sub.bullets?.length ? `<ul>${sub.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : "";
        return `<div class="site-content-card"><h3>${esc(sub.heading)}</h3>${text}${bullets}</div>`;
      }).join("")}</div>` : "";
    const steps = section.steps?.length ? `<ol class="site-action-steps">${section.steps.map((step) =>
      `<li><h3>${esc(step.heading)}</h3><p>${esc(step.description)}</p></li>`).join("")}</ol>` : "";
    const data = section.table ? `<div class="site-responsive-table"><table><caption>${esc(section.table.caption)}</caption><thead><tr>${section.table.columns.map((c) => `<th scope="col">${esc(c)}</th>`).join("")}</tr></thead><tbody>${section.table.rows.map((row) => `<tr>${row.map((val) => `<td>${esc(val)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : "";
    const links = section.links?.length ? `<nav class="site-context-links" aria-label="Related gameplay tasks">${section.links.map((link) =>
      `<a href="${esc(routePath(link.slug))}"><strong>${esc(link.label)}</strong>${link.description ? `<small>${esc(link.description)}</small>` : ""}</a>`).join("")}</nav>` : "";
    return `<section class="site-rich-section" id="${esc(section.id)}"><h2>${esc(section.heading)}</h2>${prose}${subsections}${steps}${data}${links}</section>`;
  }).join("");
}

export function fixedFaq(faq: FaqItem[] | undefined): string {
  if (!faq?.length) return "";
  return `<section class="site-rich-section site-faq" id="faq"><h2>Frequently Asked Questions</h2>${faq.map((item) =>
    `<div class="site-faq-item"><h3>${esc(item.question)}</h3><p>${esc(item.answer)}</p></div>`).join("")}</section>`;
}

export function splitFixedFooter(rest: string): { body: string; footer: string } {
  const index = rest.indexOf("<footer");
  return index < 0 ? { body: rest, footer: "" } : { body: rest.slice(0,index), footer: rest.slice(index) };
}
