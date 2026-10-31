import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { ProjectKind } from "@/content/types";
import { cn } from "@/lib/cn";
import { isDev } from "@/lib/env";

const kindStyles: Record<ProjectKind, string> = {
  pro: "bg-text text-ink",
  client: "bg-orange-text text-ink",
  collab: "text-text ring-[1.5px] ring-inset ring-text",
  perso: "bg-raise text-text",
};

export function KindTag({ kind, lang, className }: { kind: ProjectKind; lang: Locale; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full px-3 font-mono text-sm whitespace-nowrap",
        kindStyles[kind],
        className,
      )}
    >
      {getDictionary(lang).kinds[kind]}
    </span>
  );
}

/** Rappel « à confirmer ». Rendu uniquement en développement. */
export function PendingBadge({ children = "À confirmer / To confirm" }: { children?: React.ReactNode }) {
  if (!isDev) return null;
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-pending/15 px-3 font-mono text-sm whitespace-nowrap text-pending">
      <span className="h-1.5 w-1.5 rounded-full bg-pending" />
      {children}
    </span>
  );
}

export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("rounded-lg bg-raise px-3 py-1.5 text-base", className)}>{children}</span>;
}

export function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("font-mono text-sm tracking-[0.14em] uppercase", className ?? "text-muted")}>{children}</p>;
}
