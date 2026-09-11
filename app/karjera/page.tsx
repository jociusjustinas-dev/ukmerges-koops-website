import { CmsPageController } from "../../components/CmsPageController";
import { CmsPageSections } from "../../components/CmsPageSections";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { getCmsPageView } from "../../lib/cms-render";
import { createPageMetadata } from "../../lib/metadata";
import { absoluteUrl } from "../../lib/site-url";
import { getKoopsCmsData } from "../../lib/wordpress";

export const metadata = createPageMetadata({
  title: "Karjera | KOOPS Ukmergėje ir rajone",
  description: "Darbo pasiūlymai KOOPS: parduotuvės, restoranas „Vilkmergė“ ir logistika. Aiški pozicija, vieta ir paprastas kandidatavimas.",
  path: "/karjera",
});

export default async function CareersPage() {
  const cms = await getKoopsCmsData();
  const { context, sections, hasFooterCta } = getCmsPageView(cms, "karjera");
  const jobSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "KOOPS darbo pasiūlymai",
    itemListElement: cms.jobs.map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: job.title,
      description: job.summary,
      url: absoluteUrl(job.applyUrl),
    })),
  };

  return (
    <div className="site-shell careers-page" id="pradzia" data-cms-page="karjera">
      <a className="skip-link" href="#turinys">
        Pereiti prie turinio
      </a>
      <SiteHeader variant="solid" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }} />

      <main id="turinys">
        <CmsPageSections sections={sections} context={context} skipFooterCta />
      </main>
      <CmsPageController page="karjera" sections={sections} />

      <SiteFooter showCta={hasFooterCta} />
    </div>
  );
}
