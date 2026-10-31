import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Navigateur en anglais → /en, sinon → /fr
      { source: "/", has: [{ type: "header", key: "accept-language", value: "^en.*" }], destination: "/en", permanent: false },
      { source: "/", destination: "/fr", permanent: false },
      // Anciennes URL sans langue (V1) → version française
      { source: "/:page(parcours|projets|services|contact)/:rest*", destination: "/fr/:page/:rest*", permanent: true },
    ];
  },
};

export default nextConfig;
