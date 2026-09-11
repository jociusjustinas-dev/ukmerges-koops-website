import { CmsPageController } from "../../components/CmsPageController";
import { CmsPageSections } from "../../components/CmsPageSections";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { aboutOrg } from "../../lib/about";
import { getCmsPageView } from "../../lib/cms-render";
import { createPageMetadata } from "../../lib/metadata";
import { absoluteUrl } from "../../lib/site-url";
import { getKoopsCmsData } from "../../lib/wordpress";

export const metadata = createPageMetadata({
  title: "Apie KOOPS | Ukmergės rajono vartotojų kooperatyvas",
  description: "Ukmergės rajono vartotojų kooperatyvas: žmonės, vieta ir istorija. Parduotuvės, restoranas „Vilkmergė“ ir vietos partnerystė.",
  path: "/apie",
});

export default async function AboutPage() {
  const cms = await getKoopsCmsData();
  const { context, sections, hasFooterCta } = getCmsPageView(cms, "apie");
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
        <CmsPageSections sections={sections} context={context} skipFooterCta />
      </main>
      <CmsPageController page="apie" sections={sections} />

      <SiteFooter showCta={hasFooterCta} />
    </div>
  );
}
