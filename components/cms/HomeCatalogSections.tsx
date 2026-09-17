"use client";

import * as React from "react";
import Image from "next/image";
import type { Job } from "../../lib/jobs";
import { newsHref, type NewsItem } from "../../lib/news";
import { restaurant as restaurantDefaults } from "../../lib/restaurant";
import type { Store } from "../../lib/stores";
import { AvenirButtonArrow, ByqChevron } from "../../app/byq-icons";
import { RollingLabel } from "../RollingLabel";
import { SupplierForm } from "../SupplierForm";

const heroUpdates = [
  {
    label: "NAUJIENOS",
    title: "Švieži vietos pomidorai – sezono pradžia",
    image: "/koops-bento-local-shopping.jpg",
    href: "/naujienos",
  },
  {
    label: "RESTORANAS",
    title: "Planuojate šventę „Vilkmergėje“?",
    image: "/vilkmerge.jpg",
    href: "/restoranas",
  },
  {
    label: "KARJERA",
    title: "Nauji darbo pasiūlymai Ukmergėje",
    image: "/local-produce-customer.jpg",
    href: "/karjera",
  },
];

const restaurantSlides = [
  { src: "/vilkmerge-hall.jpg", alt: "Šventei paruošta restorano „Vilkmergė“ pokylių salė" },
  { src: "/vilkmerge-table.jpg", alt: "Šventiškai serviruotas restorano stalas" },
  { src: "/vilkmerge-menu.jpg", alt: "Restorano „Vilkmergė“ ruošiami užkandžiai" },
];

