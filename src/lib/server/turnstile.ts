import "server-only";
import { serverEnv } from "./env";

/** Vérifie le jeton Cloudflare Turnstile. Sans clé configurée, la vérification est ignorée. */
export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!serverEnv.turnstileSecret) return true;
  if (!token) return false;
  const body = new URLSearchParams({ secret: serverEnv.turnstileSecret, response: token });
  if (ip !== "unknown") body.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body, cache: "no-store" });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
