import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/types";
import { href, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { strands } from "@/lib/strands";
import { KindTag, PendingBadge } from "@/components/ui/Badge";
import { Capture } from "./Capture";

export function ProjectCard({ project, lang }: { project: Project; lang: Locale }) {
  const t = getDictionary(lang);
  const pending = project.pending?.length ?? 0;
  return (
    <Link
      href={href(lang, `/projets/${project.slug}`)}
      className="group block rounded-[22px] bg-panel p-3 transition-colors hover:bg-raise"
    >
      <Capture project={project} pendingLabel={t.project.capturePending} />
      <div className="px-3 pt-5 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <KindTag kind={project.kind} lang={lang} />
          {pending > 0 && <PendingBadge>{`${pending} ${t.projects.pending}`}</PendingBadge>}
        </div>
        <p className="mt-4 flex items-center justify-between gap-3 font-display text-[30px] font-medium tracking-[-0.02em]">
          {project.title}
          <ArrowUpRight
            size={24}
            aria-hidden
            className="shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            style={{ color: strands[project.strand].hex }}
          />
        </p>
        <p className="mt-1 text-base text-muted">{project.summary}</p>
      </div>
    </Link>
  );
}
