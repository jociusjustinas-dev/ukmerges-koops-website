import type { Metadata } from "next";
import { ContactEnquiryForm } from "../../components/ContactEnquiryForm";
import { ContactsHeading } from "../../components/ContactsHeading";
import { ContactsPageMotion } from "../../components/ContactsPageMotion";
import { ContactChannels } from "../../components/sections/ContactChannels";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { contactsOrg, socialLinks } from "../../lib/contacts";

export const metadata: Metadata = {
  title: "Kontaktai | KOOPS Ukmergė",
  description:
    "KOOPS kontaktai Ukmergėje: adresas, telefonas, el. paštas ir forma. Parduotuvės, restoranas, tiekėjai ir karjera — aiškūs keliai.",
};

export default function ContactsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: contactsOrg.legalName,
    alternateName: contactsOrg.shortName,
    email: contactsOrg.email,
    telephone: contactsOrg.phoneHref.replace("tel:", ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: contactsOrg.addressLines[0],
      addressLocality: "Ukmergė",
      postalCode: "LT-20130",
      addressCountry: "LT",
    },
    url: "https://ukmerges-koops-koncepcija.jociusj.chatgpt.site/kontaktai",
    sameAs: socialLinks.map((item) => item.href),
  };

  return (
    <div className="site-shell contacts-page" id="pradzia">
      <a className="skip-link" href="#turinys">
        Pereiti prie turinio
      </a>
      <SiteHeader variant="solid" />
      <ContactsPageMotion />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main id="turinys">
        {/* BYQ: terra-tory-contact-1 — pirmasis blokas, apvalintas */}
        <section
          className="tt-contact contacts-form-section"
          id="forma"
          aria-labelledby="contacts-form-title"
          data-byq-component="terra-tory-contact-1"
        >
          <div className="tt-container contact-grid">
            <div className="contact-content">
              <ContactsHeading />
              <div className="contact-details">
                <div>
                  <strong>Adresas</strong>
                  <p>
                    {contactsOrg.addressLines[0]}
                    <br />
                    {contactsOrg.addressLines[1]}
                  </p>
                </div>
                <div>
                  <strong>El. paštas</strong>
                  <p>
                    <a href={`mailto:${contactsOrg.email}`}>{contactsOrg.email}</a>
                  </p>
                </div>
                <div>
                  <strong>Įmonės vadovas</strong>
                  <p>
                    <a href={contactsOrg.phoneHref}>{contactsOrg.phoneDisplay}</a>
                  </p>
                </div>
                <div>
                  <strong>Administracija</strong>
                  <p>
                    <a href={contactsOrg.administrationPhoneHref}>{contactsOrg.administrationPhoneDisplay}</a>
                  </p>
                </div>
                <div>
                  <strong>Darbo laikas</strong>
                  <p>{contactsOrg.officeHours}</p>
                </div>
                <div>
                  <strong>Socialiniai</strong>
                  <p className="contacts-social-links">
                    {socialLinks.map((item) => (
                      <a key={item.href} href={item.href} target="_blank" rel="noreferrer">{item.label}</a>
                    ))}
                  </p>
                </div>
              </div>
              <ContactEnquiryForm idSuffix="page" />
            </div>
            <div className="contact-image">
              <img
                className="contact-image-main"
                loading="eager"
                src="/ukmerge-fields-1.jpg"
                alt="Ukmergės krašto laukai"
              />
            </div>
          </div>
        </section>

        <ContactChannels />
      </main>

      <SiteFooter showCta={false} />
    </div>
  );
}
