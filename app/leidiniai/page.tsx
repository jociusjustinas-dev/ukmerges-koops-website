import { CmsPageController } from "../../components/CmsPageController";
import { CmsPageSections } from "../../components/CmsPageSections";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { getCmsPageView } from "../../lib/cms-render";
import { createPageMetadata } from "../../lib/metadata";
import { getKoopsCmsData } from "../../lib/wordpress";

export const metadata = createPageMetadata({
  title: "Leidiniai | KOOPS",
  description: "KOOPS akcijų leidiniai: viršelis, galiojimo datos, puslapių peržiūra ir PDF atsisiuntimas.",
  path: "/leidiniai",
});

export default async function FlyersArchivePage() {
  const cms = await getKoopsCmsData();
  const { context, sections, footerCtaProps } = getCmsPageView(cms, "leidiniai");

  return (
    <div className="site-shell flyers-page" id="pradzia" data-cms-page="leidiniai">
      <a className="skip-link" href="#turinys">Pereiti prie turinio</a>
      <SiteHeader variant="solid" />

      <main id="turinys">
        <CmsPageSections sections={sections} context={context} skipFooterCta />
      </main>
      <CmsPageController page="leidiniai" sections={sections} />

      <SiteFooter {...footerCtaProps} />
    </div>
  );
}
