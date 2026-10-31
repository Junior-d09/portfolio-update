import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Sprout, Users } from "lucide-react";
import { Traceroute } from "@/components/site/Traceroute";
import { Section } from "@/components/site/Section";
import { SkillsBoard, Foundations } from "@/components/site/SkillsBoard";
import { SignedQuote } from "@/components/site/SignedQuote";
import { Objectives } from "@/components/site/Objectives";
import { KindTag, Kicker } from "@/components/ui/Badge";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { asLocale, href } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { alternates } from "@/i18n/seo";
import { getAbout } from "@/content/about";
import { getExperiences } from "@/content/projects";
import { location, site } from "@/content/site";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = asLocale((await params).lang);
  const t = getDictionary(lang).about;
  return { title: t.metaTitle, description: t.metaDescription, alternates: alternates(lang, "/parcours") };
}

const VALUE_ICONS = [ShieldCheck, Users, Sprout];

export default async function ParcoursPage({ params }: Props) {
  const lang = asLocale((await params).lang);
  const t = getDictionary(lang).about;
  const about = getAbout(lang);

  return (
    <>
      <Section className="grid items-end gap-10 pt-10 pb-14 md:pt-16 lg:grid-cols-[1fr_auto]">
        <div>
          <Kicker className="text-violet-text">{t.kicker}</Kicker>
          <h1 className="mt-4 max-w-[16ch] font-display text-5xl leading-[0.95] font-semibold tracking-[-0.04em] md:text-[88px]">
            {t.title}
          </h1>
          <p className="mt-6 max-w-[38rem] text-lg leading-relaxed text-muted md:text-xl">{t.intro}</p>
          <div className="mt-8">
            <ButtonLink href={site.cv[lang]} variant="ghost" external>
              {t.cv}
            </ButtonLink>
          </div>
        </div>
        <figure className="relative w-56 shrink-0 md:w-72">
          <div className="absolute -inset-2 rounded-full bg-violet/40 blur-xl" aria-hidden />
          <Image
            src={site.photo}
            alt={t.photoAlt}
            width={720}
            height={720}
            priority
            sizes="(min-width: 768px) 288px, 224px"
            className="relative aspect-square w-full rounded-full object-cover ring-4 ring-violet"
          />
          <figcaption className="mt-4 text-center font-mono text-sm text-muted">{location(lang)}</figcaption>
        </figure>
      </Section>

      <Section className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <SignedQuote lang={lang} />
        <Objectives lang={lang} />
      </Section>

      <Section className="grid gap-3 pt-4 pb-16 md:grid-cols-3">
        {about.values.map((v, i) => {
          const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
          return (
            <div key={v.title} className="flex items-start gap-4 rounded-2xl bg-panel p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-raise">
                <Icon size={20} className="text-violet-text" aria-hidden />
              </span>
              <span>
                <span className="block text-[17px] font-semibold">{v.title}</span>
                <span className="block text-base text-muted">{v.text}</span>
              </span>
            </div>
          );
        })}
      </Section>

      <Section className="pb-16 md:pb-24">
        <Traceroute lang={lang} full />
      </Section>

      <Section panel className="py-16 md:py-24">
        <h2 className="font-display text-4xl font-semibold tracking-[-0.03em] md:text-[52px]">{t.experienceTitle}</h2>
        <p className="mt-2 text-base text-muted">{t.experienceIntro}</p>
        <ul className="mt-8 grid gap-3">
          {getExperiences(lang).map((p) => (
            <li key={p.slug}>
              <Link
                href={href(lang, `/projets/${p.slug}`)}
                className="grid gap-3 rounded-2xl bg-raise p-5 transition-colors hover:bg-[#2a2440] md:grid-cols-[14rem_1fr_auto] md:items-center md:gap-8 md:p-6"
              >
                <span>
                  <KindTag kind={p.kind} lang={lang} />
                </span>
                <span>
                  <span className="block font-display text-2xl font-medium">{p.title}</span>
                  <span className="block text-base text-muted">{p.summary}</span>
                </span>
                <span className="font-mono text-sm text-muted">{p.period}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="py-16 md:py-24">
        <h2 className="font-display text-4xl font-semibold tracking-[-0.03em] md:text-[52px]">{t.skillsTitle}</h2>
        <p className="mt-2 max-w-[40rem] text-lg text-muted">{t.skillsIntro}</p>
        <div className="mt-8">
          <SkillsBoard lang={lang} />
        </div>
        <Foundations lang={lang} />
        <div className="mt-10">
          <ArrowLink href={href(lang, "/projets")}>{t.seeProjects}</ArrowLink>
        </div>
      </Section>
    </>
  );
}
