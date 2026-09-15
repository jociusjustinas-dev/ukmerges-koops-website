import Image from "next/image";
import { RollingLabel } from "./RollingLabel";
import {
  flyerDateLabel,
  flyerHref,
  flyerKindLabel,
  isFlyerCurrent,
  sortFlyers,
  type Flyer,
} from "../lib/flyers";

export function FlyerCards({ items, compact = false }: { items: Flyer[]; compact?: boolean }) {
  const flyers = sortFlyers(items);
  if (!flyers.length) return null;

  return (
    <div className={compact ? "flyers-grid is-compact" : "flyers-grid"}>
      {flyers.map((flyer) => {
        const cover = flyer.image || flyer.pages[0];
        const current = isFlyerCurrent(flyer);
        return (
          <a className="flyer-card" href={flyerHref(flyer.slug)} key={flyer.slug}>
            <div className={`flyer-card-media${cover ? "" : " is-placeholder"}`}>
              {cover ? (
                <Image src={cover} alt="" width={900} height={1273} sizes="(max-width: 767px) calc(100vw - 32px), 33vw" />
              ) : (
                <img className="store-cover-logo" src="/koops-logo.png" alt="" />
              )}
            </div>
            <div className="flyer-card-copy">
              <p className="news-card-meta">
                <span>{flyerKindLabel(flyer.kind)}</span>
                {current ? <span>Dabar galioja</span> : null}
              </p>
              <h2>{flyer.title}</h2>
              {flyerDateLabel(flyer) ? <p className="flyer-card-dates">{flyerDateLabel(flyer)}</p> : null}
              <span className="text-link">Peržiūrėti <span aria-hidden="true">→</span></span>
            </div>
          </a>
        );
      })}
    </div>
  );
}

export function FlyersListing({
  items,
  eyebrow,
  title,
  description,
}: {
  items: Flyer[];
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const flyers = sortFlyers(items);
  const lead =
    description?.trim() ||
    "Viršelis, galiojimo datos ir puslapių peržiūra. PDF atsisiuntimas — jei norite atsispausdinti.";

  return (
    <section className="tt-news flyers-page-main" id="flyers-listing" aria-labelledby="flyers-archive-title" data-cms-section="flyers-listing">
      <div className="tt-container">
        <div className="tt-section-header news-page-header">
          <p className="section-label light-label" data-cms-field="eyebrow">
            {eyebrow?.trim() || "AKCIJOS"}
          </p>
          <h1 id="flyers-archive-title" className="careers-hero-title" data-cms-field="title">
            {title?.trim() || "Leidiniai"}
          </h1>
          <p className="flyers-lead" data-cms-field="description">
            {lead}
          </p>
        </div>
        {flyers.length ? (
          <FlyerCards items={flyers} />
        ) : (
          <div className="classifieds-empty">
            <h2>Šiuo metu galiojančių leidinių nėra</h2>
            <p>Naują akcijų leidinį skelbsime, kai jis bus paruoštas.</p>
            <a className="pill-button accent" href="/naujienos">
              <RollingLabel>Žiūrėti naujienas</RollingLabel>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
