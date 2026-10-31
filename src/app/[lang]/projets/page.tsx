import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { ProjectsBrowser } from "@/components/site/ProjectsBrowser";
import { Section } from "@/components/site/Section";
import { Kicker } from "@/components/ui/Badge";
import { asLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { alternates } from "@/i18n/seo";
import { getLab, getProjects } from "@/content/projects";
import { site } from "@/content/site";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = asLocale((await params).lang);
  const t = getDictionary(lang).projects;
  return { title: t.metaTitle, description: t.metaDescription, alternates: alternates(lang, "/projets") };
}

export default async function ProjetsPage({ params }: Props) {
  const lang = asLocale((await params).lang);
  const t = getDictionary(lang).projects;
  return (
    <Section className="pt-10 pb-20 md:pt-16">
      <h1 className="font-display text-[56px] leading-[0.95] font-semibold tracking-[-0.04em] md:text-[96px]">{t.title}</h1>
      <p className="mt-4 max-w-[36rem] text-lg text-muted">{t.intro}</p>

      <ProjectsBrowser projects={getProjects(lang)} lang={lang} />

      <div className="mt-14 rounded-[22px] p-6 ring-1 ring-line md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Kicker className="text-aqua">{t.labKicker}</Kicker>
            <p className="mt-2 font-display text-[26px] font-medium">{t.labTitle}</p>
            <p className="mt-1 text-base text-muted">{t.labIntro}</p>
          </div>
          <a href={site.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-base font-semibold">
            {t.github} <ExternalLink size={16} aria-hidden />
          </a>
        </div>
        <ul className="mt-5 flex flex-wrap gap-2">
          {getLab(lang).map((l) => (
            <li key={l.label}>
              {l.href ? (
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-panel px-3 py-1.5 text-sm font-semibold text-aqua hover:underline"
                >
                  {l.label} <ExternalLink size={14} aria-hidden />
                </a>
              ) : (
                <span className="inline-block rounded-lg bg-panel px-3 py-1.5 text-sm">{l.label}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
