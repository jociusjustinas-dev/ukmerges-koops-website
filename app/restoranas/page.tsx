import type { Metadata } from "next";
import { RestaurantEnquiryForm } from "../../components/RestaurantEnquiryForm";
import { RestaurantHero } from "../../components/RestaurantHero";
import { RestaurantValueFeatures } from "../../components/sections/RestaurantValueFeatures";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import {
  restaurant as restaurantDefaults,
} from "../../lib/restaurant";
import { getKoopsCmsData } from "../../lib/wordpress";

export const metadata: Metadata = {
  title: "Restoranas „Vilkmergė“ | KOOPS",
  description:
    "Restoranas „Vilkmergė“ Ukmergėje — 3 salės, iki 154 svečių. Užklausa šventei, renginiui ar vakarienei ir tiesioginis skambutis.",
};

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "").replace(/^0/, "+370")}`;
}

export default async function RestaurantPage() {
  const { options } = await getKoopsCmsData();
  const restaurant = {
    ...restaurantDefaults,
    since: Number(options.restaurant_since) || restaurantDefaults.since,
    phoneDisplay: options.restaurant_phone || restaurantDefaults.phoneDisplay,
    phoneHref: phoneHref(options.restaurant_phone || restaurantDefaults.phoneDisplay),
    mobileDisplay: options.restaurant_mobile || restaurantDefaults.mobileDisplay,
    mobileHref: phoneHref(options.restaurant_mobile || restaurantDefaults.mobileDisplay),
    email: options.restaurant_email || restaurantDefaults.email,
    address: options.restaurant_address || restaurantDefaults.address,
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      options.restaurant_address || restaurantDefaults.address,
    )}`,
    hallsCount: Number(options.restaurant_halls) || restaurantDefaults.hallsCount,
    maxGuests: Number(options.restaurant_capacity) || restaurantDefaults.maxGuests,
  };
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: `Restoranas „${restaurant.name}“`,
    telephone: restaurant.phoneHref.replace("tel:", ""),
    email: restaurant.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address,
      addressLocality: "Ukmergė",
      addressCountry: "LT",
    },
    url: "https://ukmerges-koops-koncepcija.jociusj.chatgpt.site/restoranas",
  };

  return (
    <div className="site-shell restaurant-page" id="pradzia">
      <a className="skip-link" href="#turinys">
        Pereiti prie turinio
      </a>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main id="turinys">
        <RestaurantHero restaurant={restaurant} />

        <RestaurantValueFeatures restaurant={restaurant} />

        {/* BYQ: terra-tory-bento-1 — halls as bento */}
        <section
          className="koops-bento-section restaurant-halls"
          aria-labelledby="restaurant-halls-title"
          data-byq-component="terra-tory-bento-1"
        >
          <div className="tt-container">
            <header className="koops-bento-header">
              <div className="dashed-divider" aria-hidden="true" />
              <p className="section-label">SALĖS</p>
              <h2 id="restaurant-halls-title">Salės ir talpa</h2>
            </header>

            <div className="koops-bento-grid">
              <article className="koops-bento-card">
                <p className="section-label">DIDŽIOJI SALĖ</p>
                <div className="koops-bento-card-bottom">
                  <div className="koops-bento-card-content">
                    <h3>Iki 90</h3>
                    <p>Vestuvės, jubiliejai, įmonių vakarai.</p>
                  </div>
                </div>
              </article>

              <div className="koops-bento-media koops-bento-media-tall" aria-hidden="true">
                <img loading="lazy" src="/vilkmerge-hall.jpg" alt="" />
              </div>

              <article className="koops-bento-card">
                <p className="section-label">BARAS</p>
                <div className="koops-bento-card-bottom">
                  <div className="koops-bento-card-content">
                    <h3>Iki 40</h3>
                    <p>Krikštynos, šeimos šventės, oficialūs susitikimai.</p>
                  </div>
                </div>
              </article>

              <div className="koops-bento-media" aria-hidden="true">
                <img loading="lazy" src="/vilkmerge-table.jpg" alt="" />
              </div>

              <div className="koops-bento-media" aria-hidden="true">
                <img loading="lazy" src="/vilkmerge-menu.jpg" alt="" />
              </div>

              <div className="koops-bento-card koops-bento-card-accent">
                <p className="section-label">MAŽOJI · BENDRA TALPA</p>
                <div className="koops-bento-card-content">
                  <h3>Iki {restaurant.maxGuests}</h3>
                  <p>Mažoji salė — iki 8 svečių. Visas erdves suderinsime pagal renginį.</p>
                </div>
                <div className="koops-bento-actions">
                  <a className="text-link" href="#uzklausa">
                    Siųsti užklausą <span aria-hidden="true">→</span>
                  </a>
                </div>
                <span className="koops-bento-circle" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        {/* BYQ: terra-tory-contact-1 + contact-2 — contacts left, form right */}
        <section
          className="restaurant-enquiry"
          id="uzklausa"
          aria-labelledby="restaurant-enquiry-title"
          data-byq-component="terra-tory-contact-1"
        >
          <div className="tt-container restaurant-enquiry-grid">
            <div className="restaurant-enquiry-intro">
              <p className="section-label">KONTAKTAI IR UŽKLAUSA</p>
              <h2 id="restaurant-enquiry-title">Susisiekite arba parašykite</h2>
              <p>
                Skambinkite tiesiogiai arba užpildykite trumpą formą — suderinsime salę, datą ir meniu.
              </p>
              <div className="contact-details">
                <div>
                  <strong>Telefonai</strong>
                  <p>
                    <a href={restaurant.phoneHref}>{restaurant.phoneDisplay}</a>
                    <br />
                    <a href={restaurant.mobileHref}>{restaurant.mobileDisplay}</a>
                  </p>
                </div>
                <div>
                  <strong>El. paštas</strong>
                  <p>
                    <a href={`mailto:${restaurant.email}`}>{restaurant.email}</a>
                  </p>
                </div>
                <div>
                  <strong>Adresas</strong>
                  <p>
                    <a href={restaurant.mapUrl} target="_blank" rel="noreferrer">
                      {restaurant.address}
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <RestaurantEnquiryForm />
          </div>
        </section>
      </main>

      <SiteFooter showCta={false} />
    </div>
  );
}
