import { CmsPageController } from "../../components/CmsPageController";
import { CmsPageSections } from "../../components/CmsPageSections";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { StoresPageMotion } from "../../components/StoresPageMotion";
import { defaultStoreFaqs, sectionItemsOrDefault, type CmsFaqItem } from "../../lib/cms-items";
import { getCmsPageView } from "../../lib/cms-render";
import { createPageMetadata } from "../../lib/metadata";
import { getKoopsCmsData } from "../../lib/wordpress";

export const metadata = createPageMetadata({
  title: "Parduotuvės | KOOPS Ukmergėje ir rajone",
  description: "Raskite artimiausią KOOPS parduotuvę: adresą, darbo laiką, telefoną ir maršrutą Ukmergėje bei rajone.",
  path: "/parduotuves",
});

export default async function StoresPage() {
  const cms = await getKoopsCmsData();
  const { context, sections, footerCtaProps } = getCmsPageView(cms, "parduotuves");
  const faqSection = sections.find((section) => section.type === "stores-faq");
  const faqs = sectionItemsOrDefault(faqSection?.items as CmsFaqItem[] | undefined, defaultStoreFaqs);

  return (
    <div className="site-shell stores-page" id="pradzia" data-cms-page="parduotuves">
      <a className="skip-link" href="#turinys">Pereiti prie turinio</a>
      <SiteHeader />
      <StoresPageMotion />

      <main id="turinys">
        <CmsPageSections sections={sections} context={context} skipFooterCta />
      </main>
      <CmsPageController page="parduotuves" sections={sections} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => (
          {
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          }
        )),
      }) }} />
      <SiteFooter {...footerCtaProps} />
    </div>
  );
}
