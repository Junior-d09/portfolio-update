import type { Metadata } from "next";
import { ArrowUpRight, CalendarDays, Download, Linkedin, Mail, MessageCircle } from "lucide-react";
import { Section } from "@/components/site/Section";
import { Kicker } from "@/components/ui/Badge";
import { asLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { alternates } from "@/i18n/seo";
import { mailto, site } from "@/content/site";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = asLocale((await params).lang);
  const t = getDictionary(lang).contact;
  return { title: t.metaTitle, description: t.metaDescription, alternates: alternates(lang, "/contact") };
}

export default async function ContactPage({ params }: Props) {
  const lang = asLocale((await params).lang);
  const t = getDictionary(lang).contact;

  const channels = [
    { icon: Mail, title: t.emailTitle, detail: site.contact.email, hint: t.emailHint, href: mailto(t.emailSubject), accent: "text-violet-text" },
    { icon: MessageCircle, title: "WhatsApp", detail: site.contact.whatsapp, hint: t.whatsappHint, href: site.contact.whatsappHref, accent: "text-aqua" },
    site.bookingUrl
      ? { icon: CalendarDays, title: t.callTitle, detail: t.callDetail, hint: t.callHint, href: site.bookingUrl, accent: "text-orange-text" }
      : {
          icon: Linkedin,
          title: "LinkedIn",
          detail: "linkedin.com/in/juniordofonsou",
          hint: t.linkedinHint,
          href: site.contact.linkedin,
          accent: "text-orange-text",
        },
  ];

  return (
    <Section className="pt-10 pb-20 md:pt-16">
      <h1 className="max-w-[14ch] font-display text-[52px] leading-[0.95] font-semibold tracking-[-0.04em] md:text-[88px]">{t.title}</h1>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
        <ul className="grid gap-3 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {channels.map(({ icon: Icon, title, detail, hint, href, accent }) => (
            <li key={title}>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex h-full flex-col rounded-[24px] bg-panel p-6 transition-colors hover:bg-raise"
              >
                <span className="flex items-center justify-between">
                  <Icon size={24} className={accent} aria-hidden />
                  <ArrowUpRight size={20} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                <span className="mt-8 font-display text-[28px] leading-tight font-medium">{title}</span>
                <span className="mt-1 text-base font-semibold break-all">{detail}</span>
                <span className="mt-2 text-base text-muted">{hint}</span>
              </a>
            </li>
          ))}
        </ul>

        <aside className="rounded-[24px] p-6 ring-1 ring-line">
          <Kicker className="text-violet-text">{t.nextKicker}</Kicker>
          <ul className="mt-4 space-y-4 text-base">
            {t.next.map(([title, detail]) => (
              <li key={title}>
                <span className="font-semibold">{title}</span>
                <span className="block text-muted">{detail}</span>
              </li>
            ))}
          </ul>
          <a
            href={site.cv[lang]}
            target="_blank"
            rel="noreferrer"
            className="mt-6 flex items-center gap-2 border-t border-line pt-5 text-base font-semibold hover:underline"
          >
            <Download size={18} aria-hidden /> {t.cv}
          </a>
        </aside>
      </div>
    </Section>
  );
}
