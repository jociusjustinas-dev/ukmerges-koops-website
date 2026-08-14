import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
