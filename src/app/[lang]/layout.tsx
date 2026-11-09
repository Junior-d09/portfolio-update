import type { Metadata, Viewport } from "next";
import { Caveat, DM_Mono, Hind, Jost } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { asLocale, locales, ogLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { alternates } from "@/i18n/seo";
import { bookingTarget, site } from "@/content/site";

const jost = Jost({ subsets: ["latin"], variable: "--font-jost", display: "swap" });
const hind = Hind({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-hind", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], weight: ["500"], variable: "--font-caveat", display: "swap" });

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

/** Seules /fr et /en existent. Tout le reste → 404. */
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const lang = asLocale((await params).lang);
  const t = getDictionary(lang);
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.title, template: `%s · ${site.name}` },
    description: site.description[lang],
    authors: [{ name: site.fullName, url: site.url }],
    openGraph: {
      type: "website",
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
      siteName: site.name,
      url: `/${lang}`,
    },
    twitter: { card: "summary_large_image" },
    alternates: alternates(lang),
  };
}

export const viewport: Viewport = {
  themeColor: "#13101D",
  colorScheme: "dark",
};

export default async function LangLayout({ children, params }: Props) {
  const lang = asLocale((await params).lang);
  const t = getDictionary(lang);
  return (
    <html lang={lang} className={`${jost.variable} ${hind.variable} ${dmMono.variable} ${caveat.variable}`}>
      <body className="min-h-dvh bg-ink font-sans text-text antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-violet focus:px-4 focus:py-2 focus:text-white"
        >
          {t.meta.skip}
        </a>
        <Header lang={lang} t={t.nav} cv={site.cv[lang]} booking={bookingTarget(lang)} />
        <main id="contenu">{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  );
}
