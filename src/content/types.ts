import type { Locale } from "@/i18n/config";

export type Localized<T> = Record<Locale, T>;
export type Strand = "web" | "api" | "ecom";
export type ProjectKind = "pro" | "client" | "collab" | "perso";

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectImage {
  /** Chemin dans /public, ex. "/projects/vibecore/accueil.webp" */
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** Tout ce qui se traduit dans un projet. */
export interface ProjectText {
  title: string;
  period: string;
  summary: string;
  context: string;
  goal: string;
  /** Ta contribution, toujours explicite. */
  role: string;
  /** Optionnel : remplace `stack` quand des éléments se traduisent ("Thèmes Liquid" → "Liquid themes"). */
  stack?: string[];
  features: string[];
  challenges: { problem: string; solution: string }[];
  /** Uniquement des résultats vérifiables, toujours accompagnés de resultsSource. */
  results?: { value: string; label: string }[];
  resultsSource?: string;
  /** Infos à valider. Visibles uniquement en développement, jamais en production. */
  pending?: string[];
}

/** Un projet tel qu'il est écrit dans content/projects.ts. */
export interface ProjectSource {
  slug: string;
  kind: ProjectKind;
  strand: Strand;
  stack: string[];
  links: { href: string; label: Localized<string> }[];
  images?: (Omit<ProjectImage, "alt"> & { alt: Localized<string> })[];
  featured?: boolean;
  published: boolean;
  text: Localized<ProjectText>;
}

/** Un projet prêt à afficher, dans une langue. */
export interface Project extends Omit<ProjectText, "stack"> {
  slug: string;
  kind: ProjectKind;
  strand: Strand;
  stack: string[];
  links: ProjectLink[];
  images?: ProjectImage[];
  featured?: boolean;
  published: boolean;
}

export interface Service {
  slug: string;
  strand: Strand | null;
  visible: boolean;
  title: string;
  pitch: string;
  items: string[];
}

export interface TimelineEntry {
  host: string;
  strand: Strand | "now" | null;
  period: string;
  title: string;
  note: string;
}

export type LogoId =
  | "react" | "next" | "ts" | "js" | "tailwind" | "motion"
  | "node" | "express" | "mongo" | "supabase" | "rest" | "php" | "laravel" | "mysql"
  | "git" | "github" | "vscode" | "postman" | "vercel" | "netlify"
  | "shopify" | "chariow" | "facebook" | "tiktok" | "gads";

export interface SkillGroup {
  id: string;
  strand: Strand | null;
  name: string;
  line: string;
  items: { name: string; logo: LogoId }[];
}

export interface LabItem {
  label: string;
  href?: string;
}
