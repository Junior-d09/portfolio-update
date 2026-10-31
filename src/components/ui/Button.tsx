import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "light" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-violet text-white",
  light: "bg-text text-ink",
  ghost: "text-text ring-[1.5px] ring-inset ring-line hover:ring-muted",
};

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
}

export function ButtonLink({ href, children, variant = "primary", className, external }: ButtonLinkProps) {
  const cls = cn(
    "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold transition-all duration-200 hover:brightness-110 active:scale-[.98]",
    variants[variant],
    className,
  );
  if (external || href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 text-base font-semibold text-text">
      {children}
      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}
