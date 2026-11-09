"use client";

import { useSyncExternalStore } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Service } from "@/content/types";
import { cn } from "@/lib/cn";
import { MessageForm } from "./MessageForm";
import { QuoteForm } from "./QuoteForm";
import { Booking } from "./Booking";

type Tab = "message" | "devis" | "rdv";
const TABS: Tab[] = ["message", "devis", "rdv"];

/** L'onglet vit dans l'ancre de l'URL : #message, #devis, #devis-shopify (prestation présélectionnée), #rdv. */
function parse(hash: string): { tab: Tab; preset: string | null } {
  const h = hash.replace(/^#/, "");
  if (h.startsWith("devis-")) return { tab: "devis", preset: h.slice(6) };
  return { tab: (TABS as string[]).includes(h) ? (h as Tab) : "message", preset: null };
}
const subscribe = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};

interface Props {
  lang: Locale;
  t: Dictionary["forms"];
  mailSubject: string;
  services: Pick<Service, "slug" | "title" | "pitch" | "strand">[];
}

export function ContactTabs({ lang, t, mailSubject, services }: Props) {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => "");
  const { tab, preset } = parse(hash);

  const select = (next: Tab) => {
    history.replaceState(null, "", `#${next}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  return (
    <>
      <div className="inline-flex rounded-full bg-panel p-1" role="tablist" aria-label={t.tabsLabel}>
        {TABS.map((id) => (
          <button
            key={id}
            id={`tab-${id}`}
            type="button"
            role="tab"
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            onClick={() => select(id)}
            className={cn("h-11 rounded-full px-5 text-base font-semibold transition-colors", tab === id ? "bg-text text-ink" : "text-muted hover:text-text")}
          >
            {t.tabs[id]}
          </button>
        ))}
      </div>
      <div className="mt-6" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "message" && <MessageForm lang={lang} t={t} />}
        {tab === "devis" && <QuoteForm lang={lang} t={t} services={services} preset={preset} />}
        {tab === "rdv" && <Booking lang={lang} t={t} mailSubject={mailSubject} />}
      </div>
    </>
  );
}
