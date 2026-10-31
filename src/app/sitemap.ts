import type { MetadataRoute } from "next";
import { href, locales } from "@/i18n/config";
import { projectSlugs } from "@/content/projects";
import { site } from "@/content/site";

/** Chaque page existe en FR et en EN, avec ses alternates hreflang. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/parcours", "/projets", "/services", "/contact", ...projectSlugs.map((s) => `/projets/${s}`)];
  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${site.url}${href(lang, path)}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path.startsWith("/projets/") ? 0.6 : 0.8,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${site.url}${href(l, path)}`])) },
    })),
  );
}
