import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { location, mailto, site } from "@/content/site";

export function Footer({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const links = [
    { label: "GitHub", href: site.github },
    { label: "LinkedIn", href: site.contact.linkedin },
    { label: "WhatsApp", href: site.contact.whatsappHref },
    { label: t.contact.emailTitle, href: mailto(t.home.mailSubject) },
    { label: t.nav.cv, href: site.cv[lang] },
  ];
  return (
    <footer className="border-t border-line px-5 pt-12 pb-16 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-3xl font-semibold tracking-[-0.02em]">
            {site.name}
            <span className="text-violet">.</span>
          </p>
          <p className="mt-1 text-base text-muted">
            {t.footer.role} · frontend · API · e-commerce · {location(lang)}
          </p>
          <p className="mt-4 font-mono text-sm tracking-[0.2em] uppercase" aria-label="Build, Learn, Grow">
            <span className="text-violet-text">Build</span> <span className="text-muted">·</span> <span className="text-aqua">Learn</span>{" "}
            <span className="text-muted">·</span> <span className="text-orange-text">Grow</span>
          </p>
        </div>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-base">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target={l.href.startsWith("http") || l.href.endsWith(".pdf") ? "_blank" : undefined}
                rel="noreferrer"
                className="font-semibold hover:underline"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
