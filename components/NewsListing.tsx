"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import {
  newsDateLabel,
  newsHref,
  type NewsItem,
} from "../lib/news";
import { revealIntroImmediately, withIntroFallback } from "../lib/motionIntro";

type CategoryFilter = "visos" | string;

function ListCard({ item, priority = false }: { item: NewsItem; priority?: boolean }) {
  return (
    <a className="news-list-card" href={newsHref(item.slug)}>
      <div className={`news-list-media${item.image ? "" : " is-placeholder"}`}>
        {item.image ? (
          <img
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            width="1200"
            height="800"
            src={item.image}
            alt=""
          />
        ) : (
          <img className="store-cover-logo" src="/koops-logo.png" alt="" />
        )}
      </div>
      <div className="news-list-copy">
        <p className="news-card-meta">
          <span>{item.category}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={item.date}>{newsDateLabel(item.date)}</time>
        </p>
        <h2>{item.title}</h2>
        {item.excerpt ? <p className="news-list-excerpt">{item.excerpt}</p> : null}
        <span className="text-link">Skaityti <span aria-hidden="true">→</span></span>
      </div>
    </a>
  );
}

export function NewsListing({ items }: { items: NewsItem[] }) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<CategoryFilter>("visos");
  const newsCategories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))).sort((a, b) => a.localeCompare(b, "lt")),
    [items],
  );

  const visible = useMemo(
    () => (category === "visos" ? items : items.filter((item) => item.category === category)),
    [category, items],
  );

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const clearFallback = withIntroFallback(root);
    let cancelled = false;
    let revert = () => {};

    void import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      const media = gsap.matchMedia();
      media.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        canAnimate: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };
        if (reduceMotion) {
          revealIntroImmediately(root);
          return;
        }

        clearFallback();

        const bar = root.querySelector<HTMLElement>(".news-listing-bar");
        const cards = root.querySelectorAll<HTMLElement>(".news-list-card");
        const animatedCards = Array.from(cards).slice(1);
        const empty = root.querySelector<HTMLElement>(".news-listing-empty");
        const targets = [bar, ...animatedCards, empty].filter(Boolean) as HTMLElement[];

        if (!targets.length) {
          revealIntroImmediately(root);
          return;
        }

        gsap.set(targets, { autoAlpha: 0 });

        const intro = gsap.timeline({
          defaults: { duration: 0.75, ease: "power3.out" },
          onComplete: () => {
            /* Atidaro FOUC CSS, kad filtro metu naujos kortelės nebūtų slepiamos */
            revealIntroImmediately(root);
          },
        });

        if (bar) {
          intro.fromTo(bar, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.42);
        }
        if (animatedCards.length) {
          intro.fromTo(
            animatedCards,
            { y: 22, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.07 },
            bar ? 0.52 : 0.42,
          );
        } else if (empty) {
          intro.fromTo(empty, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.52);
        }
      },
    );
      revert = () => media.revert();
    });

    return () => {
      cancelled = true;
      clearFallback();
      revert();
    };
  }, []);

  return (
    <div className="news-listing" ref={rootRef}>
      <div className="news-listing-bar">
        <div className="news-listing-toolbar" role="group" aria-label="Filtruoti naujienas">
          <button
            type="button"
            className={category === "visos" ? "is-active" : ""}
            aria-pressed={category === "visos"}
            onClick={() => setCategory("visos")}
          >
            Visos
          </button>
          {newsCategories.map((label) => (
            <button
              type="button"
              key={label}
              className={category === label ? "is-active" : ""}
              aria-pressed={category === label}
              onClick={() => setCategory(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="news-listing-count" aria-live="polite">
          {visible.length} {visible.length === 1 ? "įrašas" : "įrašai"}
        </p>
      </div>

      {visible.length > 0 ? (
        <div className="news-list-grid">
          {visible.map((item, index) => (
            <ListCard item={item} priority={index === 0} key={item.slug} />
          ))}
        </div>
      ) : (
        <p className="news-listing-empty">Šioje kategorijoje įrašų neradome.</p>
      )}
    </div>
  );
}
