import { CmsPageController } from "../../components/CmsPageController";
import { CmsPageSections } from "../../components/CmsPageSections";
import { ContactsPageMotion } from "../../components/ContactsPageMotion";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { contactsOrg, socialLinks } from "../../lib/contacts";
import { getCmsPageView } from "../../lib/cms-render";
import { createPageMetadata } from "../../lib/metadata";
import { absoluteUrl } from "../../lib/site-url";
import { getKoopsCmsData } from "../../lib/wordpress";

export const metadata = createPageMetadata({
  title: "Kontaktai | KOOPS Ukmergė",
  description: "KOOPS kontaktai Ukmergėje: adresas, telefonas, el. paštas ir forma. Parduotuvės, restoranas, tiekėjai ir karjera — aiškūs keliai.",
  path: "/kontaktai",
});

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "").replace(/^0/, "+370")}`;
}

export default async function ContactsPage() {
  const cms = await getKoopsCmsData();
  const { context, sections, footerCtaProps } = getCmsPageView(cms, "kontaktai");
  const options = cms.options;
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
    url: absoluteUrl("/kontaktai"),
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
        <CmsPageSections sections={sections} context={context} skipFooterCta />
      </main>
      <CmsPageController page="kontaktai" sections={sections} />

      <SiteFooter {...footerCtaProps} />
    </div>
  );
}
