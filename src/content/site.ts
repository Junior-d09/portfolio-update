import type { Locale } from "@/i18n/config";
import type { Localized } from "./types";

const GITHUB = "https://github.com/Junior-d09";

export const site = {
  name: "Junior Dofonsou",
  fullName: "Junior Christ-Pio Dofonsou",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  jobTitle: {
    fr: "Développeur web · frontend, API & e-commerce",
    en: "Web developer · frontend, APIs & e-commerce",
  } satisfies Localized<string>,
  description: {
    fr: "Junior Dofonsou, développeur web à Cotonou : interfaces React et Next.js, intégration d’API et boutiques Shopify.",
    en: "Junior Dofonsou, web developer based in Cotonou, Benin: React and Next.js interfaces, API integration and Shopify stores.",
  } satisfies Localized<string>,
  tagline: {
    fr: "Je conçois des interfaces modernes, j’intègre des API et j’aide les marchands Shopify à fiabiliser leur boutique.",
    en: "I build modern interfaces, integrate APIs and help Shopify merchants make their stores reliable.",
  } satisfies Localized<string>,
  available: true,
  city: "Cotonou",
  country: { fr: "Bénin", en: "Benin" } satisfies Localized<string>,
  timezone: "UTC+1",
  github: GITHUB,
  /** Un CV par langue, dans /public/cv. */
  cv: { fr: "/cv/CV-Junior-Dofonsou-FR.pdf", en: "/cv/CV-Junior-Dofonsou-EN.pdf" } satisfies Localized<string>,
  photo: "/images/junior-dofonsou.jpg",
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || null,
  contact: {
    email: "christdofonsou@gmail.com",
    whatsapp: "+229 01 61 14 26 13",
    whatsappHref: "https://wa.me/2290161142613",
    linkedin: "https://www.linkedin.com/in/juniordofonsou/",
  },
} as const;

export const location = (lang: Locale) => `${site.city}, ${site.country[lang]}`;

export const mailto = (subject: string) => `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}`;
