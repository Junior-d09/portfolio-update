"use server";

import { headers } from "next/headers";
import { getDictionary } from "@/i18n/dictionaries";
import { getServices } from "@/content/services";
import { DEADLINE_KEYS, SUBJECT_KEYS, type LeadState } from "@/lib/leads";
import { hasDatabase, hasEmail, serverEnv } from "@/lib/server/env";
import { validateLead } from "@/lib/server/validate";
import { verifyTurnstile } from "@/lib/server/turnstile";
import { countRecentLeads, insertLead } from "@/lib/server/supabase";
import { sendAcknowledgement, sendNotification } from "@/lib/server/email";

async function hashIp(ip: string) {
  const data = new TextEncoder().encode(`${serverEnv.hashSalt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

/**
 * Reçoit un message ou une demande de devis.
 * Ordre : anti-robot → validation → anti-spam → limite d'envois → base → e-mails.
 */
export async function submitLead(_prev: LeadState, fd: FormData): Promise<LeadState> {
  // 1. Champ piège et envoi trop rapide : on répond « reçu » au robot, sans rien enregistrer.
  const startedAt = Number(fd.get("startedAt") || 0);
  if (String(fd.get("website") ?? "") !== "" || (startedAt && Date.now() - startedAt < 2500)) {
    return { status: "success", ref: "OK", emailed: false };
  }

  const lang = fd.get("lang") === "en" ? "en" : "fr";
  const services = getServices(lang);
  const { input, errors, ok } = validateLead(fd, services.map((s) => s.slug));
  if (!ok) return { status: "error", error: "invalid", fields: errors };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";

  if (!(await verifyTurnstile(String(fd.get("cf-turnstile-response") ?? ""), ip))) {
    return { status: "error", error: "captcha" };
  }

  const db = hasDatabase();
  const mail = hasEmail();
  if (!db && !mail) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] Ni Supabase ni e-mail configurés. Demande reçue en dev :", input);
      return { status: "success", ref: input.type === "devis" ? "DV-DEV" : "MSG-DEV", emailed: false };
    }
    return { status: "error", error: "config" };
  }

  const ipHash = await hashIp(ip);
  try {
    if (db && (await countRecentLeads(ipHash)) >= serverEnv.rateLimitPerHour) {
      return { status: "error", error: "rate" };
    }
    const ref = db ? await insertLead(input, ipHash) : `${input.type === "devis" ? "DV" : "MSG"}-${Date.now().toString(36).toUpperCase()}`;

    let emailed = false;
    if (mail) {
      const fr = getDictionary("fr").forms;
      const labels = {
        service: input.service ? (getServices("fr").find((s) => s.slug === input.service)?.title ?? input.service) : null,
        subject: input.subject ? fr.subjects[SUBJECT_KEYS.indexOf(input.subject)] : null,
        deadline: input.deadline ? fr.deadlines[DEADLINE_KEYS.indexOf(input.deadline)] : null,
      };
      // La demande est déjà en base : un e-mail qui échoue ne doit pas faire échouer l'envoi.
      const results = await Promise.allSettled([sendNotification(input, ref, labels), sendAcknowledgement(input, ref)]);
      results.forEach((r) => r.status === "rejected" && console.error("[contact] e-mail", r.reason));
      if (!db && results[0].status === "rejected") return { status: "error", error: "server" };
      emailed = results[1].status === "fulfilled";
    }
    return { status: "success", ref, emailed };
  } catch (e) {
    console.error("[contact]", e);
    return { status: "error", error: "server" };
  }
}
