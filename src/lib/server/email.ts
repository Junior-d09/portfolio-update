import "server-only";
import { site } from "@/content/site";
import { serverEnv } from "./env";
import type { LeadInput } from "./validate";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const nl2br = (s: string) => esc(s).replace(/\n/g, "<br>");

type Mail = { to: string; subject: string; html: string; text: string; replyTo?: string };

/** "Junior Dofonsou <contact@x.com>" → { name, email } */
function parseFrom(from: string) {
  const m = from.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  return m ? { name: m[1].replace(/^"|"$/g, "") || site.name, email: m[2] } : { name: site.name, email: from.trim() };
}

async function sendWithResend(mail: Mail) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${serverEnv.resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: serverEnv.emailFrom,
      to: [mail.to],
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      reply_to: mail.replyTo,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

/**
 * Brevo (API transactionnelle). Sans domaine vérifié, Brevo remplace le domaine de l'expéditeur
 * par le sien : l'e-mail part quand même. L'adresse d'expéditeur doit être validée dans Brevo > Senders.
 */
async function sendWithBrevo(mail: Mail) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": serverEnv.brevoKey!, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      sender: parseFrom(serverEnv.emailFrom!),
      to: [{ email: mail.to }],
      subject: mail.subject,
      htmlContent: mail.html,
      textContent: mail.text,
      ...(mail.replyTo ? { replyTo: { email: mail.replyTo } } : {}),
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Brevo ${res.status}: ${await res.text()}`);
}

const send = (mail: Mail) => (serverEnv.emailProvider === "brevo" ? sendWithBrevo(mail) : sendWithResend(mail));

function layout(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#13101D;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#EEE9F7">
<div style="max-width:560px;margin:0 auto;background:#1B1727;border-radius:20px;padding:32px">
<div style="height:4px;width:120px;border-radius:4px;background:linear-gradient(90deg,#9466FF,#3DD6C8,#FF8B42);margin-bottom:24px"></div>
<h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;color:#EEE9F7">${title}</h1>
${body}
<p style="margin:28px 0 0;font-size:13px;color:#CBC4DD">${esc(site.name)} · ${esc(site.city)}</p>
</div></body></html>`;
}

const row = (label: string, value: string | null) =>
  value ? `<tr><td style="padding:6px 12px 6px 0;color:#CBC4DD;vertical-align:top;white-space:nowrap">${esc(label)}</td><td style="padding:6px 0;color:#EEE9F7">${nl2br(value)}</td></tr>` : "";

/** Notification pour Junior, toujours en français. Répondre au mail répond directement au visiteur. */
export async function sendNotification(input: LeadInput, ref: string, labels: { service: string | null; subject: string | null; deadline: string | null }) {
  const kind = input.type === "devis" ? "Demande de devis" : "Message";
  const html = layout(
    `${kind} ${esc(ref)}`,
    `<table style="border-collapse:collapse;font-size:15px;line-height:1.5">
${row("Nom", input.name)}${row("E-mail", input.email)}${row("Téléphone", input.phone)}
${row("Prestation", labels.service)}${row("Sujet", labels.subject)}${row("Délai", labels.deadline)}
${row("Site existant", input.existingUrl)}${row("Budget", input.budget ?? (input.type === "devis" ? "À discuter" : null))}
${row("Langue", input.lang.toUpperCase())}
</table>
<div style="margin-top:20px;padding:16px;border-radius:12px;background:#241F33;font-size:15px;line-height:1.6">${nl2br(input.message)}</div>
<p style="margin-top:20px;font-size:14px;color:#CBC4DD">Réponds directement à cet e-mail pour écrire à ${esc(input.name)}.</p>`,
  );
  const text = `${kind} ${ref}\n\nNom : ${input.name}\nE-mail : ${input.email}\n${labels.service ? `Prestation : ${labels.service}\n` : ""}${labels.subject ? `Sujet : ${labels.subject}\n` : ""}\n${input.message}`;
  await send({ to: serverEnv.contactTo, subject: `[Portfolio] ${kind} ${ref} · ${input.name}`, html, text, replyTo: input.email });
}

/** Accusé de réception pour le visiteur, dans sa langue. */
export async function sendAcknowledgement(input: LeadInput, ref: string) {
  const en = input.lang === "en";
  const first = esc(input.name.split(" ")[0] ?? input.name);
  const title = en ? `Thanks ${first}, I got your ${input.type === "devis" ? "request" : "message"}.` : `Merci ${first}, j’ai bien reçu ${input.type === "devis" ? "ta demande" : "ton message"}.`;
  const body = en
    ? `<p style="font-size:16px;line-height:1.6;color:#CBC4DD">Your reference: <strong style="color:#EEE9F7">${esc(ref)}</strong>.</p>
<p style="font-size:16px;line-height:1.6;color:#CBC4DD">I read every request myself and I’ll get back to you personally. No automatic quote: if a proposal makes sense, I’ll prepare it by hand.</p>
<p style="font-size:16px;line-height:1.6;color:#CBC4DD">Need to add something? Just reply to this email.</p>`
    : `<p style="font-size:16px;line-height:1.6;color:#CBC4DD">Ta référence : <strong style="color:#EEE9F7">${esc(ref)}</strong>.</p>
<p style="font-size:16px;line-height:1.6;color:#CBC4DD">Je lis chaque demande moi-même et je te réponds personnellement. Pas de devis automatique : si une proposition a du sens, je la prépare à la main.</p>
<p style="font-size:16px;line-height:1.6;color:#CBC4DD">Un détail à ajouter ? Réponds simplement à cet e-mail.</p>`;
  const text = en
    ? `Thanks ${input.name}, I got your message. Reference: ${ref}. I'll get back to you personally.`
    : `Merci ${input.name}, j'ai bien reçu ${input.type === "devis" ? "ta demande" : "ton message"}. Référence : ${ref}. Je te réponds personnellement.`;
  await send({ to: input.email, subject: en ? `Got it · ${ref}` : `Bien reçu · ${ref}`, html: layout(title, body), text, replyTo: serverEnv.contactTo });
}
