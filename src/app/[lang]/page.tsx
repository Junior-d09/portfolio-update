import Link from "next/link";
import { ArrowUpRight, CalendarDays, Linkedin, Mail, MessageCircle } from "lucide-react";
import { Hero } from "@/components/site/Hero";
import { Traceroute } from "@/components/site/Traceroute";
import { PersonJsonLd } from "@/components/site/PersonJsonLd";
import { Section } from "@/components/site/Section";
import { SkillsBoard } from "@/components/site/SkillsBoard";
import { SignedQuote } from "@/components/site/SignedQuote";
import { Results } from "@/components/site/Results";
import { TechLogo } from "@/components/site/TechLogo";
import { KindTag, Kicker } from "@/components/ui/Badge";
import { ArrowLink } from "@/components/ui/Button";
import { asLocale, href } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getFeaturedProjects } from "@/content/projects";
import { heroTech } from "@/content/skills";
import { location, mailto, site } from "@/content/site";
import { strandBg } from "@/lib/strands";
import { cn } from "@/lib/cn";

type Props = { params: Promise<{ lang: string }> };

export default async function HomePage({ params }: Props) {
  const lang = asLocale((await params).lang);
  const t = getDictionary(lang);
  const h = t.home;

  const contactLinks = [
    { icon: Mail, label: h.ctaEmail, href: mailto(h.mailSubject) },
    { icon: MessageCircle, label: h.ctaWhatsapp, href: site.contact.whatsappHref },
    site.bookingUrl
      ? { icon: CalendarDays, label: h.ctaBook, href: site.bookingUrl }
      : { icon: Linkedin, label: h.ctaLinkedin, href: site.contact.linkedin },
  ];

  const tech = (
    <ul className="flex flex-wrap gap-2" aria-label={t.hero.techLabel}>
      {heroTech.map((item) => (
        <li key={item.name} className="flex h-10 items-center gap-2 rounded-xl bg-panel pr-3.5 pl-2.5 text-[15px]">
          <TechLogo id={item.logo} size={20} />
          {item.name}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <PersonJsonLd lang={lang} />
      <Hero
        lang={lang}
        t={t.hero}
        strandText={t.strands}
        tagline={site.tagline[lang]}
        location={location(lang)}
        timezone={site.timezone}
        available={site.available}
        tech={tech}
      />

      <Section panel className="py-16 md:py-24">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display text-[40px] leading-none font-semibold tracking-[-0.03em] md:text-[64px]">{h.projects}</h2>
          <ArrowLink href={href(lang, "/projets")}>{h.seeAll}</ArrowLink>
        </div>
        <ul className="mt-10">
          {getFeaturedProjects(lang).map((p) => (
            <li key={p.slug} className="border-t border-line">
              <Link
                href={href(lang, `/projets/${p.slug}`)}
                className="group grid items-center gap-3 py-7 md:grid-cols-[1fr_auto] md:gap-10"
              >
                <span className="flex items-center gap-5">
                  <span
                    className={cn("h-12 w-1.5 shrink-0 rounded-full transition-all group-hover:h-16", strandBg(p.strand))}
                    aria-hidden
                  />
                  <span>
                    <span className="block font-display text-[32px] leading-tight font-medium tracking-[-0.02em] group-hover:text-white md:text-[48px]">
                      {p.title}
                    </span>
                    <span className="mt-1 block text-base text-muted">{p.summary}</span>
                  </span>
                </span>
                <span className="ml-[26px] flex items-center gap-4 md:ml-0">
                  <KindTag kind={p.kind} lang={lang} />
                  <ArrowUpRight
                    size={24}
                    aria-hidden
                    className="hidden transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 md:block"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pt-16 md:pt-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Kicker className="text-violet-text">{h.skillsKicker}</Kicker>
            <h2 className="mt-3 font-display text-[40px] leading-none font-semibold tracking-[-0.03em] md:text-[56px]">
              {h.skillsTitle}
            </h2>
          </div>
          <ArrowLink href={href(lang, "/parcours")}>{h.skillsMore}</ArrowLink>
        </div>
        <div className="mt-10">
          <SkillsBoard lang={lang} compact />
        </div>
      </Section>

      <Section className="pt-16 md:pt-24">
        <Results lang={lang} />
      </Section>

      <Section className="py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <Kicker className="text-violet-text">{h.aboutKicker}</Kicker>
            <h2 className="mt-4 font-display text-[40px] leading-none font-semibold tracking-[-0.03em] md:text-[56px]">
              {h.aboutTitle}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">{h.aboutText}</p>
            <div className="mt-7">
              <ArrowLink href={href(lang, "/parcours")}>{h.aboutMore}</ArrowLink>
            </div>
          </div>
          <Traceroute lang={lang} />
        </div>
        <div className="mt-10">
          <SignedQuote lang={lang} size="md" />
        </div>
      </Section>

      <Section className="pb-20 md:pb-28">
        <div className="rounded-[28px] bg-violet p-7 md:p-12">
          <h2 className="font-display text-[40px] leading-none font-semibold tracking-[-0.03em] text-white md:text-[64px]">
            {h.ctaTitle}
          </h2>
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {contactLinks.map(({ icon: Icon, label, href: target }) => (
              <li key={label}>
                <a
                  href={target}
                  target={target.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-2xl bg-ink/90 px-5 py-5 text-lg font-semibold text-text transition-transform hover:-translate-y-0.5"
                >
                  <span className="flex items-center gap-3">
                    <Icon size={20} className="text-violet" aria-hidden />
                    {label}
                  </span>
                  <ArrowUpRight size={20} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-3 text-white">
            <p className="text-lg text-white/85">{h.thanks}</p>
            <p className="signature text-[36px] leading-none">{site.name}</p>
          </div>
        </div>
      </Section>
    </>
  );
}
