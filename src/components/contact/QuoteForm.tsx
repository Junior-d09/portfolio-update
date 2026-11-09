"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { submitLead } from "@/app/[lang]/contact/actions";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Service } from "@/content/types";
import { DEADLINE_KEYS, initialLeadState, LIMITS, type FieldError, type LeadField, type LeadState } from "@/lib/leads";
import { strands } from "@/lib/strands";
import { cn } from "@/lib/cn";
import { Field, Honeypot, SubmitButton, inputCls } from "./fields";
import { ErrorBanner, Success } from "./FormResult";
import { Turnstile } from "./Turnstile";

type Errors = Partial<Record<LeadField, FieldError>>;
type ServiceOption = Pick<Service, "slug" | "title" | "pitch" | "strand">;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** À quelle étape se trouve chaque champ (pour revenir sur l'erreur renvoyée par le serveur). */
const STEP_OF: Partial<Record<LeadField, number>> = { service: 0, message: 1, existingUrl: 1, budget: 2, name: 3, email: 3, phone: 3, consent: 3 };

interface Props {
  lang: Locale;
  t: Dictionary["forms"];
  services: ServiceOption[];
  preset?: string | null;
}

export function QuoteForm(props: Props) {
  const [round, setRound] = useState(0);
  return <QuoteFormInner key={`${round}-${props.preset ?? ""}`} {...props} onAgain={() => setRound((r) => r + 1)} />;
}

function QuoteFormInner({ lang, t, services, preset, onAgain }: Props & { onAgain: () => void }) {
  const [step, setStep] = useState(0);
  // Si le serveur refuse un champ, on revient à l'étape concernée.
  const [state, action, pending] = useActionState(async (prev: LeadState, fd: FormData) => {
    const result = await submitLead(prev, fd);
    if (result.status === "error" && result.fields) {
      const steps = Object.keys(result.fields).map((f) => STEP_OF[f as LeadField] ?? 3);
      if (steps.length) setStep(Math.min(...steps));
    }
    return result;
  }, initialLeadState);
  const [v, setV] = useState({
    service: services.some((s) => s.slug === preset) ? (preset as string) : "",
    message: "",
    deadline: DEADLINE_KEYS[0] as string,
    existingUrl: "",
    talk: true,
    budget: "",
    name: "",
    email: "",
    phone: "",
    consent: false,
  });
  const [clientErrors, setClientErrors] = useState<Errors>({});
  const startedAt = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, []);

  if (state.status === "success") {
    return <Success title={t.successQuote} text={t.successText.replace("{ref}", state.ref)} again={t.newRequest} onAgain={onAgain} />;
  }

  const errors: Errors = { ...(state.status === "error" ? state.fields : {}), ...clientErrors };
  const msg = (f: LeadField) => (errors[f] ? t.fieldErrors[errors[f]!] : undefined);
  const aria = (f: LeadField) => ({ "aria-invalid": Boolean(errors[f]), "aria-describedby": errors[f] ? `dv-${f}-error` : undefined });
  const svc = services.find((s) => s.slug === v.service);

  function validate(upTo: number): Errors {
    const e: Errors = {};
    if (upTo >= 0 && !v.service) e.service = "required";
    if (upTo >= 1) {
      if (v.message.trim().length < LIMITS.devisMessage[0]) e.message = v.message.trim() ? "tooShort" : "required";
      if (v.existingUrl.trim() && !/^https?:\/\/[^\s.]+\.[^\s]{2,}/i.test(v.existingUrl.trim())) e.existingUrl = "url";
    }
    if (upTo >= 3) {
      if (v.name.trim().length < LIMITS.name[0]) e.name = v.name.trim() ? "tooShort" : "required";
      if (!EMAIL.test(v.email.trim())) e.email = v.email.trim() ? "email" : "required";
      if (!v.consent) e.consent = "consent";
    }
    return e;
  }

  function next() {
    const errs = validate(step);
    setClientErrors(errs);
    if (Object.keys(errs).length === 0) setStep((s) => Math.min(3, s + 1));
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        // Envoi manuel : React ne vide pas le formulaire, les champs restent remplis en cas d'erreur.
        e.preventDefault();
        const errs = validate(3);
        setClientErrors(errs);
        if (Object.keys(errs).length) {
          setStep(Math.min(...Object.keys(errs).map((f) => STEP_OF[f as LeadField] ?? 3)));
          return;
        }
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
      className="relative rounded-[24px] bg-panel p-6 md:p-8"
    >
      <input type="hidden" name="type" value="devis" />
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="startedAt" ref={startedAt} defaultValue="" />
      <input type="hidden" name="budget" value={v.talk ? "" : v.budget} />
      <Honeypot />

      <ol className="flex gap-2" aria-label={`${t.step} ${step + 1} / 4`}>
        {t.steps.map((label, i) => (
          <li key={label} className="flex-1" aria-current={i === step ? "step" : undefined}>
            <div className={cn("h-1.5 rounded-full transition-colors", i <= step ? "bg-violet" : "bg-line")} />
            <p className={cn("mt-2 hidden text-sm md:block", i === step ? "text-text" : "text-muted")}>{label}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-muted md:hidden">
        {t.step} {step + 1}/4 · {t.steps[step]}
      </p>

      <div className="mt-6 min-h-[18rem] md:mt-8">
        {/* Étape 1 · Prestation */}
        <fieldset hidden={step !== 0}>
          <legend className="sr-only">{t.steps[0]}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((s) => {
              const selected = v.service === s.slug;
              const hex = s.strand ? strands[s.strand].hex : "#EEE9F7";
              return (
                <label
                  key={s.slug}
                  className={cn("cursor-pointer rounded-2xl p-5 transition-all", selected ? "bg-raise" : "bg-ink")}
                  style={{ boxShadow: `inset 0 0 0 ${selected ? 2 : 1}px ${selected ? hex : "#332C47"}` }}
                >
                  <input type="radio" name="service" value={s.slug} checked={selected} onChange={() => setV({ ...v, service: s.slug })} className="sr-only" />
                  <span className="flex items-center justify-between">
                    <span className="h-1.5 w-10 rounded-full" style={{ background: hex }} />
                    {selected && <Check size={18} style={{ color: hex }} aria-hidden />}
                  </span>
                  <span className="mt-4 block font-display text-[22px] font-medium">{s.title}</span>
                  <span className="mt-1 block text-base text-muted">{s.pitch}</span>
                </label>
              );
            })}
          </div>
          {errors.service && (
            <p className="mt-3 text-sm text-orange-text" role="alert">
              {msg("service")}
            </p>
          )}
        </fieldset>

        {/* Étape 2 · Projet */}
        <fieldset hidden={step !== 1} className="grid gap-5">
          <legend className="sr-only">{t.steps[1]}</legend>
          <Field id="dv-message" label={t.describe} error={msg("message")}>
            <textarea id="dv-message" name="message" rows={5} maxLength={LIMITS.devisMessage[1]} className={inputCls} value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} placeholder={t.describePlaceholder} {...aria("message")} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="dv-deadline" label={t.deadline}>
              <select id="dv-deadline" name="deadline" className={inputCls} value={v.deadline} onChange={(e) => setV({ ...v, deadline: e.target.value })}>
                {DEADLINE_KEYS.map((key, i) => (
                  <option key={key} value={key}>
                    {t.deadlines[i]}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="dv-existingUrl" label={t.existing} optional={t.optional} error={msg("existingUrl")}>
              <input id="dv-existingUrl" name="existingUrl" type="url" inputMode="url" maxLength={LIMITS.existingUrl[1]} className={inputCls} value={v.existingUrl} onChange={(e) => setV({ ...v, existingUrl: e.target.value })} placeholder="https://" {...aria("existingUrl")} />
            </Field>
          </div>
        </fieldset>

        {/* Étape 3 · Budget */}
        <fieldset hidden={step !== 2} className="grid gap-5">
          <legend className="sr-only">{t.steps[2]}</legend>
          <div className="flex flex-wrap gap-2" role="radiogroup">
            {([
              [true, t.budgetTalk],
              [false, t.budgetHave],
            ] as const).map(([talk, label]) => (
              <button
                key={label}
                type="button"
                role="radio"
                aria-checked={v.talk === talk}
                onClick={() => setV({ ...v, talk })}
                className={cn("h-11 rounded-full px-5 text-base font-semibold", v.talk === talk ? "bg-text text-ink" : "bg-ink text-muted ring-1 ring-line")}
              >
                {label}
              </button>
            ))}
          </div>
          {!v.talk && (
            <Field id="dv-budget" label={t.budget} optional={t.optional} error={msg("budget")}>
              <input id="dv-budget" maxLength={LIMITS.budget[1]} className={inputCls} value={v.budget} onChange={(e) => setV({ ...v, budget: e.target.value })} placeholder={t.budgetPlaceholder} />
            </Field>
          )}
          <p className="rounded-2xl bg-ink p-5 text-base text-muted ring-1 ring-line">{t.noEstimate}</p>
        </fieldset>

        {/* Étape 4 · Coordonnées */}
        <fieldset hidden={step !== 3} className="grid gap-5">
          <legend className="sr-only">{t.steps[3]}</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="dv-name" label={t.name} error={msg("name")}>
              <input id="dv-name" name="name" autoComplete="name" maxLength={LIMITS.name[1]} className={inputCls} value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} placeholder={t.nameCompanyPlaceholder} {...aria("name")} />
            </Field>
            <Field id="dv-email" label={t.email} error={msg("email")}>
              <input id="dv-email" name="email" type="email" autoComplete="email" maxLength={LIMITS.email[1]} className={inputCls} value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} placeholder={t.emailPlaceholder} {...aria("email")} />
            </Field>
          </div>
          <Field id="dv-phone" label={t.phone} optional={t.optional} error={msg("phone")}>
            <input id="dv-phone" name="phone" type="tel" autoComplete="tel" maxLength={LIMITS.phone[1]} className={inputCls} value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} />
          </Field>
          <div className="rounded-2xl bg-ink p-5 text-base">
            <p className="font-mono text-sm tracking-[0.14em] text-muted uppercase">{t.summary}</p>
            <p className="mt-3">
              <span className="text-muted">{t.steps[0]} · </span>
              {svc?.title ?? "—"}
            </p>
            <p className="mt-1">
              <span className="text-muted">{t.deadline} · </span>
              {t.deadlines[DEADLINE_KEYS.indexOf(v.deadline as (typeof DEADLINE_KEYS)[number])]}
            </p>
            <p className="mt-1">
              <span className="text-muted">{t.steps[2]} · </span>
              {v.talk || !v.budget.trim() ? t.toDiscuss : v.budget}
            </p>
          </div>
          <div>
            <label className="flex items-start gap-3 text-base">
              <input type="checkbox" name="consent" checked={v.consent} onChange={(e) => setV({ ...v, consent: e.target.checked })} className="mt-1 h-5 w-5 shrink-0 accent-violet" {...aria("consent")} />
              <span className="text-muted">{t.consent}</span>
            </label>
            {errors.consent && (
              <p id="dv-consent-error" className="mt-2 text-sm text-orange-text" role="alert">
                {msg("consent")}
              </p>
            )}
          </div>
          {step === 3 && <Turnstile lang={lang} resetKey={state} />}
          {state.status === "error" && state.error !== "invalid" && <ErrorBanner error={state.error} t={t} />}
        </fieldset>
      </div>

      <div className="mt-6 flex items-center justify-between">
        {step > 0 ? (
          <button type="button" onClick={() => setStep(step - 1)} className="inline-flex items-center gap-2 text-base font-semibold text-muted hover:text-text">
            <ArrowLeft size={18} aria-hidden /> {t.back}
          </button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <button type="button" onClick={next} className="inline-flex h-12 items-center gap-2 rounded-full bg-violet px-6 text-base font-semibold text-white hover:brightness-110">
            {t.next} <ArrowRight size={18} aria-hidden />
          </button>
        ) : (
          <SubmitButton pending={pending}>{pending ? t.sending : t.sendQuote}</SubmitButton>
        )}
      </div>
    </form>
  );
}
