import * as simpleIcons from "simple-icons";
import type { LogoId } from "@/content/types";
import { FallbackMark } from "./LogoMarks";

/**
 * Logos officiels via simple-icons (rendus côté serveur, zéro JS envoyé au navigateur).
 * Si une marque n'existe pas ou plus dans simple-icons, on retombe sur LogoMarks.
 * Composant serveur : ne pas l'importer dans un fichier "use client".
 */
const SIMPLE_ICONS: Partial<Record<LogoId, string>> = {
  react: "siReact",
  next: "siNextdotjs",
  ts: "siTypescript",
  js: "siJavascript",
  tailwind: "siTailwindcss",
  motion: "siFramer",
  node: "siNodedotjs",
  express: "siExpress",
  mongo: "siMongodb",
  supabase: "siSupabase",
  php: "siPhp",
  laravel: "siLaravel",
  mysql: "siMysql",
  git: "siGit",
  github: "siGithub",
  postman: "siPostman",
  vercel: "siVercel",
  netlify: "siNetlify",
  shopify: "siShopify",
  facebook: "siFacebook",
  tiktok: "siTiktok",
  gads: "siGoogleads",
};

type Icon = { title: string; hex: string; path: string };
const library = simpleIcons as unknown as Record<string, Icon | undefined>;

/** Les logos noirs (Next.js, Express, GitHub, Vercel…) passent en clair sur le fond sombre. */
function readable(hex: string) {
  const n = parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance < 0.28 ? "#EEE9F7" : `#${hex}`;
}

export function TechLogo({ id, size = 22 }: { id: LogoId; size?: number }) {
  const key = SIMPLE_ICONS[id];
  const icon = key ? library[key] : undefined;
  return (
    <span className="inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }} aria-hidden>
      {icon?.path ? (
        <svg viewBox="0 0 24 24" className="h-full w-full">
          <path d={icon.path} fill={readable(icon.hex)} />
        </svg>
      ) : (
        <FallbackMark id={id} />
      )}
    </span>
  );
}
