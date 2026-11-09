import "server-only";
import { serverEnv } from "./env";
import type { LeadInput } from "./validate";

/**
 * Accès Supabase en REST (PostgREST) avec la clé service_role, uniquement côté serveur.
 * Pas de SDK : deux requêtes suffisent pour la phase 2.
 */
function headers(extra: Record<string, string> = {}): Record<string, string> {
  const key = serverEnv.supabaseKey!;
  // Nouvelles clés (sb_secret_…) : uniquement dans `apikey`. Anciennes clés JWT (eyJ…) : aussi en Bearer.
  const auth: Record<string, string> = key.startsWith("sb_") ? {} : { Authorization: `Bearer ${key}` };
  return { apikey: key, ...auth, "Content-Type": "application/json", ...extra };
}

export async function insertLead(input: LeadInput, ipHash: string): Promise<string> {
  const res = await fetch(`${serverEnv.supabaseUrl}/rest/v1/leads`, {
    method: "POST",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify({
      type: input.type,
      lang: input.lang,
      name: input.name,
      email: input.email,
      phone: input.phone,
      subject: input.subject,
      message: input.message,
      service: input.service,
      deadline: input.deadline,
      existing_url: input.existingUrl,
      budget: input.budget,
      ip_hash: ipHash,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Supabase insert ${res.status}: ${await res.text()}`);
  const rows = (await res.json()) as { ref: string }[];
  return rows[0]?.ref ?? "—";
}

/** Nombre de demandes envoyées depuis la même IP (hachée) depuis une heure. */
export async function countRecentLeads(ipHash: string): Promise<number> {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const url = `${serverEnv.supabaseUrl}/rest/v1/leads?select=id&ip_hash=eq.${encodeURIComponent(ipHash)}&created_at=gte.${encodeURIComponent(since)}`;
  const res = await fetch(url, { headers: headers({ Prefer: "count=exact", Range: "0-0" }), cache: "no-store" });
  if (!res.ok) return 0; // en cas de doute, on ne bloque pas un vrai visiteur
  const total = res.headers.get("content-range")?.split("/")[1];
  return total && total !== "*" ? Number(total) : 0;
}
