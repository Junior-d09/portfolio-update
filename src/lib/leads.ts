/** Types partagés entre les formulaires (client) et la Server Action. */
export type LeadType = "message" | "devis";

export type LeadField =
  | "name"
  | "email"
  | "phone"
  | "subject"
  | "message"
  | "service"
  | "deadline"
  | "existingUrl"
  | "budget"
  | "consent";

export type FieldError = "required" | "email" | "tooShort" | "tooLong" | "url" | "consent";
export type FormError = "invalid" | "captcha" | "rate" | "server" | "config";

export type LeadState =
  | { status: "idle" }
  | { status: "success"; ref: string }
  | { status: "error"; error: FormError; fields?: Partial<Record<LeadField, FieldError>> };

export const initialLeadState: LeadState = { status: "idle" };

/** Index des listes déroulantes (les libellés sont traduits dans dictionaries.ts). */
export const SUBJECT_KEYS = ["freelance", "job", "collab", "question", "other"] as const;
export const DEADLINE_KEYS = ["none", "lt1m", "1to3m", "gt3m"] as const;

export const LIMITS = {
  name: [2, 100],
  email: [5, 200],
  phone: [0, 40],
  message: [10, 5000],
  devisMessage: [20, 5000],
  budget: [0, 100],
  existingUrl: [0, 300],
} as const;
