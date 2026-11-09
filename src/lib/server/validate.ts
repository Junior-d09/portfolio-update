import "server-only";
import { DEADLINE_KEYS, LIMITS, SUBJECT_KEYS, type FieldError, type LeadField, type LeadType } from "@/lib/leads";

export interface LeadInput {
  type: LeadType;
  lang: "fr" | "en";
  name: string;
  email: string;
  phone: string | null;
  subject: (typeof SUBJECT_KEYS)[number] | null;
  message: string;
  service: string | null;
  deadline: (typeof DEADLINE_KEYS)[number] | null;
  existingUrl: string | null;
  budget: string | null;
}

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function length(value: string, [min, max]: readonly [number, number], required: boolean): FieldError | null {
  if (!value) return required ? "required" : null;
  if (value.length < min) return "tooShort";
  if (value.length > max) return "tooLong";
  return null;
}

/** Valide le formulaire côté serveur. Le navigateur valide aussi, mais seul ce contrôle fait foi. */
export function validateLead(fd: FormData, serviceSlugs: string[]) {
  const type: LeadType = str(fd, "type") === "devis" ? "devis" : "message";
  const errors: Partial<Record<LeadField, FieldError>> = {};
  const set = (field: LeadField, e: FieldError | null) => {
    if (e) errors[field] = e;
  };

  const name = str(fd, "name");
  const email = str(fd, "email").toLowerCase();
  const phone = str(fd, "phone");
  const message = str(fd, "message");
  const budget = str(fd, "budget");
  const existingUrl = str(fd, "existingUrl");

  set("name", length(name, LIMITS.name, true));
  set("email", !email ? "required" : !EMAIL.test(email) ? "email" : email.length > LIMITS.email[1] ? "tooLong" : null);
  set("phone", length(phone, LIMITS.phone, false));
  set("message", length(message, type === "devis" ? LIMITS.devisMessage : LIMITS.message, true));
  set("budget", length(budget, LIMITS.budget, false));
  set("existingUrl", length(existingUrl, LIMITS.existingUrl, false));
  if (existingUrl && !/^https?:\/\/[^\s.]+\.[^\s]{2,}/i.test(existingUrl)) set("existingUrl", "url");
  if (fd.get("consent") !== "on") set("consent", "consent");

  const subjectRaw = str(fd, "subject");
  const subject = (SUBJECT_KEYS as readonly string[]).includes(subjectRaw) ? (subjectRaw as LeadInput["subject"]) : null;
  const deadlineRaw = str(fd, "deadline");
  const deadline = (DEADLINE_KEYS as readonly string[]).includes(deadlineRaw) ? (deadlineRaw as LeadInput["deadline"]) : null;
  const serviceRaw = str(fd, "service");
  const service = serviceSlugs.includes(serviceRaw) ? serviceRaw : null;

  if (type === "message" && !subject) set("subject", "required");
  if (type === "devis" && !service) set("service", "required");

  const input: LeadInput = {
    type,
    lang: str(fd, "lang") === "en" ? "en" : "fr",
    name,
    email,
    phone: phone || null,
    subject: type === "message" ? subject : null,
    message,
    service: type === "devis" ? service : null,
    deadline: type === "devis" ? (deadline ?? "none") : null,
    existingUrl: existingUrl || null,
    budget: budget || null,
  };

  return { input, errors, ok: Object.keys(errors).length === 0 };
}
