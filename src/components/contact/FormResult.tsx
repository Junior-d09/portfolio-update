import { Check } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FormError } from "@/lib/leads";
import { site } from "@/content/site";

export function Success({ title, text, again, onAgain }: { title: string; text: string; again: string; onAgain: () => void }) {
  return (
    <div className="rounded-[24px] bg-panel p-7 md:p-10" role="status">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-aqua text-ink">
        <Check size={28} strokeWidth={3} aria-hidden />
      </span>
      <h3 className="mt-6 font-display text-4xl leading-tight font-semibold tracking-[-0.02em]">{title}</h3>
      <p className="mt-3 text-lg text-muted">{text}</p>
      <button type="button" onClick={onAgain} className="mt-8 text-base font-semibold underline underline-offset-4">
        {again}
      </button>
    </div>
  );
}

export function ErrorBanner({ error, t }: { error: FormError; t: Dictionary["forms"] }) {
  const withEmail = error !== "invalid" && error !== "captcha";
  return (
    <p className="rounded-xl bg-orange/10 px-4 py-3 text-base text-orange-text ring-1 ring-orange/30" role="alert">
      {t.formErrors[error]}{" "}
      {withEmail && (
        <a href={`mailto:${site.contact.email}`} className="font-semibold underline underline-offset-4">
          {site.contact.email}
        </a>
      )}
    </p>
  );
}
