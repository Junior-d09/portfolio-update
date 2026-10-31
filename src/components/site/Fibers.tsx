import type { Strand } from "@/content/types";
import { site } from "@/content/site";
import { strandOrder, strands } from "@/lib/strands";

const PATHS: Record<Strand, string> = {
  web: "M 78 60 C 240 60, 250 180, 366 180",
  api: "M 78 180 L 366 180",
  ecom: "M 78 300 C 240 300, 250 180, 366 180",
};
const PORT_Y: Record<Strand, number> = { web: 60, api: 180, ecom: 300 };

interface FibersProps {
  active?: Strand | null;
  onHover?: (s: Strand | null) => void;
  label: string;
  className?: string;
}

/** Signature visuelle : trois fibres (web, API, e-commerce) qui convergent vers la photo de Junior. */
export function Fibers({ active = null, onHover, label, className }: FibersProps) {
  return (
    <svg
      viewBox="0 0 560 360"
      className={className}
      role="img"
      aria-label={label}
    >
      <defs>
        <filter id="fiber-glow" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="node-photo">
          <circle cx="450" cy="180" r="78" />
        </clipPath>
      </defs>
      {strandOrder.map((id, i) => {
        const s = strands[id];
        const dim = active !== null && active !== id;
        return (
          <g
            key={id}
            style={{ opacity: dim ? 0.18 : 1, transition: "opacity .35s" }}
            onMouseEnter={() => onHover?.(id)}
            onMouseLeave={() => onHover?.(null)}
          >
            <path d={PATHS[id]} fill="none" stroke={s.hex} strokeOpacity=".28" strokeWidth="6" strokeLinecap="round" />
            <path
              d={PATHS[id]}
              pathLength={1000}
              fill="none"
              stroke={s.hex}
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#fiber-glow)"
              className="fiber-pulse"
              style={{ ["--dur" as string]: `${2.6 + i * 0.7}s`, ["--delay" as string]: `${-i * 0.9}s` }}
            />
            <rect x="6" y={PORT_Y[id] - 17} width="72" height="34" rx="6" fill="#1B1727" stroke={s.hex} strokeWidth="2" />
            <text
              x="42"
              y={PORT_Y[id] + 5}
              textAnchor="middle"
              fill={s.hex}
              fontFamily="var(--font-dm-mono), monospace"
              fontSize="14"
              fontWeight="500"
            >
              {s.label}
            </text>
          </g>
        );
      })}
      <circle cx="450" cy="180" r="88" fill="#9466FF" className="node-breathe" />
      <circle cx="450" cy="180" r="82" fill="#EEE9F7" />
      <image
        href={site.photo}
        x="372"
        y="102"
        width="156"
        height="156"
        clipPath="url(#node-photo)"
        preserveAspectRatio="xMidYMid slice"
      />
    </svg>
  );
}
