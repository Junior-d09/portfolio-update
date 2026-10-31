import { Compass, Gem, HeartHandshake, Wallet } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAbout } from "@/content/about";

const ICONS = [Wallet, Gem, HeartHandshake, Compass];

export function Objectives({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).about;
  return (
    <div className="h-full rounded-[24px] bg-panel p-7 md:p-9">
      <p className="font-mono text-sm tracking-[0.14em] text-orange-text uppercase">{t.goalsKicker}</p>
      <p className="mt-3 font-display text-2xl leading-tight font-semibold">{t.goalsTitle}</p>
      <ul className="mt-6 grid gap-3">
        {getAbout(lang).objectives.map((goal, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <li key={goal} className="flex items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-raise">
                <Icon size={19} className="text-orange-text" aria-hidden />
              </span>
              <span className="text-[17px]">{goal}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
