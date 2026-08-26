import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "../../../components/SiteFooter";
import { SiteHeader } from "../../../components/SiteHeader";
import { RollingLabel } from "../../../components/RollingLabel";
import { getStore, stores } from "../../../lib/stores";

type StorePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return stores.map((store) => ({ slug: store.slug }));
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = getStore(slug);
  if (!store) return { title: "Parduotuvė | KOOPS" };
  return {
    title: `Parduotuvė „${store.name}“ | KOOPS`,
    description: `${store.address}. Darbo laikas: ${store.hours}. Telefonas ${store.phone}.`,
  };
}

export default async function StoreDetailPage({ params }: StorePageProps) {
  const { slug } = await params;
  const store = getStore(slug);
  if (!store) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    name: `KOOPS parduotuvė „${store.name}“`,
    image: store.image,
    telephone: store.phoneHref,
    address: {
      "@type": "PostalAddress",
      streetAddress: store.address,
      addressLocality: store.city,
      addressCountry: "LT",
    },
    url: `https://ukmerges-koops-koncepcija.jociusj.chatgpt.site/parduotuves/${store.slug}`,
  };

  return (
    <div className="site-shell stores-page store-detail-page" id="pradzia">
      <a className="skip-link" href="#turinys">Pereiti prie turinio</a>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main id="turinys">
        <section className="store-detail" aria-labelledby="store-detail-title">
          <div className="store-detail-split">
            <div className="store-detail-media">
              {store.image ? (
                <img src={store.image} alt={`Parduotuvė „${store.name}“`} />
              ) : (
                <div className="store-detail-media-placeholder" aria-hidden="true">
                  <img className="store-cover-logo" src="/koops-logo.png" alt="" />
                </div>
              )}
            </div>

            <div className="store-detail-panel">
              <div className="store-detail-panel-inner">
                <nav className="store-breadcrumb" aria-label="Kelias">
                  <a href="/">Pradžia</a>
                  <span aria-hidden="true">/</span>
                  <a href="/parduotuves">Parduotuvės</a>
                  <span aria-hidden="true">/</span>
                  <span>{store.name}</span>
                </nav>

                <p className="section-label light-label">{store.city}</p>
                <h1 id="store-detail-title">Parduotuvė „{store.name}“</h1>
                <p className="store-detail-lead">{store.address}</p>

                <div className="store-detail-actions">
                  <a className="pill-button accent" href={store.map} target="_blank" rel="noreferrer">
                    <RollingLabel>Rodyti maršrutą</RollingLabel>
                  </a>
                  <a className="pill-button outline-light" href={`tel:${store.phoneHref}`}>
                    <RollingLabel>Skambinti {store.phone}</RollingLabel>
                  </a>
                </div>

                <dl className="store-detail-facts">
                  <div>
                    <dt>Adresas</dt>
                    <dd>{store.address}</dd>
                  </div>
                  <div>
                    <dt>Darbo laikas</dt>
                    <dd>{store.hours}</dd>
                  </div>
                  <div>
                    <dt>Telefonas</dt>
                    <dd>
                      <a href={`tel:${store.phoneHref}`}>{store.phone}</a>
                      {store.extraPhone && store.extraPhoneHref ? (
                        <>
                          {" · "}
                          <a href={`tel:${store.extraPhoneHref}`}>{store.extraPhone}</a>
                        </>
                      ) : null}
                    </dd>
                  </div>
                </dl>

                <div className="store-detail-services">
                  <p className="section-label light-label">PASLAUGOS</p>
                  <ul>
                    {store.services.map((service) => (
                      <li key={service}>{service}</li>
                    ))}
                  </ul>
                </div>

                <a className="text-link store-detail-back" href="/parduotuves">
                  Visos parduotuvės <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter
        ctaHref="/#restoranas"
        ctaLabel="Apie restoraną"
        ctaAriaLabel="Apie restoraną Vilkmergė"
        ctaTitleDesktop={["Stalui ir šventei —", "restoranas Vilkmergė"]}
        ctaTitleMobile={["Stalui ir šventei —", "restoranas", "Vilkmergė"]}
      />
    </div>
  );
}
