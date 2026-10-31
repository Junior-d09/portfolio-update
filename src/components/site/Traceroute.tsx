import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getTimeline } from "@/content/timeline";
import { strandText } from "@/lib/strands";
import { cn } from "@/lib/cn";

/** Le parcours affiché comme la sortie d'un `traceroute` : clin d'œil à la formation réseaux. */
export function Traceroute({ lang, full = false }: { lang: Locale; full?: boolean }) {
  const timeline = getTimeline(lang);
  return (
    <div className="overflow-hidden rounded-2xl bg-deep font-mono text-sm ring-1 ring-line md:text-[15px]">
      <div className="flex items-center gap-2 border-b border-line px-5 py-3" aria-hidden>
        <span className="h-3 w-3 rounded-full bg-line" />
        <span className="h-3 w-3 rounded-full bg-line" />
        <span className="h-3 w-3 rounded-full bg-line" />
        <span className="ml-3 text-muted">{getDictionary(lang).about.terminal}</span>
      </div>
      <div className="px-5 py-5 md:px-7 md:py-6">
        <p className="text-muted">
          <span className="text-violet">$</span> traceroute junior.dofonsou
        </p>
        <ol className="mt-4 space-y-1">
          {timeline.map((h, i) => (
            <li key={h.host} className="hop" style={{ animationDelay: `${0.25 + i * 0.28}s` }}>
              <div className="grid grid-cols-[2ch_1fr] gap-x-3 md:grid-cols-[2ch_minmax(0,1fr)_auto]">
                <span className="text-muted">{i + 1}</span>
                <span className={cn("truncate", strandText(h.strand))}>
                  {h.host}
                  {h.strand === "now" && (
                    <span className="caret ml-1" aria-hidden>
                      ▍
                    </span>
                  )}
                </span>
                <span className="col-start-2 text-muted md:col-start-3">{h.period}</span>
              </div>
              {full && (
                <div className="mt-2 mb-5 ml-[calc(2ch+12px)] rounded-xl bg-panel px-4 py-3 font-sans">
                  <p className="text-base font-semibold text-text">{h.title}</p>
                  <p className="mt-1 text-base text-muted">{h.note}</p>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
