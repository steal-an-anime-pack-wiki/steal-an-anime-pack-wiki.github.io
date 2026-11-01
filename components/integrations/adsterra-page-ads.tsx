"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { adsterraUnits } from "@/config/adsterra";

type BannerUnit = typeof adsterraUnits.desktop | typeof adsterraUnits.mobile;

/** Official Banner options and external script execute together in a tiny isolated
 * document: the provider may use document.write, which must never touch our page. */
function bannerDocument(unit: BannerUnit): string {
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{padding:0;margin:0;background:transparent;overflow:hidden}body{display:flex;justify-content:center;align-items:flex-start}</style></head><body><script>
  atOptions = {
    'key' : '${unit.key}',
    'format' : 'iframe',
    'height' : ${unit.height},
    'width' : ${unit.width},
    'params' : {}
  };
  </script><script src="${unit.src}"></script></body></html>`;
}

function mountResponsiveBanner(slot: HTMLElement): () => void {
  const host = slot.querySelector<HTMLElement>(".adsterra-banner-host");
  if (!host) return () => {};
  const media = window.matchMedia("(max-width: 767px)");
  let selected = "";

  const update = () => {
    if (!slot.isConnected) return;
    const target = media.matches ? "mobile" : "desktop";
    if (selected === target) return; // No double request on rerenders.
    const unit = target === "mobile" ? adsterraUnits.mobile : adsterraUnits.desktop;
    const frame = document.createElement("iframe");
    frame.title = "Advertisement";
    frame.width = String(unit.width);
    frame.height = String(unit.height);
    frame.loading = "eager";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.style.cssText = "display:block;border:0;max-width:100%;margin:0 auto;overflow:hidden";
    // The official synchronous iframe-format banner script is executed unchanged
    // within this adapter instead of risking document.write on the Next.js document.
    frame.srcdoc = bannerDocument(unit);
    host.replaceChildren(frame); // At most one device-specific iframe exists.
    slot.dataset.adsterraDevice = target;
    selected = target;
  };

  update();
  media.addEventListener("change", update);
  return () => media.removeEventListener("change", update);
}

function mountNative(slot: HTMLElement): void {
  if (slot.dataset.adsterraLoaded === "true") return;
  const container = slot.querySelector<HTMLElement>("#" + adsterraUnits.native.containerId);
  if (!container) throw new Error("Adsterra Native container missing");
  slot.dataset.adsterraLoaded = "true";
  // The official target container exists before the async provider script runs.
  const script = document.createElement("script");
  script.async = true;
  script.setAttribute("data-cfasync", "false");
  script.src = adsterraUnits.native.src;
  script.dataset.adsterraNative = "true";
  slot.appendChild(script);
}

function mountSocialOnce(): void {
  if (document.querySelector("script[data-adsterra-social]")) return;
  const script = document.createElement("script");
  script.async = false;
  script.setAttribute("data-cfasync", "false");
  script.src = adsterraUnits.social.src;
  script.dataset.adsterraSocial = "true";
  document.body.appendChild(script);
}

/** Runs after hydration and each Next.js client-route change; the SSR article HTML,
 * headings, links and footer stay owned by the original Yorich Fixed Template. */
export function AdsterraPageAds() {
  const pathname = usePathname();
  useEffect(() => {
    const banner = document.querySelector<HTMLElement>("[data-adsterra-banner]");
    const native = document.querySelector<HTMLElement>("[data-adsterra-native]");
    const release = banner ? mountResponsiveBanner(banner) : () => {};
    if (native) mountNative(native);
    mountSocialOnce(); // One script per browser document, not one per route.
    return release;
  }, [pathname]);
  return null;
}
