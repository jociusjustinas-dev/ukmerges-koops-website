import type { Metadata } from "next";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { SupplierForm } from "../../components/SupplierForm";
import { SuppliersHero } from "../../components/SuppliersHero";
import { SuppliersLookingFor } from "../../components/sections/SuppliersLookingFor";
import { SuppliersProcess } from "../../components/sections/SuppliersProcess";
import { suppliersContact } from "../../lib/suppliers";
import { getKoopsCmsData } from "../../lib/wordpress";
import { CmsPageController } from "../../components/CmsPageController";

export const metadata: Metadata = {
  title: "Tiekėjams | KOOPS Ukmergė",
  description:
    "Pasiūlykite produkciją KOOPS: ko ieškome, ką pateikti, kam rašyti ir paprasta forma vietos gamintojams.",
};

export default async function SuppliersPage() {
  const { pages } = await getKoopsCmsData();
  return (
    <div className="site-shell suppliers-page" id="pradzia" data-cms-page="tiekejams">
      <a className="skip-link" href="#turinys">
        Pereiti prie turinio
      </a>
      <SiteHeader variant="solid" />

      <main id="turinys">
        <SuppliersHero />

        <SuppliersLookingFor />

        <SuppliersProcess />

        {/* BYQ: terra-tory-contact-1 — same form as index */}
        <section
          className="tt-contact suppliers-contact"
          id="forma"
          aria-labelledby="suppliers-form-title"
          data-byq-component="terra-tory-contact-1"
          data-cms-section="suppliers-enquiry"
        >
          <div className="tt-container contact-grid">
            <div className="contact-content">
              <div className="contact-heading">
                <p className="section-label">PASIŪLYMO FORMA</p>
                <h2 id="suppliers-form-title">Pasiūlykite savo produkciją</h2>
                <p>
                  Užpildykite trumpą formą — paruošime laišką.
                </p>
              </div>
              <div className="contact-details">
                <div>
                  <strong>Adresas</strong>
                  <p>
                    {suppliersContact.addressLines[0]}
                    <br />
                    {suppliersContact.addressLines[1]}
                  </p>
                </div>
                <div>
                  <strong>El. paštas</strong>
                  <p>
                    <a href={`mailto:${suppliersContact.email}`}>{suppliersContact.email}</a>
                  </p>
                </div>
                <div>
                  <strong>Telefonas</strong>
                  <p>
                    <a href={suppliersContact.phoneHref}>{suppliersContact.phoneDisplay}</a>
                  </p>
                </div>
              </div>
              <SupplierForm idSuffix="page" />
            </div>
            <div className="contact-image">
              <img
                className="contact-image-main"
                loading="lazy"
                src="/ukmerge-fields-2.jpg"
                alt="Lietuvos laukai ir kaimo sodybos"
              />
            </div>
          </div>
        </section>
      </main>
      <CmsPageController page="tiekejams" sections={pages.tiekejams?.sections} />

      <SiteFooter showCta={false} />
    </div>
  );
}
