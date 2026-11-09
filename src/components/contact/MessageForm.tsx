"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import { submitLead } from "@/app/[lang]/contact/actions";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { initialLeadState, LIMITS, SUBJECT_KEYS, type FieldError, type LeadField } from "@/lib/leads";
import { site } from "@/content/site";
import { Field, Honeypot, SubmitButton, inputCls } from "./fields";
import { ErrorBanner, Success } from "./FormResult";
import { Turnstile } from "./Turnstile";

type Errors = Partial<Record<LeadField, FieldError>>;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function MessageForm(props: { lang: Locale; t: Dictionary["forms"] }) {
  const [round, setRound] = useState(0);
  return <MessageFormInner key={round} {...props} onAgain={() => setRound((r) => r + 1)} />;
}

function MessageFormInner({ lang, t, onAgain }: { lang: Locale; t: Dictionary["forms"]; onAgain: () => void }) {
  const [state, action, pending] = useActionState(submitLead, initialLeadState);
  const [v, setV] = useState({ name: "", email: "", subject: SUBJECT_KEYS[0] as string, message: "", consent: false });
  const [clientErrors, setClientErrors] = useState<Errors>({});
  const startedAt = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, []);

  if (state.status === "success") {
    return <Success title={t.successMessage} text={t.successText.replace("{ref}", state.ref)} again={t.newRequest} onAgain={onAgain} />;
  }

  const errors: Errors = { ...(state.status === "error" ? state.fields : {}), ...clientErrors };
  const msg = (f: LeadField) => (errors[f] ? t.fieldErrors[errors[f]!] : undefined);
  const aria = (f: LeadField) => ({ "aria-invalid": Boolean(errors[f]), "aria-describedby": errors[f] ? `msg-${f}-error` : undefined });

  function validate(): Errors {
    const e: Errors = {};
    if (v.name.trim().length < LIMITS.name[0]) e.name = v.name.trim() ? "tooShort" : "required";
    if (!EMAIL.test(v.email.trim())) e.email = v.email.trim() ? "email" : "required";
    if (v.message.trim().length < LIMITS.message[0]) e.message = v.message.trim() ? "tooShort" : "required";
    if (!v.consent) e.consent = "consent";
    return e;
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        // Envoi manuel : React ne vide pas le formulaire, les champs restent remplis en cas d'erreur.
        e.preventDefault();
        const errs = validate();
        setClientErrors(errs);
        if (Object.keys(errs).length) return;
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
      className="relative grid gap-5 rounded-[24px] bg-panel p-6 md:grid-cols-2 md:p-8"
    >
      <input type="hidden" name="type" value="message" />
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="startedAt" ref={startedAt} defaultValue="" />
      <Honeypot />

      <Field id="msg-name" label={t.name} error={msg("name")}>
        <input id="msg-name" name="name" autoComplete="name" maxLength={LIMITS.name[1]} className={inputCls} value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} placeholder={t.namePlaceholder} {...aria("name")} />
      </Field>
      <Field id="msg-email" label={t.email} error={msg("email")}>
        <input id="msg-email" name="email" type="email" autoComplete="email" maxLength={LIMITS.email[1]} className={inputCls} value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} placeholder={t.emailPlaceholder} {...aria("email")} />
      </Field>
      <Field id="msg-subject" label={t.subject} error={msg("subject")} className="md:col-span-2">
        <select id="msg-subject" name="subject" className={inputCls} value={v.subject} onChange={(e) => setV({ ...v, subject: e.target.value })}>
          {SUBJECT_KEYS.map((key, i) => (
            <option key={key} value={key}>
              {t.subjects[i]}
            </option>
          ))}
        </select>
      </Field>
      <Field id="msg-message" label={t.message} error={msg("message")} className="md:col-span-2">
        <textarea id="msg-message" name="message" rows={5} maxLength={LIMITS.message[1]} className={inputCls} value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} placeholder={t.messagePlaceholder} {...aria("message")} />
      </Field>

      <div className="md:col-span-2">
        <label className="flex items-start gap-3 text-base">
          <input type="checkbox" name="consent" checked={v.consent} onChange={(e) => setV({ ...v, consent: e.target.checked })} className="mt-1 h-5 w-5 shrink-0 accent-violet" {...aria("consent")} />
          <span className="text-muted">{t.consent}</span>
        </label>
        {errors.consent && (
          <p id="msg-consent-error" className="mt-2 text-sm text-orange-text" role="alert">
            {msg("consent")}
          </p>
        )}
      </div>

      <div className="md:col-span-2">
        <Turnstile lang={lang} resetKey={state} />
      </div>
      {state.status === "error" && state.error !== "invalid" && (
        <div className="md:col-span-2">
          <ErrorBanner error={state.error} t={t} />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 md:col-span-2">
        <span className="flex items-center gap-2 text-sm text-muted">
          <MessageCircle size={16} aria-hidden /> {t.faster}{" "}
          <a href={site.contact.whatsappHref} target="_blank" rel="noreferrer" className="font-semibold text-text underline underline-offset-4">
            WhatsApp
          </a>
        </span>
        <SubmitButton pending={pending}>{pending ? t.sending : t.send}</SubmitButton>
      </div>
    </form>
  );
}
