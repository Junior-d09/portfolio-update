import { href, type Locale } from "@/i18n/config";
import { site } from "@/content/site";

export function PersonJsonLd({ lang }: { lang: Locale }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.fullName,
    alternateName: site.name,
    jobTitle: site.jobTitle[lang],
    description: site.description[lang],
    url: `${site.url}${href(lang)}`,
    image: `${site.url}${site.photo}`,
    email: `mailto:${site.contact.email}`,
    address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: "BJ" },
    sameAs: [site.github, site.contact.linkedin],
    knowsLanguage: ["fr", "fon", "en"],
    knowsAbout: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Supabase", "Laravel", "Shopify", lang === "en" ? "API integration" : "Intégration d’API"],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
