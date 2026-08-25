import type { Metadata } from "next";
import { CareerApplyForm } from "../../components/CareerApplyForm";
import { CareersHero } from "../../components/CareersHero";
import { CareersValueFeatures } from "../../components/sections/CareersValueFeatures";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { AvenirButtonArrow } from "../byq-icons";
import { careersContact, jobs } from "../../lib/jobs";
import { RollingLabel } from "../../components/RollingLabel";

export const metadata: Metadata = {
  title: "Karjera | KOOPS Ukmergėje ir rajone",
  description:
    "Darbo pasiūlymai KOOPS: parduotuvės, restoranas „Vilkmergė“ ir logistika. Aiški pozicija, vieta ir paprastas kandidatavimas.",
};

export default function CareersPage() {
  const jobSchema = {
    "@context": "https://schema.org",
    "@graph": jobs.map((job) => ({
      "@type": "JobPosting",
      title: job.title,
      description: job.summary,
      employmentType: job.employment.includes("Dalinis") ? "PART_TIME" : "FULL_TIME",
      hiringOrganization: {
        "@type": "Organization",
        name: "Ukmergės rajono vartotojų kooperatyvas",
        sameAs: "https://ukmergeskoops.lt",
      },
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Ukmergė",
          addressCountry: "LT",
        },
      },
    })),
  };

  return (
    <div className="site-shell careers-page" id="pradzia">
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
        >
          <div className="tt-container jobs-layout">
            <div className="jobs-intro">
              <p className="section-label light-label">LAISVOS POZICIJOS</p>
              <h2 id="careers-jobs-title">Darbas arti namų</h2>
              <p>
                Pasirinkite skelbimą — kandidatuosite išorinėje nuorodoje. Nerandate tinkamos
                pozicijos? Parašykite forma apačioje. {careersContact.applyNote}
              </p>
              <a className="pill-button accent" href="#susisiekti">
                <RollingLabel>Neradau pozicijos</RollingLabel>
              </a>
            </div>
            <div className="jobs-list" aria-label="Darbo pasiūlymai">
              {jobs.map((job) => (
                <a
                  className="job-row"
                  href={job.applyUrl}
                  key={job.id}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${job.title} — kandidatuoti naujame lange`}
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

      <SiteFooter showCta={false} />
    </div>
  );
}
