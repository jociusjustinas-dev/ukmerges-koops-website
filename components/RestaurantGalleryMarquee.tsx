"use client";

import * as React from "react";
import { restaurantGallery } from "../lib/restaurant";

function ImageStrip({ keyPrefix }: { keyPrefix: string }) {
  return (
    <div className="restaurant-gallery-strip">
      {restaurantGallery.map((img) => (
        <div
          className={`restaurant-gallery-frame${img.big ? " is-big" : ""}`}
          key={`${keyPrefix}-${img.src}`}
        >
          <img src={img.src} alt={img.alt} />
        </div>
      ))}
    </div>
  );
}

/** BYQ: terra-tory-gallery-1 — infinite image marquee */
export function RestaurantGalleryMarquee() {
  const [paused, setPaused] = React.useState(false);
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div
      className="restaurant-gallery-marquee"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={`restaurant-gallery-track${paused || reduceMotion ? " is-paused" : ""}`}>
        <ImageStrip keyPrefix="a" />
        <ImageStrip keyPrefix="b" />
        <ImageStrip keyPrefix="c" />
      </div>
    </div>
  );
}
