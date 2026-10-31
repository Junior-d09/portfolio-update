import type { Locale } from "@/i18n/config";
import { getAbout } from "@/content/about";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/** Citation de Junior, signée à la main (police Caveat). */
export function SignedQuote({ lang, size = "lg" }: { lang: Locale; size?: "lg" | "md" }) {
  return (
    <figure className="relative h-full overflow-hidden rounded-[24px] bg-panel p-7 ring-1 ring-violet/35 md:p-9">
      <span className="absolute top-3 left-6 font-display text-[96px] leading-none text-violet/55" aria-hidden>
        “
      </span>
      <span className="pointer-events-none absolute -right-16 -bottom-24 h-56 w-56 rounded-full bg-violet/20 blur-3xl" aria-hidden />
      <blockquote
        className={cn(
          "relative mt-12 font-display leading-snug font-medium",
          size === "lg" ? "text-[26px] md:text-[30px]" : "text-[22px] md:text-[26px]",
        )}
      >
        {getAbout(lang).quote}
      </blockquote>
      <figcaption className="relative mt-6 flex justify-end">
        <span className="signature -rotate-3 text-[34px] leading-none text-violet-text">{site.name}</span>
      </figcaption>
    </figure>
  );
}
