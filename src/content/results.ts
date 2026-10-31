import type { Locale } from "@/i18n/config";
import type { Localized, Strand } from "./types";

/**
 * Chiffres affichés sur l'accueil. Règle : uniquement des chiffres vérifiés, toujours avec leur source.
 * Pas de pourcentage de croissance quand les périodes comparées ne sont pas équivalentes.
 */
export interface ResultCard {
  id: string;
  strand: Strand;
  kicker: string;
  title: string;
  text: string;
  figures: { value: string; label: string }[];
  source: string;
  /** Slug de l'étude de cas liée, s'il y en a une. */
  caseStudy?: string;
}

const cards: Localized<ResultCard[]> = {
  fr: [
    {
      id: "chariow",
      strand: "ecom",
      kicker: "Projet personnel · Chariow",
      title: "Ma boutique de produits numériques.",
      text: "Créée et animée seul, avec de la pub et les réseaux sociaux.",
      figures: [
        { value: "581", label: "ventes" },
        { value: "1 162 000", label: "FCFA de revenu" },
        { value: "3", label: "produits" },
      ],
      source: "Source : tableau de bord Chariow, 1er février – 9 mai 2026",
      caseStudy: "boutique-produits-numeriques",
    },
    {
      id: "shopify",
      strand: "api",
      kicker: "Exemple · Shopify",
      title: "Une boutique que j’accompagne.",
      text: "Aperçu des ventes sur une boutique Shopify suivie. La marque reste confidentielle.",
      figures: [
        { value: "CA$5,298.95", label: "ventes totales" },
        { value: "CA$4,618.47", label: "ventes nettes" },
        { value: "CA$6,904.87", label: "ventes brutes" },
        { value: "41", label: "commandes" },
      ],
      source: "Source : tableau de bord Shopify, 1er–16 avril 2026. Chiffres observés, sans attribution de croissance.",
      caseStudy: "shopify-ecommerce",
    },
  ],
  en: [
    {
      id: "chariow",
      strand: "ecom",
      kicker: "Personal project · Chariow",
      title: "My digital products store.",
      text: "Built and run solo, with paid ads and social media.",
      figures: [
        { value: "581", label: "sales" },
        { value: "1,162,000", label: "XOF revenue (≈ €1,770)" },
        { value: "3", label: "products" },
      ],
      source: "Source: Chariow dashboard, Feb 1 – May 9, 2026",
      caseStudy: "boutique-produits-numeriques",
    },
    {
      id: "shopify",
      strand: "api",
      kicker: "Example · Shopify",
      title: "A store I support.",
      text: "Sales snapshot from a Shopify store I work on. The brand stays confidential.",
      figures: [
        { value: "CA$5,298.95", label: "total sales" },
        { value: "CA$4,618.47", label: "net sales" },
        { value: "CA$6,904.87", label: "gross sales" },
        { value: "41", label: "orders" },
      ],
      source: "Source: Shopify dashboard, April 1–16, 2026. Observed figures, no growth claimed.",
      caseStudy: "shopify-ecommerce",
    },
  ],
};

export const getResults = (lang: Locale) => cards[lang];
