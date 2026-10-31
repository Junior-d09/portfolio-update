"use client";

import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/site/Section";
import { href, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/** 404 dans la langue de l'URL (not-found ne reçoit pas les params, on lit le chemin). */
export default function NotFound() {
  const lang: Locale = usePathname()?.startsWith("/en") ? "en" : "fr";
  const t = getDictionary(lang).notFound;
  return (
    <Section className="py-24 md:py-32">
      <div className="max-w-2xl rounded-2xl bg-deep p-6 font-mono text-sm ring-1 ring-line md:p-8 md:text-base">
        <p className="text-muted">
          <span className="text-violet">$</span> {t.command}
        </p>
        <p className="mt-3 text-muted">1 junior.dofonsou</p>
        <p className="text-muted">2 * * *</p>
        <p className="mt-3 text-orange-text">{t.host}</p>
      </div>
      <h1 className="mt-10 font-display text-5xl font-semibold tracking-[-0.03em] md:text-7xl">{t.title}</h1>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href={href(lang)}>{t.home}</ButtonLink>
        <ButtonLink href={href(lang, "/projets")} variant="ghost">
          {t.projects}
        </ButtonLink>
      </div>
    </Section>
  );
}
