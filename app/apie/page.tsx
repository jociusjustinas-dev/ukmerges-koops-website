import { AboutHero } from "../../components/AboutHero";
import { AboutStory } from "../../components/AboutStory";
import { AboutPillars } from "../../components/sections/AboutPillars";
import { KoopsBentoSection } from "../../components/sections/KoopsBentoSection";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { aboutOrg } from "../../lib/about";
import { getKoopsCmsData } from "../../lib/wordpress";
import { CmsPageController } from "../../components/CmsPageController";
import { absoluteUrl } from "../../lib/site-url";
import { createPageMetadata } from "../../lib/metadata";

export const metadata = createPageMetadata({
  title: "Apie KOOPS | Ukmergės rajono vartotojų kooperatyvas",
  description: "Ukmergės rajono vartotojų kooperatyvas: žmonės, vieta ir istorija. Parduotuvės, restoranas „Vilkmergė“ ir vietos partnerystė.",
  path: "/apie",
});

export default async function AboutPage() {
  const { pages } = await getKoopsCmsData();
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
    url: absoluteUrl("/apie"),
  };

  return (
    <div className="site-shell about-page" id="pradzia" data-cms-page="apie">
      <a className="skip-link" href="#turinys">
        Pereiti prie turinio
      </a>
      <SiteHeader variant="solid" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main id="turinys">
        <AboutHero />
        <AboutStory />
        <AboutPillars />
        <KoopsBentoSection
          cmsSection="about-bento"
          wideImage={{
            src: "/store-uosis.jpeg",
            alt: "KOOPS parduotuvė „Uosis“",
          }}
        />
      </main>
      <CmsPageController page="apie" sections={pages.apie?.sections} />

      <SiteFooter showCta={false} />
    </div>
  );
}
