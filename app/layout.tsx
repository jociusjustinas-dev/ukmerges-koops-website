import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "../components/SmoothScroll";
import { CmsProvider } from "../components/CmsProvider";
import { CookieConsent } from "../components/CookieConsent";
import { SITE_URL } from "../lib/site-url";
import { getKoopsCmsData } from "../lib/wordpress";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "KOOPS",
  title: "KOOPS | Parduotuvės Ukmergėje ir rajone",
  description: "Raskite KOOPS parduotuves, darbo laiką, naujienas, restorano „Vilkmergė“ informaciją ir darbo pasiūlymus.",
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "lt_LT",
    siteName: "KOOPS",
    title: "KOOPS | Parduotuvės Ukmergėje ir rajone",
    description: "Raskite KOOPS parduotuves, darbo laiką, naujienas, restorano „Vilkmergė“ informaciją ir darbo pasiūlymus.",
  },
  twitter: {
    card: "summary",
    title: "KOOPS | Parduotuvės Ukmergėje ir rajone",
    description: "Raskite KOOPS parduotuves, darbo laiką, naujienas, restorano „Vilkmergė“ informaciją ir darbo pasiūlymus.",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { options } = await getKoopsCmsData();
  return (
    <html lang="lt">
      <body>
        <CmsProvider options={options}>
          <SmoothScroll />
          {children}
          <CookieConsent />
        </CmsProvider>
      </body>
    </html>
  );
}
