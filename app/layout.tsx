import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "../components/SmoothScroll";

export const metadata: Metadata = {
  title: "KOOPS | Parduotuvės Ukmergėje ir rajone",
  description: "Raskite KOOPS parduotuves, darbo laiką, naujienas, restorano „Vilkmergė“ informaciją ir darbo pasiūlymus.",
  icons: {
    icon: "/koops-logo.png",
    shortcut: "/koops-logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="lt">
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
