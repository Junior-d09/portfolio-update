import type { Locale } from "@/i18n/config";
import type { Localized, LogoId, SkillGroup, Strand } from "./types";

type Item = { name: string | Localized<string>; logo: LogoId };

const groups: { id: string; strand: Strand | null; name: Localized<string>; line: Localized<string>; items: Item[] }[] = [
  {
    id: "frontend",
    strand: "web",
    name: { fr: "Frontend", en: "Frontend" },
    line: { fr: "Interfaces rapides, propres et maintenables.", en: "Fast, clean, maintainable interfaces." },
    items: [
      { name: "React", logo: "react" },
      { name: "Next.js", logo: "next" },
      { name: "TypeScript", logo: "ts" },
      { name: "JavaScript", logo: "js" },
      { name: "Tailwind CSS", logo: "tailwind" },
      { name: "Framer Motion", logo: "motion" },
    ],
  },
  {
    id: "backend",
    strand: "api",
    name: { fr: "Backend & API", en: "Backend & APIs" },
    line: {
      fr: "Ce qui tourne derrière l’interface, et les ponts entre services.",
      en: "What runs behind the interface, and the bridges between services.",
    },
    items: [
      { name: "Node.js", logo: "node" },
      { name: "Express.js", logo: "express" },
      { name: "MongoDB", logo: "mongo" },
      { name: "Supabase", logo: "supabase" },
      { name: { fr: "API REST", en: "REST APIs" }, logo: "rest" },
      { name: "PHP", logo: "php" },
      { name: "Laravel", logo: "laravel" },
      { name: "MySQL", logo: "mysql" },
    ],
  },
  {
    id: "tools",
    strand: null,
    name: { fr: "Outils & DevOps", en: "Tools & DevOps" },
    line: { fr: "Versionner, tester, livrer.", en: "Version, test, ship." },
    items: [
      { name: "Git", logo: "git" },
      { name: "GitHub", logo: "github" },
      { name: "VS Code", logo: "vscode" },
      { name: "Postman", logo: "postman" },
      { name: "Vercel", logo: "vercel" },
      { name: "Netlify", logo: "netlify" },
    ],
  },
  {
    id: "ecommerce",
    strand: "ecom",
    name: { fr: "E-commerce & acquisition", en: "E-commerce & growth" },
    line: { fr: "Vendre en ligne, et faire venir les bons clients.", en: "Selling online, and bringing in the right customers." },
    items: [
      { name: "Shopify", logo: "shopify" },
      { name: "Chariow", logo: "chariow" },
      { name: "Facebook Ads", logo: "facebook" },
      { name: "TikTok Ads", logo: "tiktok" },
      { name: "Google Ads", logo: "gads" },
    ],
  },
];

export const getSkills = (lang: Locale): SkillGroup[] =>
  groups.map((g) => ({
    id: g.id,
    strand: g.strand,
    name: g.name[lang],
    line: g.line[lang],
    items: g.items.map((i) => ({ logo: i.logo, name: typeof i.name === "string" ? i.name : i.name[lang] })),
  }));

/** Les technos mises en avant dans le hero. */
export const heroTech: { name: string; logo: LogoId }[] = [
  { name: "React", logo: "react" },
  { name: "Next.js", logo: "next" },
  { name: "TypeScript", logo: "ts" },
  { name: "Tailwind CSS", logo: "tailwind" },
  { name: "Node.js", logo: "node" },
  { name: "Shopify", logo: "shopify" },
];
