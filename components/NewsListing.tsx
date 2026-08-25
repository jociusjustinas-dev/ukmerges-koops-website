"use client";

import { useMemo, useState } from "react";
import {
  newsCategories,
  newsDateLabel,
  newsHref,
  newsItems,
  type NewsItem,
} from "../lib/news";

type CategoryFilter = "visos" | string;

function ListCard({ item }: { item: NewsItem }) {
  return (
    <a className="news-list-card" href={newsHref(item.slug)}>
      <div className={`news-list-media${item.image ? "" : " is-placeholder"}`}>
        {item.image ? (
          <img loading="lazy" src={item.image} alt="" />
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

export function NewsListing() {
  const [category, setCategory] = useState<CategoryFilter>("visos");

  const visible = useMemo(
    () => (category === "visos" ? newsItems : newsItems.filter((item) => item.category === category)),
    [category],
  );

  return (
    <div className="news-listing">
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
          {visible.map((item) => (
            <ListCard item={item} key={item.slug} />
          ))}
        </div>
      ) : (
        <p className="news-listing-empty">Šioje kategorijoje įrašų neradome.</p>
      )}
    </div>
  );
}
