"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { LangSwitch } from "./LangSwitch";

interface HeaderProps {
  lang: Locale;
  t: Dictionary["nav"];
  cv: string;
  bookingUrl: string | null;
}

export function Header({ lang, t, cv, bookingUrl }: HeaderProps) {
  const pathname = usePathname() ?? href(lang);
  const [open, setOpen] = useState(false);

  const nav = [
    { href: href(lang), label: t.home },
    { href: href(lang, "/parcours"), label: t.about },
    { href: href(lang, "/projets"), label: t.projects },
    { href: href(lang, "/services"), label: t.services },
    { href: href(lang, "/contact"), label: t.contact },
  ];
  const isActive = (target: string) => (target === href(lang) ? pathname === target : pathname.startsWith(target));

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const cta = bookingUrl
    ? { href: bookingUrl, label: t.book, external: true }
    : { href: href(lang, "/contact"), label: t.contactMe, external: false };

  return (
    <header className={cn("sticky top-0 z-30 px-5 backdrop-blur-md md:px-12", open ? "bg-ink" : "bg-ink/85")}>
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4">
        <Link href={href(lang)} className="font-display text-2xl font-semibold tracking-[-0.02em]" aria-label={t.home}>
          JD<span className="text-violet">.</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={t.main}>
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-10 items-center rounded-full px-4 text-base font-medium transition-colors",
                  active ? "bg-panel text-text" : "text-muted hover:text-text",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LangSwitch lang={lang} label={t.language} />
          <a
            href={cv}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 items-center rounded-full px-4 text-base font-semibold ring-[1.5px] ring-line ring-inset hover:ring-muted"
          >
            {t.cv}
          </a>
          <a
            href={cta.href}
            target={cta.external ? "_blank" : undefined}
            rel={cta.external ? "noreferrer" : undefined}
            className="flex h-10 items-center rounded-full bg-violet px-5 text-base font-semibold text-white transition hover:brightness-110"
          >
            {cta.label}
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LangSwitch lang={lang} label={t.language} />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-panel"
            aria-label={open ? t.close : t.open}
            aria-expanded={open}
            aria-controls="menu-mobile"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-mobile" className="h-[calc(100dvh-72px)] overflow-y-auto pb-6 lg:hidden" aria-label={t.mobile}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block py-2 font-display text-4xl font-medium tracking-[-0.02em]",
                isActive(item.href) ? "text-violet-text" : "text-text",
              )}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={cta.href}
            target={cta.external ? "_blank" : undefined}
            rel={cta.external ? "noreferrer" : undefined}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-violet text-base font-semibold text-white"
          >
            {cta.label}
          </a>
          <a
            href={cv}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex h-12 w-full items-center justify-center rounded-full text-base font-semibold ring-[1.5px] ring-line ring-inset"
          >
            {t.cv}
          </a>
        </nav>
      )}
    </header>
  );
}
