import { CmsPageController } from "../../components/CmsPageController";
import { CmsPageSections } from "../../components/CmsPageSections";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { getCmsPageView } from "../../lib/cms-render";
import { createPageMetadata } from "../../lib/metadata";
import { getKoopsCmsData } from "../../lib/wordpress";

export const metadata = createPageMetadata({
  title: "Tiekėjams | KOOPS Ukmergė",
  description: "Pasiūlykite produkciją KOOPS: ko ieškome, ką pateikti, kam rašyti ir paprasta forma vietos gamintojams.",
  path: "/tiekejams",
});

export default async function SuppliersPage() {
  const cms = await getKoopsCmsData();
  const { context, sections, hasFooterCta } = getCmsPageView(cms, "tiekejams");

  return (
    <div className="site-shell suppliers-page" id="pradzia" data-cms-page="tiekejams">
      <a className="skip-link" href="#turinys">
        Pereiti prie turinio
      </a>
      <SiteHeader variant="solid" />

      <main id="turinys">
        <CmsPageSections sections={sections} context={context} skipFooterCta />
      </main>
      <CmsPageController page="tiekejams" sections={sections} />

      <SiteFooter showCta={hasFooterCta} />
    </div>
  );
}