export function HomeHero({
  imageUrl,
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryUrl,
}: {
  imageUrl?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryUrl?: string;
}) {
  const [heroUpdateIndex, setHeroUpdateIndex] = React.useState(0);
  const [heroUpdatesPaused, setHeroUpdatesPaused] = React.useState(false);
  const activeHeroUpdate = heroUpdates[heroUpdateIndex];
  const heroImage = imageUrl?.trim() || "/koops-hero-market.jpg";
  const ctaLabel = primaryLabel?.trim() || "Rasti parduotuvę";
  const ctaHref = primaryUrl?.trim() || "/parduotuves";
  const heading = title?.trim() || "KOOPS parduotuvės arčiau jūsų.";
  const lead = description?.trim() || "Raskite artimiausią parduotuvę, jos darbo laiką ir maršrutą.";

  React.useEffect(() => {
    if (heroUpdatesPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setHeroUpdateIndex((current) => (current + 1) % heroUpdates.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [heroUpdatesPaused]);

  return (
    <>
      <section className="tt-hero" id="pradzia" data-byq-component="terra-tory-hero-1" data-cms-section="home-hero">
        <div className="tt-hero-background" aria-hidden="true">
          <Image src={heroImage} alt="" fill priority sizes="100vw" quality={78} data-cms-field="image" />
        </div>
        <div className="tt-hero-overlay" aria-hidden="true" />
        <div className="tt-container tt-hero-stage">
          <div className="tt-hero-content">
            <div className="tt-hero-top">
              <p className="section-label light-label" data-cms-field="eyebrow">
                {eyebrow?.trim() || "UKMERGĖJE IR RAJONE"}
              </p>
              <h1 data-cms-field="title" style={{ whiteSpace: "pre-line" }}>
                {heading}
              </h1>
              <p className="body-large" data-cms-field="description">
                {lead}
              </p>
              <a className="pill-button accent" href={ctaHref} aria-label="Rasti artimiausią parduotuvę" data-cms-field="primary-link">
                <RollingLabel>{ctaLabel}</RollingLabel>
              </a>
            </div>
          </div>
        </div>
        <aside
          className="hero-update-card"
          aria-label="Aktualios KOOPS naujienos"
          onMouseEnter={() => setHeroUpdatesPaused(true)}
          onMouseLeave={() => setHeroUpdatesPaused(false)}
          onFocusCapture={() => setHeroUpdatesPaused(true)}
          onBlurCapture={() => setHeroUpdatesPaused(false)}
        >
          <a className="hero-update-link" href={activeHeroUpdate.href} key={activeHeroUpdate.title}>
            <span className="hero-update-media">
              <Image src={activeHeroUpdate.image} alt="" fill sizes="(max-width: 767px) calc(100vw - 48px), 284px" quality={76} />
              <span className="hero-update-kicker">Aktualu</span>
            </span>
            <span className="hero-update-copy">
              <span className="section-label light-label">{activeHeroUpdate.label}</span>
              <strong>{activeHeroUpdate.title}</strong>
              <span className="hero-update-more text-link">
                Plačiau <span aria-hidden="true">→</span>
              </span>
            </span>
          </a>
          <div className="hero-update-dots" aria-label="Pasirinkti aktualiją">
            {heroUpdates.map((item, index) => (
              <button
                type="button"
                className={index === heroUpdateIndex ? "is-active" : ""}
                onClick={() => setHeroUpdateIndex(index)}
                aria-label={`Rodyti: ${item.title}`}
                aria-pressed={index === heroUpdateIndex}
                key={item.title}
              />
            ))}
          </div>
        </aside>
      </section>
      <div className="tt-hero-spacer" aria-hidden="true" data-cms-section="home-hero" />
    </>
  );
}

export function HomeStores({
  stores,
  title,
  primaryLabel,
  primaryUrl,
}: {
  stores: Store[];
  title?: string;
  primaryLabel?: string;
  primaryUrl?: string;
}) {
  const [locationSlide, setLocationSlide] = React.useState(0);
  const locationCarouselRef = React.useRef<HTMLDivElement>(null);
  const heading = title?.trim() || "Raskite artimiausią KOOPS parduotuvę";
  const ctaLabel = primaryLabel?.trim() || "Visos parduotuvės";
  const ctaHref = primaryUrl?.trim() || "/parduotuves";

  const showLocationSlide = (index: number) => {
    const track = locationCarouselRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(`[data-location-index="${index}"]`);
    if (!card) return;
    const left = card.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    track.scrollTo({ left, behavior: "smooth" });
    setLocationSlide(index);
  };

  const handleLocationScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const track = event.currentTarget;
    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-location-index]"));
    const nearest = cards.reduce((closest, card, index) => {
      const left = card.getBoundingClientRect().left - track.getBoundingClientRect().left;
      const closestLeft = cards[closest].getBoundingClientRect().left - track.getBoundingClientRect().left;
      return Math.abs(left) < Math.abs(closestLeft) ? index : closest;
    }, 0);
    setLocationSlide(nearest);
  };

  return (
    <section className="tt-locations" id="parduotuves" aria-labelledby="parduotuviu-antraste" data-byq-component="terra-tory-team-1" data-cms-section="home-stores">
      <div className="tt-container">
        <div className="location-headline" id="parduotuviu-antraste" data-cms-field="title" style={{ whiteSpace: "pre-line" }}>
          {heading}
        </div>
        <div className="location-carousel" role="region" aria-roledescription="karuselė" aria-label="KOOPS parduotuvės">
          <div className="location-grid" ref={locationCarouselRef} onScroll={handleLocationScroll}>
            {stores.map((store, index) => (
              <article className="location-card" data-location-index={index} key={store.slug}>
                <a className={`location-image${store.image ? "" : " is-placeholder"}`} href={`/parduotuves/${store.slug}`} aria-label={`Parduotuvė „${store.name}“ – atverti puslapį`}>
                  {store.image ? (
                    <Image src={store.image} alt={`Parduotuvė „${store.name}“`} width={960} height={720} sizes="(max-width: 767px) 82vw, 30vw" />
                  ) : (
                    <img className="store-cover-logo" loading="lazy" src="/koops-logo.png" alt="" />
                  )}
                </a>
                <div className="location-info">
                  <div><h3>{store.name}</h3><p>{store.address}</p></div>
                  <dl>
                    <div><dt>Darbo laikas</dt><dd>{store.hours}</dd></div>
                    <div>
                      <dt>Telefonas</dt>
                      <dd>
                        <a href={`tel:${store.phoneHref}`}>{store.phone}</a>
                        {store.extraPhone && store.extraPhoneHref ? (
                          <> · <a href={`tel:${store.extraPhoneHref}`}>{store.extraPhone}</a></>
                        ) : null}
                      </dd>
                    </div>
                  </dl>
                  <a className="text-link" href={store.map} target="_blank" rel="noreferrer">
                    Rodyti žemėlapyje <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
          <div className="location-carousel-controls">
            <div className="location-carousel-dots" aria-label="Pasirinkti parduotuvę">
              {stores.map((store, index) => (
                <button type="button" className={index === locationSlide ? "is-active" : ""} onClick={() => showLocationSlide(index)} aria-label={`Rodyti parduotuvę „${store.name}“`} aria-pressed={index === locationSlide} key={store.slug} />
              ))}
            </div>
            <div className="location-carousel-arrows">
              <button type="button" onClick={() => showLocationSlide(locationSlide - 1)} disabled={locationSlide === 0} aria-label="Ankstesnė parduotuvė">
                <span className="control-arrow is-left"><ByqChevron /></span>
              </button>
              <button type="button" onClick={() => showLocationSlide(locationSlide + 1)} disabled={locationSlide === stores.length - 1} aria-label="Kita parduotuvė">
                <span className="control-arrow"><ByqChevron /></span>
              </button>
            </div>
          </div>
          <p className="sr-only" aria-live="polite">Parduotuvė {locationSlide + 1} iš {stores.length}</p>
        </div>
        <a className="pill-button accent section-cta" href={ctaHref} data-cms-field="primary-link">
          <RollingLabel>{ctaLabel}</RollingLabel>
        </a>
      </div>
    </section>
  );
}

export function HomeNews({
  items,
  eyebrow,
  title,
  primaryLabel,
  primaryUrl,
}: {
  items: NewsItem[];
  eyebrow?: string;
  title?: string;
  primaryLabel?: string;
  primaryUrl?: string;
}) {
  const newsCards = items;
  const ctaLabel = primaryLabel?.trim() || "Visos naujienos";
  const ctaHref = primaryUrl?.trim() || "/naujienos";

  return (
    <section className="tt-news" id="naujienos" aria-labelledby="naujienu-antraste" data-byq-component="terra-tory-blog-grid-1" data-cms-section="home-news">
      <div className="tt-container">
        <div className="tt-section-header">
          <div className="dashed-divider" />
          <p className="section-label" data-cms-field="eyebrow">
            {eyebrow?.trim() || "AKTUALU"}
          </p>
          <h2 id="naujienu-antraste" data-cms-field="title" style={{ whiteSpace: "pre-line" }}>
            {title?.trim() || "Naujienos ir akcijos"}
          </h2>
        </div>
        <div className="news-bento">
          {newsCards.map((item) => {
            if (item.tone === "featured") {
              return (
                <a className="news-card news-card-large" href={newsHref(item.slug)} key={item.slug}>
                  {item.image ? <Image src={item.image} alt={item.title} width={1200} height={800} sizes="(max-width: 767px) calc(100vw - 32px), 50vw" /> : null}
                  <div>
                    <span className="section-label light-label">{item.category.toUpperCase()}</span>
                    <h3>{item.title}</h3>
                    {item.excerpt ? <p>{item.excerpt}</p> : null}
                    <span className="text-link">Skaityti <span aria-hidden="true">→</span></span>
                  </div>
                </a>
              );
            }
            const cardClass = item.tone === "accent" ? "news-card news-card-accent" : item.tone === "wide" ? "news-card news-card-wide" : "news-card news-card-muted";
            const cta = item.tone === "accent" ? "Peržiūrėti" : item.tone === "muted" && item.slug === "kas-naujo-parduotuvese" ? "Sužinoti" : "Skaityti";
            return (
              <a className={cardClass} href={newsHref(item.slug)} key={item.slug}>
                <div className="news-card-copy">
                  <h3>{item.title}</h3>
                  <span className="text-link">{cta} <span aria-hidden="true">→</span></span>
                </div>
              </a>
            );
          })}
        </div>
        <a className="pill-button dark section-cta" href={ctaHref} data-cms-field="primary-link">
          <RollingLabel>{ctaLabel}</RollingLabel>
        </a>
      </div>
    </section>
  );
}

export function HomeRestaurant({
  restaurant,
  galleryUrls,
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryUrl,
}: {
  restaurant: typeof restaurantDefaults;
  galleryUrls?: string[];
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryUrl?: string;
}) {
  const [restaurantSlide, setRestaurantSlide] = React.useState(0);
  const restaurantGallery = galleryUrls?.filter(Boolean).length
    ? galleryUrls.filter(Boolean).map((src, index) => ({ src, alt: restaurantSlides[index]?.alt || `Restorano nuotrauka ${index + 1}` }))
    : restaurantSlides;
  const ctaLabel = primaryLabel?.trim() || "Siųsti užklausą";
  const ctaHref = primaryUrl?.trim() || "/restoranas#uzklausa";
  const heading = title?.trim() || "Restoranas „Vilkmergė“ – vieta, kur gyvena atsiminimai.";
  const lead = description?.trim() || "Miesto širdyje įsikūręs restoranas laukia Jūsų.";

  return (
    <section className="tt-story" id="restoranas" aria-labelledby="restorano-antraste" data-byq-component="terra-tory-combo-6" data-cms-section="home-restaurant">
      <div className="tt-container">
        <div className="story-headline">
          <p className="section-label light-label" data-cms-field="eyebrow">
            {eyebrow?.trim() || "RESTORANAS „VILKMERGĖ“ · NUO 1965 METŲ"}
          </p>
          <h2 id="restorano-antraste" data-cms-field="title" style={{ whiteSpace: "pre-line" }}>
            {heading}
          </h2>
        </div>
        <div className="story-grid">
          <div className="story-image" role="region" aria-roledescription="karuselė" aria-label="Restorano „Vilkmergė“ nuotraukų galerija">
            {restaurantGallery.map((slide, index) => (
              <img key={index} data-cms-field="gallery-item" src={slide.src} alt={slide.alt} loading="lazy" hidden={index !== restaurantSlide} />
            ))}
            <div className="story-gallery-controls">
              <div className="story-gallery-dots" aria-label="Pasirinkti galerijos nuotrauką">
                {restaurantGallery.map((slide, index) => (
                  <button type="button" className={index === restaurantSlide ? "is-active" : ""} onClick={() => setRestaurantSlide(index)} aria-label={`Rodyti ${index + 1} nuotrauką: ${slide.alt}`} aria-pressed={index === restaurantSlide} key={`${slide.src}-${index}`} />
                ))}
              </div>
              <div className="story-gallery-arrows">
                <button type="button" onClick={() => setRestaurantSlide((slide) => (slide - 1 + restaurantGallery.length) % restaurantGallery.length)} aria-label="Ankstesnė restorano nuotrauka">
                  <span className="control-arrow is-left"><ByqChevron /></span>
                </button>
                <button type="button" onClick={() => setRestaurantSlide((slide) => (slide + 1) % restaurantGallery.length)} aria-label="Kita restorano nuotrauka">
                  <span className="control-arrow"><ByqChevron /></span>
                </button>
              </div>
            </div>
            <p className="sr-only" aria-live="polite">Nuotrauka {restaurantSlide + 1} iš {restaurantGallery.length}</p>
          </div>
          <div className="story-copy">
            <p data-cms-field="description">{lead}</p>
            <p className="story-summary">Restorane galime priimti iki {restaurant.maxGuests} svečių. Siūlome {restaurant.hallsCount} skirtingo dydžio sales: Didžiąją, barą ir mažąją.</p>
            <dl>
              <div><dt>Pokylių salės</dt><dd>{restaurant.hallsCount} salės</dd></div>
              <div><dt>Talpa</dt><dd>Iki {restaurant.maxGuests} svečių</dd></div>
              <div><dt>Adresas</dt><dd>{restaurant.address}</dd></div>
            </dl>
            <p className="story-note">Visas erdves suderinsime pagal renginį.</p>
            <div className="story-reservation story-contact-card">
              <dl className="story-contact-list">
                <div><dt>Telefonas</dt><dd><a href={restaurant.mobileHref}>{restaurant.mobileDisplay}</a></dd></div>
                <div><dt>El. paštas</dt><dd><a href={`mailto:${restaurant.email}`}>{restaurant.email}</a></dd></div>
              </dl>
            </div>
            <div className="story-actions">
              <a className="pill-button accent" href={ctaHref} data-cms-field="primary-link"><RollingLabel>{ctaLabel}</RollingLabel></a>
              <a className="pill-button outline-light" href="/restoranas"><RollingLabel>Apie restoraną</RollingLabel></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeJobs({
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
  const ctaLabel = primaryLabel?.trim() || "Visi darbo pasiūlymai";
  const ctaHref = primaryUrl?.trim() || "/karjera";

  return (
    <section className="tt-jobs" id="karjera" aria-labelledby="karjeros-antraste" data-byq-component="structured-data-2-careers" data-cms-section="home-jobs">
      <div className="tt-container jobs-layout">
        <div className="jobs-intro">
          <p className="section-label light-label" data-cms-field="eyebrow">{eyebrow?.trim() || "KARJERA"}</p>
          <h2 id="karjeros-antraste" className="jobs-title-with-rule" data-cms-field="title" style={{ whiteSpace: "pre-line" }}>
            {title?.trim() || "Darbas arti namų"}
          </h2>
          <p data-cms-field="description">
            {description?.trim() ||
              "Prisijunkite prie KOOPS komandos Ukmergėje ir rajone. Susipažinkite su šiuo metu siūlomomis darbo vietomis."}
          </p>
          <a className="pill-button accent" href={ctaHref} data-cms-field="primary-link"><RollingLabel>{ctaLabel}</RollingLabel></a>
        </div>
        <div className="jobs-list" role="region" aria-label="Naujausi darbo pasiūlymai">
          {jobs.length ? (
            jobs.slice(0, 3).map((job) => (
              <a className="job-row" href={job.applyUrl} key={job.id} aria-label={`${job.title} — kandidatuoti`}>
                <div className="job-row-copy">
                  <h3>{job.title}</h3>
                  <div className="job-row-meta">
                    <span>{job.type}</span><span aria-hidden="true">•</span><span>{job.location}</span>
                  </div>
                </div>
                <span className="job-row-arrow" aria-hidden="true"><AvenirButtonArrow /></span>
              </a>
            ))
          ) : (
            <p className="jobs-empty">Šiuo metu laisvų pozicijų nėra. Kandidatuoti galite per karjeros formą.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export function HomeSuppliers({
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
    <section className="tt-contact" id="tiekejams" aria-labelledby="tiekeju-antraste" data-byq-component="terra-tory-contact-1" data-cms-section="home-suppliers">
      <div className="tt-container contact-grid">
        <div className="contact-content">
          <div className="contact-heading">
            <p className="section-label" data-cms-field="eyebrow">{eyebrow?.trim() || "TIEKĖJAMS"}</p>
            <h2 id="tiekeju-antraste" data-cms-field="title" style={{ whiteSpace: "pre-line" }}>
              {title?.trim() || "Auginkime vietos pasiūlą kartu"}
            </h2>
            <p data-cms-field="description">
              {description?.trim() ||
                "Ieškome patikimų gamintojų ir tiekėjų, norinčių pasiūlyti savo produkciją KOOPS pirkėjams."}
            </p>
          </div>
          <div className="contact-details">
            <div><strong>Adresas</strong><p>Vasario 16-osios g. 30<br />LT-20130 Ukmergė</p></div>
            <div><strong>El. paštas</strong><p><a href="mailto:direktore@urvk.lt">direktore@urvk.lt</a></p></div>
          </div>
          <SupplierForm />
        </div>
        <div className="contact-image">
          <img className="contact-image-main" loading="lazy" src={imageUrl?.trim() || "/ukmerge-fields-2.jpg"} alt="Lietuvos laukai ir kaimo sodybos" data-cms-field="image" />
        </div>
      </div>
    </section>
  );
}

export function FooterCta({
  eyebrow,
  title,
  primaryLabel,
  primaryUrl,
}: {
  eyebrow?: string;
  title?: string;
  primaryLabel?: string;
  primaryUrl?: string;
} = {}) {
  const ctaLabel = primaryLabel?.trim() || "Rasti parduotuvę";
  const ctaHref = primaryUrl?.trim() || "/parduotuves";

  return (
    <section className="footer-cta" id="footer-cta" aria-labelledby="footer-cta-title" data-cms-section="footer-cta">
      <div className="orbit footer-orbit-one" aria-hidden="true" />
      <div className="orbit footer-orbit-two" aria-hidden="true" />
      <p className="section-label light-label" data-cms-field="eyebrow">{eyebrow?.trim() || "KOOPS"}</p>
      <h2 id="footer-cta-title" data-cms-field="title" style={{ whiteSpace: "pre-line" }}>
        {title?.trim() || "Parduotuvė gali būti arčiau, nei manote"}
      </h2>
      <a className="pill-button accent" href={ctaHref} aria-label="Rasti KOOPS parduotuvę" data-cms-field="primary-link">
        <RollingLabel>{ctaLabel}</RollingLabel>
      </a>
    </section>
  );
}
