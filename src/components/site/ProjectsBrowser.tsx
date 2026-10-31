"use client";

import { useState } from "react";
import type { Project, ProjectKind } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { ProjectCard } from "./ProjectCard";

type Filter = "all" | ProjectKind;

export function ProjectsBrowser({ projects, lang }: { projects: Project[]; lang: Locale }) {
  const t = getDictionary(lang);
  const [filter, setFilter] = useState<Filter>("all");
  const kinds = (Object.keys(t.kinds) as ProjectKind[]).filter((k) => projects.some((p) => p.kind === k));
  const filters: [Filter, string][] = [["all", t.projects.all], ...kinds.map((k) => [k, t.kinds[k]] as [Filter, string])];
  const list = projects.filter((p) => filter === "all" || p.kind === filter);

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label={t.projects.filterLabel}>
        {filters.map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
            className={cn(
              "h-10 rounded-full px-4 text-sm font-semibold transition-colors",
              filter === id ? "bg-text text-ink" : "bg-panel text-muted hover:text-text",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {list.map((p) => (
          <ProjectCard key={p.slug} project={p} lang={lang} />
        ))}
      </div>
    </>
  );
}
