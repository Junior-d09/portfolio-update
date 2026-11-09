import "server-only";

/** Variables serveur. Jamais importées côté navigateur (le paquet server-only casse le build si c'est le cas). */
export const serverEnv = {
  get supabaseUrl() {
    // Accepte aussi l'adresse copiée depuis « Data API » (…/rest/v1/) : on garde seulement https://xxxx.supabase.co
    return process.env.SUPABASE_URL?.trim().replace(/\/+$/, "").replace(/\/rest\/v1$/, "") || null;
  },
  get supabaseKey() {
    return process.env.SUPABASE_SERVICE_ROLE_KEY || null;
  },
  /** "brevo" ou "resend". Par défaut : Brevo si sa clé est renseignée, sinon Resend. */
  get emailProvider(): "brevo" | "resend" {
    const p = process.env.EMAIL_PROVIDER?.toLowerCase();
    if (p === "brevo" || p === "resend") return p;
    return process.env.BREVO_API_KEY ? "brevo" : "resend";
  },
  get brevoKey() {
    return process.env.BREVO_API_KEY || null;
  },
  get resendKey() {
    return process.env.RESEND_API_KEY || null;
  },
  /** Expéditeur, ex. "Junior Dofonsou <christdofonsou@gmail.com>". RESEND_FROM reste accepté. */
  get emailFrom() {
    return process.env.EMAIL_FROM || process.env.RESEND_FROM || null;
  },
  get contactTo() {
    return process.env.CONTACT_TO || "christdofonsou@gmail.com";
  },
  get turnstileSecret() {
    return process.env.TURNSTILE_SECRET_KEY || null;
  },
  get rateLimitPerHour() {
    return Number(process.env.LEAD_RATE_LIMIT_PER_HOUR || 3);
  },
  get hashSalt() {
    return process.env.LEAD_HASH_SALT || "portfolio-junior-dofonsou";
  },
};

export const hasDatabase = () => Boolean(serverEnv.supabaseUrl && serverEnv.supabaseKey);
export const hasEmail = () =>
  Boolean(serverEnv.emailFrom && (serverEnv.emailProvider === "brevo" ? serverEnv.brevoKey : serverEnv.resendKey));
