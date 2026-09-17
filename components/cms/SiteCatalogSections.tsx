import { AvenirButtonArrow } from "../../app/byq-icons";
import type { Classified } from "../../lib/classifieds";
import { contactsOrg, socialLinks as defaultSocials } from "../../lib/contacts";
import { careersContact, type Job } from "../../lib/jobs";
import { restaurant as restaurantDefaults } from "../../lib/restaurant";
import type { Store } from "../../lib/stores";
import { suppliersContact } from "../../lib/suppliers";
import type { NewsItem } from "../../lib/news";
import {
  defaultStoreFaqs,
  defaultRestaurantHalls,
  sectionItemsOrDefault,
  type CmsFaqItem,
  type CmsHallItem,
} from "../../lib/cms-items";
import type { WordPressOptions } from "../../lib/cms-render";
import { CareerApplyForm } from "../CareerApplyForm";
import { ContactEnquiryForm } from "../ContactEnquiryForm";
import { ContactsHeading } from "../ContactsHeading";
import { NewsListing } from "../NewsListing";
import { NewsPageHeading } from "../NewsPageHeading";
import { RestaurantEnquiryForm } from "../RestaurantEnquiryForm";
import { RollingLabel } from "../RollingLabel";
import { StoresFinder } from "../StoresFinder";
import { SupplierForm } from "../SupplierForm";

export const storeFaqs = defaultStoreFaqs;

