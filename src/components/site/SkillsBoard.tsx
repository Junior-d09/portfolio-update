import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAbout } from "@/content/about";
import { getSkills } from "@/content/skills";
import { strands, strandText } from "@/lib/strands";
import { cn } from "@/lib/cn";
import { TechLogo } from "./TechLogo";

/** Compétences en cartes groupées, logo + nom. Une fibre de couleur par groupe. */
export function SkillsBoard({ lang, compact = false }: { lang: Locale; compact?: boolean }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {getSkills(lang).map((g) => {
        const hex = g.strand ? strands[g.strand].hex : "#CBC4DD";
        return (
          <div key={g.id} className="relative overflow-hidden rounded-[22px] bg-panel p-6 md:p-7">
            <span
              className="absolute inset-x-0 top-0 h-[3px]"
              style={{ background: `linear-gradient(90deg, ${hex}, transparent 70%)` }}
              aria-hidden
            />
            <div className="flex items-baseline justify-between gap-4">
              <h3 className={cn("font-display text-2xl font-semibold tracking-[-0.01em]", g.strand ? strandText(g.strand) : "text-text")}>
                {g.name}
              </h3>
              <span className="font-mono text-sm text-muted" aria-hidden>
                {String(g.items.length).padStart(2, "0")}
              </span>
            </div>
            {!compact && <p className="mt-1 text-base text-muted">{g.line}</p>}
            <ul className="mt-5 flex flex-wrap gap-2">
              {g.items.map((item) => (
                <li
                  key={item.name}
                  className="skill-chip flex h-11 items-center gap-2.5 rounded-xl bg-raise pr-4 pl-2.5 text-base"
                  style={{ ["--glow" as string]: hex }}
                >
                  <TechLogo id={item.logo} />
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export function Foundations({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).about;
  const about = getAbout(lang);
  return (
    <div className="mt-4 grid gap-4 rounded-[22px] bg-panel p-6 md:grid-cols-2 md:p-7">
      {(
        [
          [t.foundations, about.foundations],
          [t.languages, about.languages],
        ] as const
      ).map(([title, items]) => (
        <div key={title}>
          <p className="font-mono text-sm tracking-[0.14em] text-muted uppercase">{title}</p>
          <p className="mt-2 text-[17px]">{items.join(" · ")}</p>
        </div>
      ))}
    </div>
  );
}
