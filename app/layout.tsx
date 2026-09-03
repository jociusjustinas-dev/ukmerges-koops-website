import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "../components/SmoothScroll";
import { CmsProvider } from "../components/CmsProvider";
import { CookieConsent } from "../components/CookieConsent";
import { SITE_URL } from "../lib/site-url";
import { getKoopsCmsData } from "../lib/wordpress";
import { createPageMetadata } from "../lib/metadata";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "KOOPS",
  ...createPageMetadata({
    title: "KOOPS | Parduotuvės Ukmergėje ir rajone",
    description: "Raskite KOOPS parduotuves, darbo laiką, naujienas, restorano „Vilkmergė“ informaciją ir darbo pasiūlymus.",
    path: "/",
  }),
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: "/icon.png",
    apple: [{ url: "/icon.png", type: "image/png" }],
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { options } = await getKoopsCmsData();
  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: options.legal_name || "Ukmergės rajono vartotojų kooperatyvas",
        alternateName: "KOOPS",
        url: SITE_URL,
        logo: `${SITE_URL}/koops-logo.png`,
        email: options.email || "direktore@urvk.lt",
        telephone: options.phone || "0 340 53235",
        address: {
          "@type": "PostalAddress",
          streetAddress: options.address || "Vasario 16-osios g. 30, LT-20130 Ukmergė",
          addressLocality: "Ukmergė",
          addressCountry: "LT",
        },
        sameAs: [options.facebook_url, options.instagram_url].filter(Boolean),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "KOOPS",
        inLanguage: "lt-LT",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
  return (
    <html lang="lt">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <CmsProvider options={options}>
          <SmoothScroll />
          {children}
          <CookieConsent />
        </CmsProvider>
      </body>
    </html>
  );
}
