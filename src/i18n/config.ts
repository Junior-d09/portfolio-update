export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

/** Lit le segment [lang] de l'URL. dynamicParams = false garantit qu'on ne reçoit que fr ou en. */
export const asLocale = (value: string): Locale => (isLocale(value) ? value : defaultLocale);

/** Construit un lien localisé : href("en", "/projets") → "/en/projets". */
export const href = (lang: Locale, path = "") => `/${lang}${path === "/" ? "" : path}`;

export const ogLocale: Record<Locale, string> = { fr: "fr_FR", en: "en_US" };

/** Remplace la langue dans un chemin : "/fr/projets/x" → "/en/projets/x". */
export const switchLocalePath = (pathname: string, target: Locale) =>
  pathname.match(/^\/(fr|en)(?=\/|$)/) ? pathname.replace(/^\/(fr|en)(?=\/|$)/, `/${target}`) : `/${target}`;
