import type { Metadata } from "next";
import { Download, Linkedin, Mail, MessageCircle } from "lucide-react";
import { Section } from "@/components/site/Section";
import { ContactTabs } from "@/components/contact/ContactTabs";
import { Kicker } from "@/components/ui/Badge";
import { asLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { alternates } from "@/i18n/seo";
import { getServices } from "@/content/services";
import { mailto, site } from "@/content/site";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = asLocale((await params).lang);
  const t = getDictionary(lang).contact;
  return { title: t.metaTitle, description: t.metaDescription, alternates: alternates(lang, "/contact") };
}

export default async function ContactPage({ params }: Props) {
  const lang = asLocale((await params).lang);
  const d = getDictionary(lang);
  const t = d.contact;
  const services = getServices(lang).map(({ slug, title, pitch, strand }) => ({ slug, title, pitch, strand }));

  const channels = [
    { icon: Mail, label: site.contact.email, href: mailto(t.emailSubject) },
    { icon: MessageCircle, label: `WhatsApp · ${site.contact.whatsapp}`, href: site.contact.whatsappHref },
    { icon: Linkedin, label: "LinkedIn", href: site.contact.linkedin },
  ];

  return (
    <Section className="pt-10 pb-20 md:pt-16">
      <h1 className="max-w-[14ch] font-display text-[52px] leading-[0.95] font-semibold tracking-[-0.04em] md:text-[88px]">{t.title}</h1>

      <div className="mt-10 grid items-start gap-6 xl:grid-cols-[1fr_20rem]">
        <div>
          <ContactTabs lang={lang} t={d.forms} mailSubject={t.emailSubject} services={services} />
        </div>

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
          <div className="mt-6 border-t border-line pt-5">
            <Kicker>{t.channelsKicker}</Kicker>
            <ul className="mt-3 space-y-2.5 text-base">
              {channels.map(({ icon: Icon, label, href }) => (
                <li key={href}>
                  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex items-center gap-2 font-semibold break-all hover:underline">
                    <Icon size={17} className="shrink-0 text-muted" aria-hidden /> {label}
                  </a>
                </li>
              ))}
              <li>
                <a href={site.cv[lang]} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-semibold hover:underline">
                  <Download size={17} className="shrink-0 text-muted" aria-hidden /> {t.cv}
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </Section>
  );
}
