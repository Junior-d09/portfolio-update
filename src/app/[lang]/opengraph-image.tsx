import { ImageResponse } from "next/og";
import { asLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { site } from "@/content/site";

export const alt = "Junior Dofonsou · Web developer / Développeur web";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = asLocale((await params).lang);
  const t = getDictionary(lang);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#13101D",
          color: "#EEE9F7",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#3DD6C8" }}>{t.meta.ogKicker}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, fontWeight: 700, lineHeight: 0.9, letterSpacing: -5 }}>Junior</div>
          <div style={{ fontSize: 132, fontWeight: 700, lineHeight: 0.9, letterSpacing: -5, color: "#D0BEFF" }}>Dofonsou</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 34, color: "#CBC4DD" }}>{site.jobTitle[lang]}</div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ width: 90, height: 12, borderRadius: 6, background: "#9466FF" }} />
            <div style={{ width: 90, height: 12, borderRadius: 6, background: "#3DD6C8" }} />
            <div style={{ width: 90, height: 12, borderRadius: 6, background: "#FF8B42" }} />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
