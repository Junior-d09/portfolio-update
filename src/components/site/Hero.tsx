"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Strand } from "@/content/types";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { strandOrder, strandServiceAnchor, strands } from "@/lib/strands";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { Fibers } from "./Fibers";

interface HeroProps {
  lang: Locale;
  t: Dictionary["hero"];
  strandText: Dictionary["strands"];
  tagline: string;
  location: string;
  timezone: string;
  available: boolean;
  /** Puces technos avec logos, rendues côté serveur (voir TechLogo). */
  tech: React.ReactNode;
}

export function Hero({ lang, t, strandText, tagline, location, timezone, available, tech }: HeroProps) {
  const [active, setActive] = useState<Strand | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-5 pt-10 pb-16 md:px-12 md:pt-16 md:pb-24">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div>
          {available && (
            <p className="inline-flex items-center gap-2 rounded-full bg-aqua/10 py-1.5 pr-4 pl-3 font-mono text-sm text-aqua">
              <span className="h-2 w-2 rounded-full bg-aqua" aria-hidden />
              {t.available} · {location}
              {lang === "en" && ` · ${timezone}`}
            </p>
          )}
          <h1 className="mt-6 font-display text-[64px] leading-[0.88] font-semibold tracking-[-0.045em] md:text-[112px] xl:text-[132px]">
            Junior
            <br />
            <span className="text-violet-text">Dofonsou</span>
          </h1>
          <p className="mt-6 font-display text-[22px] font-medium md:text-[26px]">
            {t.role} <span className="text-muted">·</span> {t.roleDetail}
          </p>
          <p className="mt-4 max-w-[34rem] text-lg leading-relaxed text-muted md:text-xl">{tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={href(lang, "/contact#devis")}>{t.start}</ButtonLink>
            <ButtonLink href={href(lang, "/projets")} variant="ghost">
              {t.seeProjects}
            </ButtonLink>
          </div>
          <div className="mt-9">{tech}</div>
        </div>
        <Fibers active={active} onHover={setActive} label={t.fibersAlt} className="w-full" />
      </div>

      <ul className="mt-12 grid gap-3 md:mt-16 md:grid-cols-3">
        {strandOrder.map((id) => {
          const s = strands[id];
          return (
            <li key={id}>
              <Link
                href={href(lang, `/services#${strandServiceAnchor[id]}`)}
                onMouseEnter={() => setActive(id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(id)}
                onBlur={() => setActive(null)}
                className={cn("group block h-full rounded-2xl p-5 transition-colors", active === id ? "bg-raise" : "bg-panel")}
              >
                <span className="flex items-center justify-between gap-4">
                  <span className={cn("font-mono text-sm", s.text)}>{strandText[id].name}</span>
                  <ArrowUpRight
                    size={22}
                    aria-hidden
                    className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color: s.hex }}
                  />
                </span>
                <span className="mt-3 block font-display text-[22px] leading-tight font-medium">{strandText[id].problem}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
