import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getResults } from "@/content/results";
import { strands } from "@/lib/strands";
import { cn } from "@/lib/cn";
import { Kicker } from "@/components/ui/Badge";
import { ArrowLink } from "@/components/ui/Button";

/** Chiffres vérifiés, chacun avec sa source. */
export function Results({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).home;
  return (
    <>
      <Kicker className="text-orange-text">{t.resultsKicker}</Kicker>
      <h2 className="mt-3 font-display text-4xl leading-[1.05] font-semibold tracking-[-0.03em] md:text-5xl">{t.resultsTitle}</h2>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {getResults(lang).map((card) => {
          const s = strands[card.strand];
          return (
            <article
              key={card.id}
              className="flex flex-col rounded-[28px] bg-panel p-6 md:p-8"
              style={{ boxShadow: `inset 0 0 0 1.5px ${s.hex}66` }}
            >
              <Kicker className={s.text}>{card.kicker}</Kicker>
              <h3 className="mt-3 font-display text-[29px] leading-tight font-semibold md:text-[34px]">{card.title}</h3>
              <p className="mt-2 text-base text-muted">{card.text}</p>
              <dl className={cn("mt-6 grid gap-2", card.figures.length === 4 ? "grid-cols-2" : "sm:grid-cols-3")}>
                {card.figures.map((f) => (
                  <div key={f.label} className="flex flex-col-reverse rounded-2xl bg-raise p-4">
                    <dt className="mt-2 text-[15px] text-muted">{f.label}</dt>
                    <dd className="font-display text-[28px] leading-none font-semibold tracking-[-0.03em] md:text-[32px]">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 font-mono text-[13px] text-muted">{card.source}</p>
              {card.caseStudy && (
                <div className="mt-4 md:mt-auto md:pt-4">
                  <ArrowLink href={href(lang, `/projets/${card.caseStudy}`)}>{t.caseStudy}</ArrowLink>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}
