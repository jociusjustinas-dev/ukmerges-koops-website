import { Fragment } from "react";
import {
  defaultSuppliersLooking,
  sectionItemsOrDefault,
  type CmsLookingItem,
} from "../../lib/cms-items";

/** BYQ: terra-tory-bento-1 — ko ieškome (kaip restorano salės) */
export function SuppliersLookingFor({
  items,
  galleryUrls,
  primaryLabel,
  primaryUrl,
}: {
  items?: CmsLookingItem[];
  galleryUrls?: string[];
  primaryLabel?: string;
  primaryUrl?: string;
}) {
  const looking = sectionItemsOrDefault(items, defaultSuppliersLooking);
  const images = galleryUrls?.filter(Boolean).length
    ? galleryUrls.filter(Boolean)
    : ["/ukmerge-fields-4.jpg", "/ukmerge-fields-5.jpg"];
  const ctaLabel = primaryLabel?.trim() || "Siųsti pasiūlymą";
  const ctaHref = primaryUrl?.trim() || "#forma";

  return (
    <section
      data-cms-section="suppliers-looking"
      className="koops-bento-section suppliers-looking"
      id="ko-ieskome"
      aria-labelledby="suppliers-looking-title"
      data-byq-component="terra-tory-bento-1"
    >
      <div className="tt-container">
        <header className="koops-bento-header">
          <div className="dashed-divider" aria-hidden="true" />
          <p className="section-label" data-cms-field="eyebrow">
            KO IEŠKOME
          </p>
          <h2 id="suppliers-looking-title" data-cms-field="title">
            Produkcija, kuri tinka KOOPS lentynoms
          </h2>
        </header>

        <div className="koops-bento-grid">
          {looking.map((item, index) => {
            const isLast = index === looking.length - 1;
            const isSecond = index === 1;
            return (
              <Fragment key={`looking-${index}`}>
                <article
                  className={
                    isLast
                      ? "koops-bento-card koops-bento-card-accent"
                      : isSecond
                        ? "koops-bento-card koops-bento-card-career"
                        : "koops-bento-card"
                  }
                >
                  <p className="section-label">{item.label}</p>
                  <div className={isLast ? "koops-bento-card-content" : "koops-bento-card-bottom"}>
                    <div className="koops-bento-card-content">
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </div>
                  </div>
                  {isLast ? (
                    <>
                      <div className="koops-bento-actions">
                        <a className="text-link" href={ctaHref} data-cms-field="primary-link">
                          {ctaLabel} <span aria-hidden="true">→</span>
                        </a>
                      </div>
                      <span className="koops-bento-circle" aria-hidden="true" />
                    </>
                  ) : null}
                </article>
                {index < images.length && !isLast ? (
                  <div
                    className={index === 0 ? "koops-bento-media koops-bento-media-tall" : "koops-bento-media"}
                    aria-hidden="true"
                  >
                    <img loading="lazy" src={images[index]} alt="" data-cms-field="gallery-item" />
                  </div>
                ) : null}
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
