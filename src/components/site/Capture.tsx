import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { Project } from "@/content/types";
import { strands } from "@/lib/strands";
import { isDev } from "@/lib/env";

/** Capture d'un projet dans un cadre de navigateur. Sans capture : cadre stylisé avec le titre. */
export function Capture({
  project,
  pendingLabel,
  large = false,
  priority = false,
}: {
  project: Project;
  pendingLabel: string;
  large?: boolean;
  priority?: boolean;
}) {
  const img = project.images?.[0];
  const color = strands[project.strand].hex;
  return (
    <div className="overflow-hidden rounded-xl bg-ink ring-1 ring-line">
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="ml-3 h-2.5 w-32 rounded-full bg-raise" />
      </div>
      {img ? (
        <Image
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          priority={priority}
          sizes={large ? "(min-width: 1280px) 1200px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
          className="h-auto w-full"
        />
      ) : (
        <div
          className="stripes flex items-center justify-center"
          style={{ aspectRatio: large ? "4 / 1" : "5 / 2" }}
          aria-hidden={!isDev}
        >
          {isDev ? (
            <span className="flex items-center gap-2 rounded-full bg-panel px-4 py-2 font-mono text-sm text-muted">
              <ImageIcon size={16} /> {pendingLabel}
            </span>
          ) : (
            <span className="font-display text-3xl font-semibold tracking-[-0.02em] text-text/15 md:text-5xl">
              {project.title}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
