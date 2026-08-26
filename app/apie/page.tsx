import type { Metadata } from "next";
import { AboutHero } from "../../components/AboutHero";
import { AboutStory } from "../../components/AboutStory";
import { AboutPillars } from "../../components/sections/AboutPillars";
import { KoopsBentoSection } from "../../components/sections/KoopsBentoSection";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { aboutOrg } from "../../lib/about";

export const metadata: Metadata = {
  title: "Apie KOOPS | Ukmergės rajono vartotojų kooperatyvas",
  description:
    "Ukmergės rajono vartotojų kooperatyvas: žmonės, vieta ir istorija. Parduotuvės, restoranas „Vilkmergė“ ir vietos partnerystė.",
};

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: aboutOrg.legalName,
    alternateName: aboutOrg.shortName,
    email: aboutOrg.email,
    telephone: aboutOrg.phoneHref.replace("tel:", ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: aboutOrg.addressLines[0],
      addressLocality: "Ukmergė",
      postalCode: "LT-20130",
      addressCountry: "LT",
    },
    url: "https://ukmerges-koops-koncepcija.jociusj.chatgpt.site/apie",
  };

  return (
    <div className="site-shell about-page" id="pradzia">
      <a className="skip-link" href="#turinys">
        Pereiti prie turinio
      </a>
      <SiteHeader variant="solid" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main id="turinys">
        <AboutHero />
        <AboutStory />
        <AboutPillars />
        <KoopsBentoSection />
      </main>

      <SiteFooter showCta={false} />
    </div>
  );
}
