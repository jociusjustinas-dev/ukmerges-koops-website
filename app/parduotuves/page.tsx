import { CmsPageController } from "../../components/CmsPageController";
import { CmsPageSections } from "../../components/CmsPageSections";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { StoresPageMotion } from "../../components/StoresPageMotion";
import { storeFaqs } from "../../components/cms/SiteCatalogSections";
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
  const { context, sections, hasFooterCta } = getCmsPageView(cms, "parduotuves");

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
        mainEntity: storeFaqs.map((item) => (
          {
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          }
        )),
      }) }} />
      <SiteFooter
        showCta={hasFooterCta}
        ctaHref="/restoranas"
        ctaLabel="Apie restoraną"
        ctaAriaLabel="Apie restoraną Vilkmergė"
        ctaTitleDesktop={["Stalui ir šventei —", "restoranas Vilkmergė"]}
        ctaTitleMobile={["Stalui ir šventei —", "restoranas", "Vilkmergė"]}
      />
    </div>
  );
}