export function StoresDirectory({
  stores,
  eyebrow,
  title,
  description,
}: {
  stores: Store[];
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const lead = description?.trim() || `${stores.length} parduotuvės Ukmergėje ir rajone.`;

  return (
    <section className="stores-directory" id="sarasas" aria-labelledby="stores-list-title" data-cms-section="stores-directory">
      <div className="tt-container">
        <p className="section-label light-label" data-cms-field="eyebrow">
          {eyebrow?.trim() || "PARDUOTUVĖS"}
        </p>
        <h1 className="location-headline" id="stores-list-title" data-cms-field="title">
          {title?.trim() || "Raskite artimiausią KOOPS parduotuvę"}
        </h1>
        <p className="stores-directory-lead" data-cms-field="description">
          {lead}
        </p>
        <StoresFinder stores={stores} />
      </div>
    </section>
  );
}

export function StoresFaq({
  items,
  eyebrow,
  title,
}: {
  items?: CmsFaqItem[];
  eyebrow?: string;
  title?: string;
}) {
  const faqs = sectionItemsOrDefault(items, defaultStoreFaqs);

  return (
    <section className="stores-faq" id="stores-faq" aria-labelledby="stores-faq-title" data-cms-section="stores-faq">
      <div className="tt-container stores-faq-layout">
        <div>
          <p className="section-label" data-cms-field="eyebrow">
            {eyebrow?.trim() || "GREITI ATSAKYMAI"}
          </p>
          <h2 id="stores-faq-title" data-cms-field="title">
            {title?.trim() || "Kur, kada ir kaip — be spėliojimo."}
          </h2>
          <p className="stores-faq-lead" data-cms-field="description" hidden>
            Atsakymai apie parduotuvių vietas, darbo laiką, maršrutą ir kontaktus.
          </p>
        </div>
        <div className="stores-faq-list">
          {faqs.map((item, index) => (
            <details key={`${item.question}-${index}`} open={index === 0 ? true : undefined}>
              <summary>
                <span>{item.question}</span>
                <span className="stores-faq-toggle" aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewsListingSection({
  items,
  title,
}: {
  items: NewsItem[];
  title?: string;
}) {
  return (
    <section className="tt-news news-page-main" id="news-listing" aria-labelledby="news-archive-title" data-byq-component="terra-tory-blog-grid-1" data-cms-section="news-listing">
      <div className="tt-container">
        <NewsPageHeading title={title} />
        <NewsListing items={items} />
      </div>
    </section>
  );
}

export function ClassifiedsListing({
  items,
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryUrl,
}: {
  items: Classified[];
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryUrl?: string;
}) {
  const ctaLabel = primaryLabel?.trim() || "Susisiekti";
  const ctaHref = primaryUrl?.trim() || "/kontaktai";

  return (
    <section className="classifieds-directory" id="classifieds-listing" aria-labelledby="classifieds-title" data-cms-section="classifieds-listing">
      <div className="tt-container classifieds-directory-inner">
        <p className="section-label light-label" data-cms-field="eyebrow">
          {eyebrow?.trim() || "KOOPS SKELBIMAI"}
        </p>
        <h1 id="classifieds-title" data-cms-field="title">
          {title?.trim() || "Skelbimai"}
        </h1>
        <p className="classifieds-directory-lead" data-cms-field="description">
          {description?.trim() ||
            "Nuomojamos patalpos, turto pasiūlymai ir kita aktuali KOOPS informacija vienoje vietoje."}
        </p>
        <div className="classifieds-listing">
          {items.length ? (
            <div className="classifieds-grid">
              {items.map((item) => (
                <article className="classified-card" key={item.slug}>
                  <div className="classified-card-top">
                    <span>{item.category}</span>
                    <span>{item.status}</span>
                  </div>
                  <div>
                    <h2>{item.title}</h2>
                    <p>{item.excerpt}</p>
                  </div>
                  <dl>
                    <div><dt>Vieta</dt><dd>{item.location}</dd></div>
                    {item.area ? <div><dt>Plotas</dt><dd>{item.area}</dd></div> : null}
                    {item.price ? <div><dt>Kaina</dt><dd>{item.price}</dd></div> : null}
                  </dl>
                </article>
              ))}
            </div>
          ) : (
            <div className="classifieds-empty">
              <h2>Naujų skelbimų šiuo metu nėra</h2>
              <p>Jei domina KOOPS nuomojamos patalpos ar kitas turtas, susisiekite su administracija.</p>
              <a className="pill-button accent" href={ctaHref} data-cms-field="primary-link">
                <RollingLabel>{ctaLabel}</RollingLabel>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function RestaurantHalls({
  items,
  eyebrow,
  title,
  primaryLabel,
  primaryUrl,
}: {
  restaurant?: typeof restaurantDefaults;
  items?: CmsHallItem[];
  eyebrow?: string;
  title?: string;
  primaryLabel?: string;
  primaryUrl?: string;
}) {
  const halls = sectionItemsOrDefault(items, defaultRestaurantHalls);
  const [large, bar, small] = [
    halls[0] || defaultRestaurantHalls[0],
    halls[1] || defaultRestaurantHalls[1],
    halls[2] || defaultRestaurantHalls[2],
  ];
  const ctaLabel = primaryLabel?.trim() || "Siųsti užklausą";
  const ctaHref = primaryUrl?.trim() || "#uzklausa";

  return (
    <section className="koops-bento-section restaurant-halls" id="restaurant-halls" aria-labelledby="restaurant-halls-title" data-byq-component="terra-tory-bento-1" data-cms-section="restaurant-halls">
      <div className="tt-container">
        <header className="koops-bento-header">
          <div className="dashed-divider" aria-hidden="true" />
          <p className="section-label" data-cms-field="eyebrow">{eyebrow?.trim() || "SALĖS"}</p>
          <h2 id="restaurant-halls-title" data-cms-field="title">{title?.trim() || "Salės ir talpa"}</h2>
          <p data-cms-field="description" hidden>Vestuvės, jubiliejai, įmonių vakarai.</p>
        </header>
        {/* Fixed 4×2 bento order: card · tall · card · media · media · accent(span 2) */}
        <div className="koops-bento-grid">
          <article className="koops-bento-card" data-cms-item="0">
            <p className="section-label" data-cms-item-field="name">{large.name}</p>
            <div className="koops-bento-card-bottom">
              <div className="koops-bento-card-content">
                <h3 data-cms-item-field="capacity">{large.capacity}</h3>
                <p data-cms-item-field="description">{large.description}</p>
              </div>
            </div>
          </article>
          <div className="koops-bento-media koops-bento-media-tall" aria-hidden="true">
            <img loading="lazy" src={large.imageUrl || "/vilkmerge-hall.jpg"} alt="" data-cms-field="gallery-item" data-cms-item-image="0" />
          </div>
          <article className="koops-bento-card" data-cms-item="1">
            <p className="section-label" data-cms-item-field="name">{bar.name}</p>
            <div className="koops-bento-card-bottom">
              <div className="koops-bento-card-content">
                <h3 data-cms-item-field="capacity">{bar.capacity}</h3>
                <p data-cms-item-field="description">{bar.description}</p>
              </div>
            </div>
          </article>
          <div className="koops-bento-media" aria-hidden="true">
            <img loading="lazy" src={bar.imageUrl || "/vilkmerge-table.jpg"} alt="" data-cms-field="gallery-item" data-cms-item-image="1" />
          </div>
          <div className="koops-bento-media" aria-hidden="true">
            <img loading="lazy" src={small.imageUrl || "/vilkmerge-menu.jpg"} alt="" data-cms-field="gallery-item" data-cms-item-image="2" />
          </div>
          <div className="koops-bento-card koops-bento-card-accent" data-cms-item="2">
            <p className="section-label" data-cms-item-field="name">{small.name}</p>
            <div className="koops-bento-card-content">
              <h3 data-cms-item-field="capacity">{small.capacity}</h3>
              <p data-cms-item-field="description">{small.description}</p>
            </div>
            <div className="koops-bento-actions">
              <a className="text-link" href={ctaHref} data-cms-field="primary-link">
                {ctaLabel} <span aria-hidden="true">→</span>
              </a>
            </div>
            <span className="koops-bento-circle" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function RestaurantEnquiry({
  restaurant,
  eyebrow,
  title,
  description,
}: {
  restaurant: typeof restaurantDefaults;
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  return (
    <section className="restaurant-enquiry" id="uzklausa" aria-labelledby="restaurant-enquiry-title" data-byq-component="terra-tory-contact-1" data-cms-section="restaurant-enquiry">
      <div className="tt-container restaurant-enquiry-grid">
        <div className="restaurant-enquiry-intro">
          <p className="section-label" data-cms-field="eyebrow">{eyebrow?.trim() || "KONTAKTAI IR UŽKLAUSA"}</p>
          <h2 id="restaurant-enquiry-title" data-cms-field="title">{title?.trim() || "Susisiekite arba parašykite"}</h2>
          <p data-cms-field="description">
            {description?.trim() ||
              "Skambinkite tiesiogiai arba užpildykite trumpą formą — suderinsime salę, datą ir meniu."}
          </p>
          <div className="contact-details">
            <div>
              <strong>Telefonai</strong>
              <p><a href={restaurant.phoneHref}>{restaurant.phoneDisplay}</a><br /><a href={restaurant.mobileHref}>{restaurant.mobileDisplay}</a></p>
            </div>
            <div>
              <strong>El. paštas</strong>
              <p><a href={`mailto:${restaurant.email}`}>{restaurant.email}</a></p>
            </div>
            <div>
              <strong>Adresas</strong>
              <p><a href={restaurant.mapUrl} target="_blank" rel="noreferrer">{restaurant.address}</a></p>
            </div>
          </div>
        </div>
        <RestaurantEnquiryForm />
      </div>
    </section>
  );
}

export function CareersJobs({
  jobs,
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryUrl,
}: {
  jobs: Job[];
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryUrl?: string;
}) {
  const ctaLabel = primaryLabel?.trim() || "Neradau pozicijos";
  const ctaHref = primaryUrl?.trim() || "#susisiekti";

  return (
    <section className="tt-jobs careers-jobs" id="pozicijos" aria-labelledby="careers-jobs-title" data-byq-component="structured-data-2-careers" data-cms-section="careers-jobs">
      <div className="tt-container jobs-layout">
        <div className="jobs-intro">
          <p className="section-label light-label" data-cms-field="eyebrow">{eyebrow?.trim() || "LAISVOS POZICIJOS"}</p>
          <h2 id="careers-jobs-title" className="jobs-title-with-rule" data-cms-field="title">
            {title?.trim() || "Darbas arti namų"}
          </h2>
          <p data-cms-field="description">
            {description?.trim() ||
              "Pasirinkite poziciją ir pereikite prie kandidatavimo formos. Nerandate tinkamos pozicijos? Parašykite mums žemiau."}
          </p>
          <a className="pill-button accent" href={ctaHref} data-cms-field="primary-link">
            <RollingLabel>{ctaLabel}</RollingLabel>
          </a>
        </div>
        <div className="jobs-list" role="region" aria-label="Darbo pasiūlymai">
          {jobs.length ? (
            jobs.map((job) => (
              <a className="job-row" href={job.applyUrl} key={job.id} aria-label={`${job.title} — kandidatuoti`}>
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
                <span className="job-row-arrow" aria-hidden="true"><AvenirButtonArrow /></span>
              </a>
            ))
          ) : (
            <p className="jobs-empty">Šiuo metu laisvų pozicijų nėra. Palikite užklausą žemiau — susisieksime, kai atsiras tinkamas pasiūlymas.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export function CareersEnquiry({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
} = {}) {
  return (
    <section className="restaurant-enquiry careers-apply" id="susisiekti" aria-labelledby="careers-apply-title" data-byq-component="terra-tory-contact-1" data-cms-section="careers-enquiry">
      <div className="tt-container restaurant-enquiry-grid">
        <div className="restaurant-enquiry-intro">
          <p className="section-label" data-cms-field="eyebrow">{eyebrow?.trim() || "NERADOTE POZICIJOS?"}</p>
          <h2 id="careers-apply-title" data-cms-field="title">{title?.trim() || "Parašykite mums"}</h2>
          <p data-cms-field="description">
            {description?.trim() ||
              "Jei sąraše nėra jums tinkamo skelbimo — palikite kontaktus ir trumpą žinutę. Galite prisegti CV. Arba paskambinkite."}
          </p>
          <div className="contact-details">
            <div><strong>Telefonas</strong><p><a href={careersContact.phoneHref}>{careersContact.phoneDisplay}</a></p></div>
            <div><strong>El. paštas</strong><p><a href={`mailto:${careersContact.email}`}>{careersContact.email}</a></p></div>
            <div><strong>Adresas</strong><p>{careersContact.address}</p></div>
          </div>
        </div>
        <CareerApplyForm />
      </div>
    </section>
  );
}

export function SuppliersEnquiry({
  imageUrl,
  eyebrow,
  title,
  description,
}: {
  imageUrl?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  return (
    <section className="tt-contact suppliers-contact" id="forma" aria-labelledby="suppliers-form-title" data-byq-component="terra-tory-contact-1" data-cms-section="suppliers-enquiry">
      <div className="tt-container contact-grid">
        <div className="contact-content">
          <div className="contact-heading">
            <p className="section-label" data-cms-field="eyebrow">{eyebrow?.trim() || "PASIŪLYMO FORMA"}</p>
            <h2 id="suppliers-form-title" data-cms-field="title">{title?.trim() || "Pasiūlykite savo produkciją"}</h2>
            <p data-cms-field="description">
              {description?.trim() || "Užpildykite trumpą formą — paruošime laišką."}
            </p>
          </div>
          <div className="contact-details">
            <div><strong>Adresas</strong><p>{suppliersContact.addressLines[0]}<br />{suppliersContact.addressLines[1]}</p></div>
            <div><strong>El. paštas</strong><p><a href={`mailto:${suppliersContact.email}`}>{suppliersContact.email}</a></p></div>
            <div><strong>Telefonas</strong><p><a href={suppliersContact.phoneHref}>{suppliersContact.phoneDisplay}</a></p></div>
          </div>
          <SupplierForm idSuffix="page" />
        </div>
        <div className="contact-image">
          <img className="contact-image-main" loading="lazy" src={imageUrl?.trim() || "/local-produce-couple.jpg"} alt="Vietos produkcija ir kasdienis pirkėjo krepšelis" data-cms-field="image" />
        </div>
      </div>
    </section>
  );
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "").replace(/^0/, "+370")}`;
}

export function ContactForm({
  options,
  imageUrl,
  eyebrow,
  title,
  description,
}: {
  options: WordPressOptions;
  imageUrl?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const addressLines = (options.address || contactsOrg.addressLines.join(", ")).split(/,\s*(?=LT-|\d{5}|Ukmergė)/, 2);
  const org = {
    addressLines: [addressLines[0] || contactsOrg.addressLines[0], addressLines[1] || contactsOrg.addressLines[1]],
    email: options.email || contactsOrg.email,
    phoneDisplay: options.phone || contactsOrg.phoneDisplay,
    phoneHref: phoneHref(options.phone || contactsOrg.phoneDisplay),
    administrationPhoneDisplay: options.administration_phone || contactsOrg.administrationPhoneDisplay,
    administrationPhoneHref: phoneHref(options.administration_phone || contactsOrg.administrationPhoneDisplay),
    officeHours: options.office_hours || contactsOrg.officeHours,
  };
  const socials = defaultSocials.map((item) => ({
    ...item,
    href: item.label === "Facebook" ? options.facebook_url || item.href : options.instagram_url || item.href,
  }));

  return (
    <section className="tt-contact contacts-form-section" id="forma" aria-labelledby="contacts-form-title" data-byq-component="terra-tory-contact-1" data-cms-section="contact-form">
      <div className="tt-container contact-grid">
        <div className="contact-content">
          <ContactsHeading eyebrow={eyebrow} title={title} description={description} />
          <div className="contact-details">
            <div><strong>Adresas</strong><p>{org.addressLines[0]}<br />{org.addressLines[1]}</p></div>
            <div><strong>El. paštas</strong><p><a href={`mailto:${org.email}`}>{org.email}</a></p></div>
            <div><strong>Įmonės vadovas</strong><p><a href={org.phoneHref}>{org.phoneDisplay}</a></p></div>
            <div><strong>Administracija</strong><p><a href={org.administrationPhoneHref}>{org.administrationPhoneDisplay}</a></p></div>
            <div><strong>Darbo laikas</strong><p>{org.officeHours}</p></div>
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
          <img className="contact-image-main" loading="eager" src={imageUrl?.trim() || "/ukmerge-fields-1.jpg"} alt="Ukmergės krašto laukai" data-cms-field="image" />
        </div>
      </div>
    </section>
  );
}
