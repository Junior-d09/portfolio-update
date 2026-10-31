import type { Strand } from "@/content/types";

/**
 * Les trois « fibres » du profil. Couleurs tirées du code couleur des fibres optiques (TIA-598).
 * Noms et descriptions traduits : src/i18n/dictionaries.ts (strands).
 * Classes complètes (pas de concaténation) pour que Tailwind les détecte.
 */
export const strands: Record<
  Strand,
  { label: string; hex: string; text: string; bg: string; border: string }
> = {
  web: {
    label: "WEB",
    hex: "#9466FF",
    text: "text-violet-text",
    bg: "bg-violet",
    border: "border-violet",
  },
  api: {
    label: "API",
    hex: "#3DD6C8",
    text: "text-aqua",
    bg: "bg-aqua",
    border: "border-aqua",
  },
  ecom: {
    label: "E-COM",
    hex: "#FF8B42",
    text: "text-orange-text",
    bg: "bg-orange",
    border: "border-orange",
  },
};

export const strandOrder: Strand[] = ["web", "api", "ecom"];

export const strandText = (s: Strand | null | "now") =>
  s === "now" ? "text-text" : s ? strands[s].text : "text-muted";
export const strandBg = (s: Strand | null) => (s ? strands[s].bg : "bg-text");

/** Mappe les services vers leur ancre sur la page Services. */
export const strandServiceAnchor: Record<Strand, string> = { web: "sites", api: "api", ecom: "shopify" };
