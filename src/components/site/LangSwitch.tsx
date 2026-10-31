"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, switchLocalePath, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";

const NAMES: Record<Locale, string> = { fr: "Français", en: "English" };

/** FR / EN : garde la même page, change seulement la langue. */
export function LangSwitch({ lang, label }: { lang: Locale; label: string }) {
  const pathname = usePathname() ?? `/${lang}`;
  return (
    <nav aria-label={label} className="inline-flex h-10 items-center rounded-full p-1 font-mono text-sm ring-[1.5px] ring-line ring-inset">
      {locales.map((l) => (
        <Link
          key={l}
          href={switchLocalePath(pathname, l)}
          hrefLang={l}
          lang={l}
          aria-label={NAMES[l]}
          aria-current={l === lang ? "true" : undefined}
          className={cn(
            "flex h-8 items-center rounded-full px-3 font-medium uppercase transition-colors",
            l === lang ? "bg-text text-ink" : "text-muted hover:text-text",
          )}
        >
          {l}
        </Link>
      ))}
    </nav>
  );
}
