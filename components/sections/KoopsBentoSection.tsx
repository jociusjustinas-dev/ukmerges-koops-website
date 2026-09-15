import {
  defaultBentoCards,
  sectionItemsOrDefault,
  type CmsBentoItem,
} from "../../lib/cms-items";

type KoopsBentoSectionProps = {
  cmsSection?: string;
  eyebrow?: string;
  title?: string;
  galleryUrls?: string[];
  items?: CmsBentoItem[];
  wideImage?: {
    src: string;
    alt: string;
  };
};

function BentoTextCard({
  item,
  index,
  className = "",
}: {
  item: CmsBentoItem;
  index: number;
  className?: string;
}) {
  const isAccent = className.includes("koops-bento-card-accent");

  if (isAccent) {
    return (
      <div className={`koops-bento-card ${className}`.trim()} data-cms-item={index}>
        <p className="section-label" data-cms-item-field="label">
          {item.label}
        </p>
        <div className="koops-bento-card-content">
          <h3 data-cms-item-field="title">{item.title}</h3>
          <p data-cms-item-field="body">{item.body}</p>
        </div>
        <div className="koops-bento-actions">
          <a className="text-link" href={item.href || "#"}>
            <span data-cms-item-field="cta">{item.cta}</span> <span aria-hidden="true">→</span>
          </a>
        </div>
        <span className="koops-bento-circle" aria-hidden="true" />
      </div>
    );
  }

  return (
    <a
      className={`koops-bento-card ${className}`.trim()}
      href={item.href || "#"}
      data-cms-item={index}
    >
      <p className="section-label" data-cms-item-field="label">
        {item.label}
      </p>
      <div className="koops-bento-card-bottom">
        <div className="koops-bento-card-content">
          <h3 data-cms-item-field="title">{item.title}</h3>
          <p data-cms-item-field="body">{item.body}</p>
        </div>
        <span className="text-link">
          <span data-cms-item-field="cta">{item.cta}</span> <span aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  );
}

export function KoopsBentoSection({
  cmsSection = "home-bento",
  eyebrow,
  title,
  galleryUrls,
  items,
  wideImage = {
    src: "/local-produce-couple.jpg",
    alt: "Vietos produkcija KOOPS parduotuvėje",
  },
}: KoopsBentoSectionProps) {
  const cards = sectionItemsOrDefault(items, defaultBentoCards);
  const stores = cards[0] || defaultBentoCards[0];
  const careers = cards[1] || defaultBentoCards[1];
  const suppliers = cards[2] || defaultBentoCards[2];
  const restaurant = cards[3] || defaultBentoCards[3];
  const mediaHref = stores.href || "/parduotuves";

  const tallImage = galleryUrls?.find(Boolean) || "/koops-hero.jpg";
  const wideSrc = galleryUrls?.filter(Boolean)[1] || wideImage.src;

  return (
    <section
      id={cmsSection}
      data-cms-section={cmsSection}
      className="koops-bento-section"
      aria-labelledby="koops-bento-title"
      data-byq-component="terra-tory-home-c-features"
    >
      <div className="tt-container">
        <header className="koops-bento-header">
          <div className="dashed-divider" aria-hidden="true" />
          <p className="section-label" data-cms-field="eyebrow">
            {eyebrow?.trim() || "KOOPS KASDIEN"}
          </p>
          <h2 id="koops-bento-title" data-cms-field="title">
            {title?.trim() || "Viskas, ko reikia — arčiau jūsų"}
          </h2>
        </header>

        <div className="koops-bento-grid">
          <BentoTextCard item={stores} index={0} />

          <a
            className="koops-bento-media koops-bento-media-tall"
            href={mediaHref}
            aria-label="Rasti artimiausią KOOPS parduotuvę"
          >
            <img
              src={tallImage}
              alt="KOOPS parduotuvė Ukmergės rajone"
              loading="lazy"
              data-cms-field="gallery-item"
            />
          </a>

          <BentoTextCard item={careers} index={1} className="koops-bento-card-career" />
          <BentoTextCard item={suppliers} index={2} />

          <a
            className="koops-bento-media"
            href={mediaHref}
            aria-label="Rasti artimiausią KOOPS parduotuvę"
          >
            <img
              src={wideSrc}
              alt={wideImage.alt}
              loading="lazy"
              data-cms-field="gallery-item"
            />
          </a>

          <BentoTextCard item={restaurant} index={3} className="koops-bento-card-accent" />
        </div>
      </div>
    </section>
  );
}
