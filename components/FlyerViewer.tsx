"use client";

import * as React from "react";
import Image from "next/image";
import { RollingLabel } from "./RollingLabel";
import { flyerDateLabel, flyerKindLabel, type Flyer } from "../lib/flyers";

type Props = {
  flyer: Flyer;
};

export function FlyerViewer({ flyer }: Props) {
  const pages = flyer.pages.length ? flyer.pages : flyer.image ? [flyer.image] : [];
  const [index, setIndex] = React.useState(0);
  const startX = React.useRef<number | null>(null);
  const page = pages[index];
  const total = pages.length;

  const go = React.useCallback(
    (next: number) => {
      if (!total) return;
      setIndex(Math.min(total - 1, Math.max(0, next)));
    },
    [total],
  );

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(index + 1);
      if (event.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  return (
    <div className="flyer-viewer">
      <header className="flyer-viewer-head">
        <p className="section-label light-label">{flyerKindLabel(flyer.kind)}</p>
        <h1 id="flyer-title">{flyer.title}</h1>
        {flyerDateLabel(flyer) ? <p className="flyer-viewer-dates">{flyerDateLabel(flyer)}</p> : null}
        {flyer.excerpt ? <p className="flyer-viewer-lead">{flyer.excerpt}</p> : null}
        <div className="flyer-viewer-actions">
          {flyer.pdfUrl ? (
            <a className="pill-button accent" href={flyer.pdfUrl} download>
              <RollingLabel>Atsisiųsti PDF</RollingLabel>
            </a>
          ) : null}
          <a className="text-link" href="/leidiniai">
            ← Visi leidiniai
          </a>
        </div>
      </header>

      {page ? (
        <div
          className="flyer-stage"
          role="region"
          aria-roledescription="karuselė"
          aria-label={`${flyer.title} puslapiai`}
          onTouchStart={(event) => {
            startX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const start = startX.current;
            const end = event.changedTouches[0]?.clientX;
            startX.current = null;
            if (start == null || end == null) return;
            const delta = end - start;
            if (delta < -40) go(index + 1);
            if (delta > 40) go(index - 1);
          }}
        >
          <Image
            src={page}
            alt={`${flyer.title}, ${index + 1} puslapis iš ${total}`}
            width={1200}
            height={1697}
            sizes="(max-width: 767px) calc(100vw - 32px), 760px"
            priority
          />
          {total > 1 ? (
            <>
              <button type="button" className="flyer-nav is-prev" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Ankstesnis puslapis">
                ‹
              </button>
              <button type="button" className="flyer-nav is-next" onClick={() => go(index + 1)} disabled={index === total - 1} aria-label="Kitas puslapis">
                ›
              </button>
            </>
          ) : null}
        </div>
      ) : (
        <p>Šio leidinio puslapių dar nėra.</p>
      )}

      {total > 1 ? (
        <p className="flyer-pager" aria-live="polite">
          {index + 1} / {total}
        </p>
      ) : null}
    </div>
  );
}
