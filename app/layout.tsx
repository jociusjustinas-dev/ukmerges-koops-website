import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "../components/SmoothScroll";
import { CmsProvider } from "../components/CmsProvider";
import { getKoopsCmsData } from "../lib/wordpress";

export const metadata: Metadata = {
  title: "KOOPS | Parduotuvės Ukmergėje ir rajone",
  description: "Raskite KOOPS parduotuves, darbo laiką, naujienas, restorano „Vilkmergė“ informaciją ir darbo pasiūlymus.",
  icons: {
    icon: "/koops-logo.png",
    shortcut: "/koops-logo.png",
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
        </CmsProvider>
      </body>
    </html>
  );
}
