import { Box, Braces, Database, Github, Store } from "lucide-react";
import type { LogoId } from "@/content/types";

/**
 * Marques simplifiées dessinées à la main. Utilisées seulement quand simple-icons
 * n'a pas le logo (VS Code, Chariow, API REST…) ou ne l'expose plus.
 */
function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden>
      {children}
    </svg>
  );
}

function Mono({ t, bg, fg = "#fff" }: { t: string; bg: string; fg?: string }) {
  return (
    <Svg>
      <rect x="2" y="2" width="20" height="20" rx="4" fill={bg} />
      <text x="21" y="20" textAnchor="end" fontWeight="700" fontSize="9" fill={fg} fontFamily="var(--font-jost), sans-serif">
        {t}
      </text>
    </Svg>
  );
}

const marks: Record<LogoId, React.ReactNode> = {
  react: (
    <Svg>
      <circle cx="12" cy="12" r="2.1" fill="#61DAFB" />
      {[0, 60, 120].map((a) => (
        <ellipse key={a} cx="12" cy="12" rx="10" ry="3.9" fill="none" stroke="#61DAFB" strokeWidth="1.2" transform={`rotate(${a} 12 12)`} />
      ))}
    </Svg>
  ),
  next: (
    <Svg>
      <circle cx="12" cy="12" r="10.5" fill="#000" stroke="#fff" strokeOpacity=".35" />
      <path d="M8.5 16.5V7.5l8 10.5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.5 7.5v6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  ),
  ts: <Mono t="TS" bg="#3178C6" />,
  js: <Mono t="JS" bg="#F7DF1E" fg="#13101D" />,
  tailwind: (
    <Svg>
      <path
        fill="#38BDF8"
        d="M12 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.91.23 1.57.89 2.29 1.62C13.67 10.62 15.03 12 18 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.91-.23-1.57-.89-2.29-1.62C16.34 6.18 14.98 4.8 12 4.8zM6 12c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.91.23 1.57.89 2.29 1.62C7.67 17.82 9.03 19.2 12 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.91-.23-1.57-.89-2.29-1.62C10.34 13.38 8.98 12 6 12z"
      />
    </Svg>
  ),
  motion: (
    <Svg>
      <path fill="#FFF312" d="M5 2h14v7h-7zM5 9h7l7 7H5zM5 16h7v6z" />
    </Svg>
  ),
  node: (
    <Svg>
      <path fill="#5FA04E" d="M12 1.5l9.1 5.25v10.5L12 22.5l-9.1-5.25V6.75z" />
      <text x="12" y="15.6" textAnchor="middle" fontWeight="700" fontSize="8" fill="#fff" fontFamily="var(--font-jost), sans-serif">
        JS
      </text>
    </Svg>
  ),
  express: (
    <Svg>
      <text x="12" y="16.5" textAnchor="middle" fontSize="14" fill="#EEE9F7" fontFamily="var(--font-dm-mono), monospace">
        ex
      </text>
    </Svg>
  ),
  mongo: (
    <Svg>
      <path fill="#47A248" d="M12 1.5s-6 5.9-6 12.2c0 4 2.6 6.4 5.3 7.5l.7 1.8.7-1.8c2.7-1.1 5.3-3.5 5.3-7.5C18 7.4 12 1.5 12 1.5z" />
      <path d="M12 6v16" stroke="#2C6E2F" strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
  ),
  supabase: (
    <Svg>
      <path fill="#3ECF8E" d="M13.4 1.8 3.6 14.2c-.5.6 0 1.5.8 1.5h7.3l-1.1 6.5 9.8-12.4c.5-.6 0-1.5-.8-1.5h-7.3z" />
    </Svg>
  ),
  rest: <Braces className="h-full w-full text-aqua" strokeWidth={2} aria-hidden />,
  php: (
    <Svg>
      <ellipse cx="12" cy="12" rx="11" ry="6.6" fill="#777BB4" />
      <text x="12" y="14.6" textAnchor="middle" fontWeight="700" fontStyle="italic" fontSize="7.5" fill="#fff" fontFamily="var(--font-jost), sans-serif">
        php
      </text>
    </Svg>
  ),
  laravel: <Box className="h-full w-full" style={{ color: "#FF2D20" }} strokeWidth={2} aria-hidden />,
  mysql: <Database className="h-full w-full" style={{ color: "#4DA3D8" }} strokeWidth={2} aria-hidden />,
  git: (
    <Svg>
      <rect x="4" y="4" width="16" height="16" rx="2.6" fill="#F05032" transform="rotate(45 12 12)" />
      <path d="M10 8v8M10 10l4 2.4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="8" r="1.5" fill="#fff" />
      <circle cx="10" cy="16" r="1.5" fill="#fff" />
      <circle cx="14.4" cy="12.6" r="1.5" fill="#fff" />
    </Svg>
  ),
  github: <Github className="h-full w-full text-text" strokeWidth={1.8} aria-hidden />,
  vscode: (
    <Svg>
      <path fill="#2F9BEA" fillRule="evenodd" d="M17 2.2 21.8 4.5v15L17 21.8 8 13.6l-3.7 2.9L2.2 15.4V8.6l2.1-1.1L8 10.4zM17 7.6 12 12l5 4.4z" />
    </Svg>
  ),
  postman: (
    <Svg>
      <circle cx="12" cy="12" r="10.5" fill="#FF6C37" />
      <path fill="#fff" d="M7 15.6 15.8 7.2l1.4 1.4-8.4 8.8-2.6.9z" />
    </Svg>
  ),
  vercel: (
    <Svg>
      <path fill="#EEE9F7" d="M12 3.5 21.5 20h-19z" />
    </Svg>
  ),
  netlify: (
    <Svg>
      <rect x="5" y="5" width="14" height="14" rx="2.5" fill="#32E6E2" transform="rotate(45 12 12)" />
      <path d="M8.5 12h7M12 8.5v7" stroke="#0E3B3A" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  ),
  shopify: (
    <Svg>
      <path d="M8.5 7.5V6.4a3.5 3.5 0 0 1 7 0v1.1" fill="none" stroke="#95BF47" strokeWidth="1.7" />
      <path fill="#95BF47" d="M5 7.2h14l1.3 14.6H3.7z" />
      <text x="12" y="18.4" textAnchor="middle" fontWeight="700" fontSize="9" fill="#fff" fontFamily="var(--font-jost), sans-serif">
        S
      </text>
    </Svg>
  ),
  chariow: <Store className="h-full w-full text-orange-text" strokeWidth={2} aria-hidden />,
  facebook: (
    <Svg>
      <circle cx="12" cy="12" r="10.5" fill="#0866FF" />
      <path
        fill="#fff"
        d="M13.2 22.4V15h2.5l.4-2.9h-2.9v-1.8c0-.8.3-1.4 1.4-1.4h1.6V6.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2H7.5V15h2.6v7.2z"
      />
    </Svg>
  ),
  tiktok: (
    <Svg>
      {(
        [
          ["#25F4EE", -0.9, -0.6],
          ["#FE2C55", 0.9, 0.6],
          ["#fff", 0, 0],
        ] as const
      ).map(([c, dx, dy]) => (
        <g key={c} transform={`translate(${dx} ${dy})`} fill="none" stroke={c} strokeWidth="2.3" strokeLinecap="round">
          <path d="M13.5 3v11.6a3.4 3.4 0 1 1-3.4-3.4" />
          <path d="M13.5 3.2c.6 2.6 2.3 4 4.8 4.2" />
        </g>
      ))}
    </Svg>
  ),
  gads: (
    <Svg>
      <path d="M7 18 12.2 6" stroke="#FBBC04" strokeWidth="5" strokeLinecap="round" />
      <path d="M12.2 6 17.4 18" stroke="#4285F4" strokeWidth="5" strokeLinecap="round" />
      <circle cx="7" cy="18" r="2.6" fill="#34A853" />
    </Svg>
  ),
};

export function FallbackMark({ id }: { id: LogoId }) {
  return <>{marks[id]}</>;
}
