"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Widget Cloudflare Turnstile (anti-spam sans puzzle). Ajoute le champ caché
 * `cf-turnstile-response` au formulaire. Sans clé configurée : rien n'est affiché.
 * `resetKey` : change cette valeur pour obtenir un nouveau jeton (un jeton ne sert qu'une fois).
 */
export function Turnstile({ lang, resetKey }: { lang: string; resetKey?: unknown }) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  // Script déjà chargé (changement d'onglet) : on peut rendre tout de suite.
  const [ready, setReady] = useState(() => typeof window !== "undefined" && Boolean(window.turnstile));

  useEffect(() => {
    if (!SITE_KEY || !ready || !box.current || !window.turnstile) return;
    widget.current = window.turnstile.render(box.current, { sitekey: SITE_KEY, theme: "dark", language: lang });
    return () => {
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [ready, lang]);

  useEffect(() => {
    if (widget.current) window.turnstile?.reset(widget.current);
  }, [resetKey]);

  if (!SITE_KEY) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={() => setReady(true)} />
      <div ref={box} className="min-h-[65px]" />
    </>
  );
}
