import type { Locale } from "@/i18n/config";
import type { Localized, Service, Strand } from "./types";

type ServiceText = Pick<Service, "title" | "pitch" | "items">;

const sources: { slug: string; strand: Strand | null; visible: boolean; text: Localized<ServiceText> }[] = [
  {
    slug: "sites",
    strand: "web",
    visible: true,
    text: {
      fr: {
        title: "Sites & applications web",
        pitch: "Des interfaces modernes, rapides et maintenables.",
        items: ["Sites web professionnels", "Interfaces React & Next.js", "Frontend TypeScript + Tailwind", "UX adaptée au projet"],
      },
      en: {
        title: "Websites & web apps",
        pitch: "Modern, fast, maintainable interfaces.",
        items: ["Professional websites", "React & Next.js interfaces", "TypeScript + Tailwind frontend", "UX tailored to the project"],
      },
    },
  },
  {
    slug: "api",
    strand: "api",
    visible: true,
    text: {
      fr: {
        title: "Intégration d’API",
        pitch: "Brancher vos services sans casser l’existant.",
        items: ["API et services externes", "Connexion interface ↔ backend", "Résolution de problèmes techniques", "Maintenance d’interfaces existantes"],
      },
      en: {
        title: "API integration",
        pitch: "Connect your services without breaking what works.",
        items: ["Third-party APIs and services", "Frontend ↔ backend wiring", "Technical troubleshooting", "Maintaining existing interfaces"],
      },
    },
  },
  {
    slug: "shopify",
    strand: "ecom",
    visible: true,
    text: {
      fr: {
        title: "Shopify & e-commerce",
        pitch: "Une boutique qui fonctionne comme le client l’attend.",
        items: ["Création & personnalisation de boutique", "Sections et interfaces sur mesure", "Configuration de fonctionnalités", "Amélioration du parcours d’achat"],
      },
      en: {
        title: "Shopify & e-commerce",
        pitch: "A store that works the way your customers expect.",
        items: ["Store setup & customization", "Custom sections and interfaces", "Feature configuration", "Better checkout journeys"],
      },
    },
  },
  {
    slug: "audit",
    strand: null,
    visible: true,
    text: {
      fr: {
        title: "Audit & accompagnement",
        pitch: "Un regard technique avant de choisir.",
        items: ["Analyse des besoins", "Identification des problèmes", "Recommandations", "Choix et intégration de solutions"],
      },
      en: {
        title: "Audit & guidance",
        pitch: "A technical second opinion before you decide.",
        items: ["Needs analysis", "Finding what’s broken", "Recommendations", "Choosing and integrating tools"],
      },
    },
  },
];

export const getServices = (lang: Locale): Service[] =>
  sources.filter((s) => s.visible).map(({ text, ...s }) => ({ ...s, ...text[lang] }));
