import { CmsPageController } from "../../components/CmsPageController";
import { CmsPageSections } from "../../components/CmsPageSections";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { getCmsPageView } from "../../lib/cms-render";
import { getKoopsCmsData } from "../../lib/wordpress";
import { createPageMetadata } from "../../lib/metadata";

export const metadata = createPageMetadata({
  title: "Privatumas ir slapukai | KOOPS",
  description: "Informacija apie KOOPS svetainėje naudojamus slapukus, jų paskirtį ir lankytojo pasirinkimų valdymą.",
  path: "/privatumo-politika",
});

export default async function PrivacyPage() {
  const cms = await getKoopsCmsData();
  const { context, sections } = getCmsPageView(cms, "privatumo-politika");

  return (
    <div className="site-shell privacy-page" id="pradzia" data-cms-page="privatumo-politika">
      <a className="skip-link" href="#turinys">Pereiti prie turinio</a>
      <SiteHeader variant="solid" />
      <main id="turinys">
        <CmsPageSections sections={sections} context={context} />
      </main>
      <CmsPageController page="privatumo-politika" sections={sections} />
      <SiteFooter showCta={false} />
    </div>
  );
}
