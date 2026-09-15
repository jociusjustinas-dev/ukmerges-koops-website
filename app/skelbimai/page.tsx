import { ClassifiedsPageMotion } from "../../components/ClassifiedsPageMotion";
import { CmsPageController } from "../../components/CmsPageController";
import { CmsPageSections } from "../../components/CmsPageSections";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { getCmsPageView } from "../../lib/cms-render";
import { createPageMetadata } from "../../lib/metadata";
import { getKoopsCmsData } from "../../lib/wordpress";

export const metadata = createPageMetadata({
  title: "Skelbimai | KOOPS Ukmergė",
  description: "KOOPS skelbimai: nuomojamos patalpos, turto pasiūlymai ir kita aktuali informacija Ukmergėje bei rajone.",
  path: "/skelbimai",
});

export default async function ClassifiedsPage() {
  const cms = await getKoopsCmsData();
  const { context, sections, footerCtaProps } = getCmsPageView(cms, "skelbimai");

  return (
    <div className="site-shell classifieds-page" id="pradzia" data-cms-page="skelbimai">
      <a className="skip-link" href="#turinys">Pereiti prie turinio</a>
      <ClassifiedsPageMotion />
      <SiteHeader />

      <main id="turinys">
        <CmsPageSections sections={sections} context={context} skipFooterCta />
      </main>
      <CmsPageController page="skelbimai" sections={sections} />

      <SiteFooter {...footerCtaProps} />
    </div>
  );
}
