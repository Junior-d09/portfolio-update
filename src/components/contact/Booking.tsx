"use client";

import { useEffect } from "react";
import { CalendarDays, Clock, ExternalLink, Mail, MessageCircle } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { mailto, site } from "@/content/site";

const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK; // ex. "juniordofonsou/30min"
const NS = "decouverte";

type CalFn = ((...args: unknown[]) => void) & { q?: unknown[][]; ns?: Record<string, CalFn>; loaded?: boolean };
declare global {
  interface Window {
    Cal?: CalFn;
  }
}

/** Snippet officiel Cal.com (embed inline), réécrit en TypeScript. */
function loadCal() {
  if (window.Cal) return window.Cal;
  const push = (fn: CalFn, args: unknown[]) => (fn.q = fn.q ?? []).push(args);
  const cal: CalFn = function (...args: unknown[]) {
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q ?? [];
      const s = document.createElement("script");
      s.src = "https://app.cal.com/embed/embed.js";
      document.head.appendChild(s);
      cal.loaded = true;
    }
    if (args[0] === "init") {
      const api: CalFn = function (...a: unknown[]) {
        push(api, a);
      };
      const namespace = args[1];
      if (typeof namespace === "string") {
        cal.ns![namespace] = cal.ns![namespace] ?? api;
        push(cal.ns![namespace], args);
        push(cal, ["initNamespace", namespace]);
      } else push(cal, args);
      return;
    }
    push(cal, args);
  };
  window.Cal = cal;
  return cal;
}

function CalInline({ lang }: { lang: Locale }) {
  useEffect(() => {
    const cal = loadCal();
    cal("init", NS, { origin: "https://app.cal.com" });
    const api = cal.ns?.[NS];
    api?.("inline", { elementOrSelector: "#cal-inline", calLink: CAL_LINK, config: { layout: "month_view", locale: lang } });
    api?.("ui", { theme: "dark", cssVarsPerTheme: { dark: { "cal-brand": "#9466FF" } }, hideEventTypeDetails: true, layout: "month_view" });
  }, [lang]);
  return <div id="cal-inline" className="min-h-[560px] w-full overflow-hidden rounded-2xl bg-ink" />;
}

export function Booking({ lang, t, mailSubject }: { lang: Locale; t: Dictionary["forms"]; mailSubject: string }) {
  return (
    <div className="grid gap-6 rounded-[24px] bg-panel p-6 md:p-8 lg:grid-cols-[16rem_1fr] lg:gap-10">
      <div>
        <p className="font-mono text-sm tracking-[0.14em] text-aqua uppercase">{t.bookingKicker}</p>
        <p className="mt-3 font-display text-[28px] leading-tight font-medium">{t.bookingTitle}</p>
        <p className="mt-3 flex items-center gap-2 text-base text-muted">
          <Clock size={16} aria-hidden /> {t.bookingDetail}
        </p>
        <p className="mt-2 text-base text-muted">{t.bookingHint}</p>
        {CAL_LINK && (
          <a href={`https://cal.com/${CAL_LINK}`} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-aqua hover:underline">
            <ExternalLink size={15} aria-hidden /> {t.bookingOpen}
          </a>
        )}
      </div>
      {CAL_LINK ? (
        <CalInline lang={lang} />
      ) : (
        <div className="flex flex-col justify-center rounded-2xl bg-ink p-6 ring-1 ring-line">
          <CalendarDays size={28} className="text-aqua" aria-hidden />
          <p className="mt-4 text-lg">{t.bookingFallback}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={mailto(mailSubject)} className="inline-flex h-11 items-center gap-2 rounded-full bg-violet px-5 font-semibold text-white">
              <Mail size={18} aria-hidden /> {t.email}
            </a>
            <a href={site.contact.whatsappHref} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full px-5 font-semibold ring-1 ring-line">
              <MessageCircle size={18} aria-hidden /> WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
