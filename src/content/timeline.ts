import type { Locale } from "@/i18n/config";
import type { Localized, TimelineEntry } from "./types";

type HopText = Pick<TimelineEntry, "period" | "title" | "note">;

const hops: { host: string; strand: TimelineEntry["strand"]; text: Localized<HopText> }[] = [
  {
    host: "ltp-porto-novo.imi",
    strand: null,
    text: {
      fr: { period: "2018 – 2023", title: "DT IMI, Lycée technique de Porto-Novo", note: "Installation et maintenance informatique, réseaux. Premières lignes de code : PHP, C#, C++." },
      en: { period: "2018 – 2023", title: "IT technician diploma (DT IMI), Porto-Novo technical high school", note: "IT installation and maintenance, networking. First lines of code: PHP, C#, C++." },
    },
  },
  {
    host: "javascript.self-taught",
    strand: "web",
    text: {
      fr: { period: "2019 – 2021", title: "Bascule vers le web, en autodidacte", note: "En parallèle du lycée : freeCodeCamp, Grafikart, OpenClassrooms. Préférence nette pour JavaScript." },
      en: { period: "2019 – 2021", title: "Switching to the web, self-taught", note: "Alongside high school: freeCodeCamp, Grafikart, OpenClassrooms. A clear preference for JavaScript." },
    },
  },
  {
    host: "ci-tech.genie-logiciel",
    strand: "web",
    text: {
      fr: { period: "2023 – 2024", title: "Génie logiciel chez CI-TECH, puis stage", note: "Formation, puis stage de janvier à mai 2024 : un site e-commerce en PHP / Laravel, en équipe." },
      en: { period: "2023 – 2024", title: "Software engineering at CI-TECH, then internship", note: "Training, then an internship from January to May 2024: a PHP / Laravel e-commerce site, built as a team." },
    },
  },
  {
    host: "stack.react-next-ts",
    strand: "api",
    text: {
      fr: { period: "En continu", title: "React, Next.js, TypeScript, Tailwind, Node.js", note: "Puis l’intégration d’API et les services backend comme Supabase." },
      en: { period: "Ongoing", title: "React, Next.js, TypeScript, Tailwind, Node.js", note: "Then API integration and backend services like Supabase." },
    },
  },
  {
    host: "fidevo.friym",
    strand: "web",
    text: {
      fr: { period: "2024 – 2025", title: "Fidevo / Friym, collaborateur", note: "Site web Friym, espace admin, espace ambassadeurs et ChronoFid." },
      en: { period: "2024 – 2025", title: "Fidevo / Friym, team member", note: "Friym website, admin area, ambassador portal and ChronoFid." },
    },
  },
  {
    host: "shopify.ecommerce",
    strand: "ecom",
    text: {
      fr: { period: "2025 – aujourd’hui", title: "Shopify & e-commerce", note: "Boutiques de marque, boutiques de collaborateurs, produits numériques et support d’apps Shopify." },
      en: { period: "2025 – today", title: "Shopify & e-commerce", note: "Brand stores, partner stores, digital products and Shopify app support." },
    },
  },
  {
    host: "junior.dofonsou",
    strand: "now",
    text: {
      fr: { period: "Aujourd’hui", title: "Dev web × business numérique", note: "Comprendre le problème, proposer, développer, livrer de la valeur." },
      en: { period: "Today", title: "Web dev × digital business", note: "Understand the problem, propose, build, deliver value." },
    },
  },
];

export const getTimeline = (lang: Locale): TimelineEntry[] =>
  hops.map(({ text, ...h }) => ({ ...h, ...text[lang] }));
