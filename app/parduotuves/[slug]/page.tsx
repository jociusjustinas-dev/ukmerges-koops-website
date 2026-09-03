import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "../../../components/SiteFooter";
import { SiteHeader } from "../../../components/SiteHeader";
import { RollingLabel } from "../../../components/RollingLabel";
import { getKoopsCmsData } from "../../../lib/wordpress";
import { absoluteUrl } from "../../../lib/site-url";
import { createPageMetadata } from "../../../lib/metadata";

type StorePageProps = {
  params: Promise<{ slug: string }>;
};

const schemaDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const romanDayIndex: Record<string, number> = { I: 0, II: 1, III: 2, IV: 3, V: 4, VI: 5, VII: 6 };

function schemaOpeningHours(hours: string) {
  return hours.split("·").flatMap((part) => {
    const value = part.trim();
    if (/nedirba/i.test(value)) return [];
    const time = value.match(/(\d{1,2}:\d{2})[–-](\d{1,2}:\d{2})/);
    if (!time) return [];
    if (/^Kasdien\b/i.test(value)) return [`Mo-Su ${time[1]}-${time[2]}`];
    const days = value.match(/^(VII|VI|IV|V|III|II|I)(?:[–-](VII|VI|IV|V|III|II|I))?/);
    if (!days) return [];
    const first = romanDayIndex[days[1]];
    const last = romanDayIndex[days[2] || days[1]];
    const range = first === last ? schemaDays[first] : `${schemaDays[first]}-${schemaDays[last]}`;
    return [`${range} ${time[1]}-${time[2]}`];
  });
}

export async function generateStaticParams() {
  const { stores } = await getKoopsCmsData();
  return stores.map((store) => ({ slug: store.slug }));
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { slug } = await params;
  const { stores } = await getKoopsCmsData();
  const store = stores.find((item) => item.slug === slug);
  if (!store) return { title: "Parduotuvė | KOOPS" };
  return createPageMetadata({
    title: `Parduotuvė „${store.name}“ | KOOPS`,
    description: `${store.address}. Darbo laikas: ${store.hours}. Telefonas ${store.phone}.`,
    path: `/parduotuves/${store.slug}`,
    image: store.image || undefined,
  });
}

export default async function StoreDetailPage({ params }: StorePageProps) {
  const { slug } = await params;
  const { stores } = await getKoopsCmsData();
  const store = stores.find((item) => item.slug === slug);
  if (!store) notFound();

  const pageUrl = absoluteUrl(`/parduotuves/${store.slug}`);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "GroceryStore",
        "@id": `${pageUrl}#store`,
        name: `KOOPS parduotuvė „${store.name}“`,
        image: store.image || undefined,
        telephone: store.phoneHref.replace("tel:", ""),
        address: {
          "@type": "PostalAddress",
          streetAddress: store.address,
          addressLocality: store.city,
          addressCountry: "LT",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: store.lat,
          longitude: store.lng,
        },
        openingHours: schemaOpeningHours(store.hours),
        hasMap: store.map,
        parentOrganization: { "@id": `${absoluteUrl("/")}#organization` },
        url: pageUrl,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Pradžia", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Parduotuvės", item: absoluteUrl("/parduotuves") },
          { "@type": "ListItem", position: 3, name: store.name, item: pageUrl },
        ],
      },
    ],
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

                {store.services.length > 0 ? (
                  <div className="store-detail-services">
                    <p className="section-label light-label">PASLAUGOS</p>
                    <ul>
                      {store.services.map((service) => (
                        <li key={service}>{service}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

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
