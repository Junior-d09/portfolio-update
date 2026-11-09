import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Section } from "@/components/site/Section";
import { Kicker } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { asLocale, href } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { alternates } from "@/i18n/seo";
import { getServices } from "@/content/services";
import { strands } from "@/lib/strands";
import { cn } from "@/lib/cn";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = asLocale((await params).lang);
  const t = getDictionary(lang).services;
  return { title: t.metaTitle, description: t.metaDescription, alternates: alternates(lang, "/services") };
}

export default async function ServicesPage({ params }: Props) {
  const lang = asLocale((await params).lang);
  const t = getDictionary(lang).services;
  return (
    <>
      <Section className="pt-10 pb-12 md:pt-16">
        <h1 className="font-display text-[56px] leading-[0.95] font-semibold tracking-[-0.04em] md:text-[96px]">{t.title}</h1>
        <p className="mt-4 max-w-[34rem] text-lg text-muted">{t.intro}</p>
      </Section>

      <Section className="grid gap-4 pb-16 md:grid-cols-2">
        {getServices(lang).map((svc) => {
          const s = svc.strand ? strands[svc.strand] : null;
          return (
            <div key={svc.slug} id={svc.slug} className="flex flex-col rounded-[24px] bg-panel p-6 md:p-8">
              <div className="flex gap-1.5" aria-hidden>
                {s ? (
                  <span className={cn("h-1.5 w-12 rounded-full", s.bg)} />
                ) : (
                  <>
                    <span className="h-1.5 w-12 rounded-full bg-text" />
                    <span className="h-1.5 w-12 rounded-full bg-violet" />
                    <span className="h-1.5 w-12 rounded-full bg-aqua" />
                    <span className="h-1.5 w-12 rounded-full bg-orange" />
                  </>
                )}
              </div>
              <h2 className="mt-6 font-display text-[32px] leading-tight font-semibold tracking-[-0.02em]">{svc.title}</h2>
              <p className="mt-2 text-lg text-muted">{svc.pitch}</p>
              <ul className="mt-6 space-y-2.5">
                {svc.items.map((i) => (
                  <li key={i} className="flex items-start gap-3 text-base">
                    <Check size={18} className="mt-0.5 shrink-0" style={{ color: s?.hex ?? "#EEE9F7" }} aria-hidden />
                    {i}
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-2 md:mt-auto">
                <ButtonLink href={href(lang, `/contact#devis-${svc.slug}`)} variant="ghost">
                  {t.quote}
                </ButtonLink>
              </div>
            </div>
          );
        })}
      </Section>

      <Section panel className="py-16 md:py-24">
        <Kicker className="text-violet-text">{t.methodKicker}</Kicker>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.03em] md:text-[52px]">{t.methodTitle}</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-4">
          {t.steps.map(([step, detail], i) => (
            <li key={step}>
              <span className="font-mono text-sm text-violet-text">0{i + 1}</span>
              <p className="mt-2 font-display text-[26px] font-medium">{step}</p>
              <p className="mt-1 text-base text-muted">{detail}</p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
