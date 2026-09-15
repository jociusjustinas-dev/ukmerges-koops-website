"use client";

import * as React from "react";
import type { restaurant as restaurantDefaults } from "../lib/restaurant";
import { revealIntroImmediately, withIntroFallback } from "../lib/motionIntro";
import { RestaurantGalleryMarquee } from "./RestaurantGalleryMarquee";
import { RollingLabel } from "./RollingLabel";

/** BYQ: terra-tory-hero-5 + terra-tory-gallery-1 marquee as media */
export function RestaurantHero({
  restaurant,
  eyebrow,
  title,
  primaryLabel,
  primaryUrl,
  galleryUrls,
}: {
  restaurant: typeof restaurantDefaults;
  eyebrow?: string;
  title?: string;
  primaryLabel?: string;
  primaryUrl?: string;
  galleryUrls?: string[];
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const ctaLabel = primaryLabel?.trim() || "Siųsti užklausą";
  const ctaHref = primaryUrl?.trim() || "#uzklausa";
  const heading =
    title?.trim() || "Restoranas „Vilkmergė“ – vieta, kur gyvena atsiminimai.";
  const label =
    eyebrow?.trim() ||
    `RESTORANAS „${restaurant.name.toUpperCase()}“ · NUO ${restaurant.since} METŲ`;

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const clearFallback = withIntroFallback(root);
    let cancelled = false;
    let revert = () => {};

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled || !root) return;
      gsap.registerPlugin(ScrollTrigger);

      const media = gsap.matchMedia();

      media.add(
        {
          isMobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isMobile, reduceMotion } = context.conditions as {
            isMobile: boolean;
            reduceMotion: boolean;
          };

          const labelEl = root.querySelector<HTMLElement>(".restaurant-hero-label");
          const titleEl = root.querySelector<HTMLElement>(".restaurant-hero-title");
          const actions = root.querySelector<HTMLElement>(".restaurant-hero-actions");

          if (reduceMotion) {
            revealIntroImmediately(root);
            return;
          }

          clearFallback();

          const introTargets = [labelEl, actions].filter(Boolean) as HTMLElement[];
          if (introTargets.length) {
            gsap.set(introTargets, { autoAlpha: 0 });
          }

          const intro = gsap.timeline({
            defaults: { duration: 0.8, ease: "power3.out" },
          });

          if (labelEl) {
            intro.fromTo(labelEl, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.08);
          }

          if (titleEl) {
            intro.fromTo(titleEl, { y: isMobile ? 18 : 28 }, { y: 0 }, 0.16);
          }

          if (actions) {
            intro.fromTo(actions, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.42);
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
    <div ref={rootRef} className="restaurant-hero" id="restaurant-hero" data-byq-component="terra-tory-hero-5" data-cms-section="restaurant-hero">
      <section className="restaurant-hero-top" aria-labelledby="restaurant-hero-title">
        <div className="tt-container">
          <div className="restaurant-hero-heading">
            <p className="section-label light-label restaurant-hero-label" data-cms-field="eyebrow">
              {label}
            </p>

            <div className="restaurant-hero-main">
              <h1 id="restaurant-hero-title" className="restaurant-hero-title" data-cms-field="title" style={{ whiteSpace: "pre-line" }}>
                {heading}
              </h1>

              <div className="restaurant-hero-actions">
                <a className="pill-button accent" href={ctaHref} data-cms-field="primary-link">
                  <RollingLabel>{ctaLabel}</RollingLabel>
                </a>
                <a className="pill-button outline-light" href={restaurant.mobileHref}>
                  <RollingLabel>Skambinti {restaurant.mobileDisplay}</RollingLabel>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="restaurant-hero-media-wrap" aria-label="Restorano „Vilkmergė“ nuotraukų galerija">
        <div className="restaurant-hero-media restaurant-hero-media-marquee is-visible">
          <RestaurantGalleryMarquee galleryUrls={galleryUrls} />
        </div>
      </section>
    </div>
  );
}
