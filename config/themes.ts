import type { ThemeConfig, ThemePresetName } from "./types";

export const themes: Record<string, ThemeConfig> = {
  "obsidian-red": {
    name: "obsidian-red" as ThemePresetName,
    label: "Site Theme",
    description: "Selected site theme",
    tokens: {
  "background": "0 0% 96%",
  "foreground": "0 0% 7%",
  "card": "0 0% 100%",
  "card-foreground": "0 0% 7%",
  "primary": "356 85% 57%",
  "primary-foreground": "0 0% 0%",
  "secondary": "0 0% 89%",
  "muted": "0 0% 91%",
  "muted-foreground": "0 0% 7%",
  "border": "0 0% 80%",
  "radius": ".45rem",
  "card-shadow": "0 14px 36px rgba(15, 18, 24, .08)",
  "hero-gradient": "linear-gradient(90deg, hsl(356 85% 57% / .16), transparent 46%)",
  "background-pattern": "none",
  "font-sans": "\"Source Sans 3\", ui-sans-serif, system-ui, sans-serif",
  "font-heading": "\"Source Sans 3\", ui-sans-serif, system-ui, sans-serif",
  "heading-weight": "700",
  "heading-letter-spacing": "-0.02em"
},
  },
};
