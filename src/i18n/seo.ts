import { href, type Locale } from "./config";

/** Canonical + hreflang pour une page présente dans les deux langues. */
export function alternates(lang: Locale, path = "") {
  return {
    canonical: href(lang, path),
    languages: { fr: href("fr", path), en: href("en", path), "x-default": href("fr", path) },
  };
}
