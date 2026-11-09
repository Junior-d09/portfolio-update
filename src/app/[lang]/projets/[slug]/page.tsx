import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Capture } from "@/components/site/Capture";
import { Section } from "@/components/site/Section";
import { Chip, KindTag, Kicker, PendingBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { asLocale, href, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { alternates } from "@/i18n/seo";
import { getProject, projectSlugs } from "@/content/projects";
import { strands } from "@/lib/strands";
import { isDev } from "@/lib/env";
import { cn } from "@/lib/cn";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => projectSlugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = asLocale(raw);
  const p = getProject(slug, lang);
  if (!p) return {};
  const path = `/projets/${p.slug}`;
  return {
    title: p.title,
    description: p.summary,
    alternates: alternates(lang, path),
    openGraph: { title: p.title, description: p.summary, url: href(lang, path) },
  };
}

function Block({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className="border-t border-line py-8">
      <h2 className={cn("font-mono text-sm tracking-[0.14em] uppercase", className ?? "text-muted")}>{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { lang: raw, slug } = await params;
  const lang = asLocale(raw);
  const p = getProject(slug, lang);
  if (!p) notFound();
  const t = getDictionary(lang);
  const s = strands[p.strand];

  return (
    <Section className="pt-8 pb-20 md:pt-12">
      <article>
        <Link
          href={href(lang, "/projets")}
          className="inline-flex items-center gap-2 text-base font-semibold text-muted hover:text-text"
        >
          <ArrowLeft size={18} aria-hidden /> {t.project.back}
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-2">
            <KindTag kind={p.kind} lang={lang} />
            <span className={cn("font-mono text-sm", s.text)}>{t.strands[p.strand].name}</span>
          </div>
          <h1 className="mt-5 font-display text-[52px] leading-[0.95] font-semibold tracking-[-0.04em] md:text-[104px]">{p.title}</h1>
          <p className="mt-5 max-w-[36rem] text-xl text-muted">{p.summary}</p>
        </header>

        <div className="mt-10">
          <Capture project={p} pendingLabel={t.project.capturePending} large priority />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_18rem] lg:gap-16">
          <div>
            <Block title={t.project.context}>
              <p className="text-lg leading-relaxed">{p.context}</p>
            </Block>
            <Block title={t.project.goal}>
              <p className="text-lg leading-relaxed">{p.goal}</p>
            </Block>
            <Block title={t.project.role} className={s.text}>
              <p className="rounded-2xl bg-panel p-5 text-lg leading-relaxed" style={{ boxShadow: `inset 4px 0 0 ${s.hex}` }}>
                {p.role}
              </p>
            </Block>
            <Block title={t.project.features}>
              <div className="flex flex-wrap gap-2">
                {p.features.map((f) => (
                  <Chip key={f}>{f}</Chip>
                ))}
              </div>
            </Block>
            {p.challenges.length > 0 && (
              <Block title={t.project.challenges}>
                <div className="space-y-3">
                  {p.challenges.map((c) => (
                    <div key={c.problem} className="grid gap-2 rounded-2xl bg-panel p-5 md:grid-cols-2 md:gap-6">
                      <p className="text-base font-semibold">{c.problem}</p>
                      <p className="text-base text-muted">{c.solution}</p>
                    </div>
                  ))}
                </div>
              </Block>
            )}
            {p.results && p.resultsSource && (
              <Block title={t.project.results} className={s.text}>
                <div className="grid gap-3 md:grid-cols-3">
                  {p.results.map((r) => (
                    <div key={r.label} className="rounded-2xl bg-panel p-5">
                      <p className="font-display text-[32px] leading-none font-semibold tracking-[-0.02em]">{r.value}</p>
                      <p className="mt-2 text-base text-muted">{r.label}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 font-mono text-sm text-muted">
                  {t.project.source} {p.resultsSource}
                </p>
              </Block>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-panel p-5">
              <Kicker>{t.project.stack}</Kicker>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.stack.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
              <Kicker className="mt-6 text-muted">{t.project.period}</Kicker>
              <p className="mt-2 text-base">{p.period}</p>
              {p.links.length > 0 && (
                <>
                  <Kicker className="mt-6 text-muted">{t.project.links}</Kicker>
                  <ul className="mt-2 space-y-2">
                    {p.links.map((l) => (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-base font-semibold text-aqua hover:underline"
                        >
                          <ExternalLink size={16} aria-hidden /> {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            {isDev && p.pending && p.pending.length > 0 && (
              <div className="rounded-2xl bg-pending/10 p-5 ring-1 ring-pending/30">
                <PendingBadge>{t.project.beforePublish}</PendingBadge>
                <ul className="mt-3 space-y-1.5 text-base text-[#F3E6BF]">
                  {p.pending.map((c) => (
                    <li key={c}>· {c}</li>
                  ))}
                </ul>
              </div>
            )}
            <ButtonLink href={href(lang, "/contact#devis")} className="w-full">
              {t.project.similar}
            </ButtonLink>
          </aside>
        </div>
      </article>
    </Section>
  );
}
