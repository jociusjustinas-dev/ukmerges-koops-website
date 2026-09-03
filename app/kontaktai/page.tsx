import type { Metadata } from "next";
import { ContactEnquiryForm } from "../../components/ContactEnquiryForm";
import { ContactsHeading } from "../../components/ContactsHeading";
import { ContactsPageMotion } from "../../components/ContactsPageMotion";
import { ContactChannels } from "../../components/sections/ContactChannels";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { contactsOrg, socialLinks } from "../../lib/contacts";
import { getKoopsCmsData } from "../../lib/wordpress";
import { CmsPageController } from "../../components/CmsPageController";

export const metadata: Metadata = {
  title: "Kontaktai | KOOPS Ukmergė",
  description:
    "KOOPS kontaktai Ukmergėje: adresas, telefonas, el. paštas ir forma. Parduotuvės, restoranas, tiekėjai ir karjera — aiškūs keliai.",
};

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "").replace(/^0/, "+370")}`;
}

export default async function ContactsPage() {
  const { options, pages } = await getKoopsCmsData();
  const addressLines = (options.address || contactsOrg.addressLines.join(", ")).split(/,\s*(?=LT-|\d{5}|Ukmergė)/, 2);
  const org = {
    ...contactsOrg,
    legalName: options.legal_name || contactsOrg.legalName,
    addressLines: [addressLines[0] || contactsOrg.addressLines[0], addressLines[1] || contactsOrg.addressLines[1]],
    email: options.email || contactsOrg.email,
    phoneDisplay: options.phone || contactsOrg.phoneDisplay,
    phoneHref: phoneHref(options.phone || contactsOrg.phoneDisplay),
    administrationPhoneDisplay: options.administration_phone || contactsOrg.administrationPhoneDisplay,
    administrationPhoneHref: phoneHref(options.administration_phone || contactsOrg.administrationPhoneDisplay),
    officeHours: options.office_hours || contactsOrg.officeHours,
    privacyUrl: options.privacy_url || contactsOrg.privacyUrl,
  };
  const socials = socialLinks.map((item) => ({
    ...item,
    href: item.label === "Facebook" ? options.facebook_url || item.href : options.instagram_url || item.href,
  }));
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.legalName,
    alternateName: org.shortName,
    email: org.email,
    telephone: org.phoneHref.replace("tel:", ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: org.addressLines[0],
      addressLocality: "Ukmergė",
      postalCode: "LT-20130",
      addressCountry: "LT",
    },
    url: "https://ukmerges-koops-koncepcija.jociusj.chatgpt.site/kontaktai",
    sameAs: socials.map((item) => item.href),
  };

  return (
    <div className="site-shell contacts-page" id="pradzia" data-cms-page="kontaktai">
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
          data-cms-section="contact-form"
        >
          <div className="tt-container contact-grid">
            <div className="contact-content">
              <ContactsHeading />
              <div className="contact-details">
                <div>
                  <strong>Adresas</strong>
                  <p>
                    {org.addressLines[0]}
                    <br />
                    {org.addressLines[1]}
                  </p>
                </div>
                <div>
                  <strong>El. paštas</strong>
                  <p>
                    <a href={`mailto:${org.email}`}>{org.email}</a>
                  </p>
                </div>
                <div>
                  <strong>Įmonės vadovas</strong>
                  <p>
                    <a href={org.phoneHref}>{org.phoneDisplay}</a>
                  </p>
                </div>
                <div>
                  <strong>Administracija</strong>
                  <p>
                    <a href={org.administrationPhoneHref}>{org.administrationPhoneDisplay}</a>
                  </p>
                </div>
                <div>
                  <strong>Darbo laikas</strong>
                  <p>{org.officeHours}</p>
                </div>
                <div>
                  <strong>Socialiniai</strong>
                  <p className="contacts-social-links">
                    {socials.map((item) => (
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
      <CmsPageController page="kontaktai" sections={pages.kontaktai?.sections} />

      <SiteFooter showCta={false} />
    </div>
  );
}
