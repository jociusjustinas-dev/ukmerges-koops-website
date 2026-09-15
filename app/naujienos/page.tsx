import { CmsPageController } from "../../components/CmsPageController";
import { CmsPageSections } from "../../components/CmsPageSections";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { getCmsPageView } from "../../lib/cms-render";
import { createPageMetadata } from "../../lib/metadata";
import { getKoopsCmsData } from "../../lib/wordpress";

export const metadata = createPageMetadata({
  title: "Naujienos ir akcijos | KOOPS",
  description: "KOOPS naujienos, akcijos ir Ukmergės krašto aktualijos — vietos produkcija, parduotuvės ir restoranas „Vilkmergė“.",
  path: "/naujienos",
});

export default async function NewsArchivePage() {
  const cms = await getKoopsCmsData();
  const { context, sections, footerCtaProps } = getCmsPageView(cms, "naujienos");

  return (
    <div className="site-shell news-page" id="pradzia" data-cms-page="naujienos">
      <a className="skip-link" href="#turinys">Pereiti prie turinio</a>
      <SiteHeader variant="solid" />

      <main id="turinys">
        <CmsPageSections sections={sections} context={context} skipFooterCta />
      </main>
      <CmsPageController page="naujienos" sections={sections} />

      <SiteFooter {...footerCtaProps} />
    </div>
  );
}
