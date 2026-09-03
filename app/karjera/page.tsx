import { CareerApplyForm } from "../../components/CareerApplyForm";
import { CareersHero } from "../../components/CareersHero";
import { CareersValueFeatures } from "../../components/sections/CareersValueFeatures";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { AvenirButtonArrow } from "../byq-icons";
import { careersContact } from "../../lib/jobs";
import { getKoopsCmsData } from "../../lib/wordpress";
import { RollingLabel } from "../../components/RollingLabel";
import { CmsPageController } from "../../components/CmsPageController";
import { absoluteUrl } from "../../lib/site-url";
import { createPageMetadata } from "../../lib/metadata";

export const metadata = createPageMetadata({
  title: "Karjera | KOOPS Ukmergėje ir rajone",
  description: "Darbo pasiūlymai KOOPS: parduotuvės, restoranas „Vilkmergė“ ir logistika. Aiški pozicija, vieta ir paprastas kandidatavimas.",
  path: "/karjera",
});

export default async function CareersPage() {
  const { jobs, pages } = await getKoopsCmsData();
  const jobSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "KOOPS darbo pasiūlymai",
    itemListElement: jobs.map((job, index) => ({
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
        <CareersHero />

        <CareersValueFeatures />

        {/* BYQ: structured-data-2 careers list — same language as homepage tt-jobs */}
        <section
          className="tt-jobs careers-jobs"
          id="pozicijos"
          aria-labelledby="careers-jobs-title"
          data-byq-component="structured-data-2-careers"
          data-cms-section="careers-jobs"
        >
          <div className="tt-container jobs-layout">
            <div className="jobs-intro">
              <p className="section-label light-label">LAISVOS POZICIJOS</p>
              <h2 id="careers-jobs-title" className="jobs-title-with-rule">
                Darbas arti
                <i className="jobs-title-rule" aria-hidden="true" />
                <span> namų</span>
              </h2>
              <p>
                Pasirinkite poziciją ir pereikite prie kandidatavimo formos. Nerandate tinkamos
                pozicijos? Parašykite mums žemiau.
              </p>
              <a className="pill-button accent" href="#susisiekti">
                <RollingLabel>Neradau pozicijos</RollingLabel>
              </a>
            </div>
            <div className="jobs-list" role="region" aria-label="Darbo pasiūlymai">
              {jobs.map((job) => (
                <a
                  className="job-row"
                  href={job.applyUrl}
                  key={job.id}
                  aria-label={`${job.title} — kandidatuoti`}
                >
                  <div className="job-row-copy">
                    <h3>{job.title}</h3>
                    <div className="job-row-meta">
                      <span>{job.type}</span>
                      <span aria-hidden="true">•</span>
                      <span>{job.location}</span>
                      <span aria-hidden="true">•</span>
                      <span>{job.employment}</span>
                    </div>
                    <p className="job-row-summary">{job.summary}</p>
                  </div>
                  <span className="job-row-arrow" aria-hidden="true">
                    <AvenirButtonArrow />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* BYQ: terra-tory-contact-1 — open contact when no matching role */}
        <section
          className="restaurant-enquiry careers-apply"
          id="susisiekti"
          aria-labelledby="careers-apply-title"
          data-byq-component="terra-tory-contact-1"
          data-cms-section="careers-enquiry"
        >
          <div className="tt-container restaurant-enquiry-grid">
            <div className="restaurant-enquiry-intro">
              <p className="section-label">NERADOTE POZICIJOS?</p>
              <h2 id="careers-apply-title">Parašykite mums</h2>
              <p>
                Jei sąraše nėra jums tinkamo skelbimo — palikite kontaktus ir trumpą žinutę.
                Galite prisegti CV. Arba paskambinkite.
              </p>
              <div className="contact-details">
                <div>
                  <strong>Telefonas</strong>
                  <p>
                    <a href={careersContact.phoneHref}>{careersContact.phoneDisplay}</a>
                  </p>
                </div>
                <div>
                  <strong>El. paštas</strong>
                  <p>
                    <a href={`mailto:${careersContact.email}`}>{careersContact.email}</a>
                  </p>
                </div>
                <div>
                  <strong>Adresas</strong>
                  <p>{careersContact.address}</p>
                </div>
              </div>
            </div>
            <CareerApplyForm />
          </div>
        </section>
      </main>
      <CmsPageController page="karjera" sections={pages.karjera?.sections} />

      <SiteFooter showCta={false} />
    </div>
  );
}
