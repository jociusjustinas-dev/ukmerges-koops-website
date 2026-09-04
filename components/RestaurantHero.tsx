"use client";

import * as React from "react";
import type { restaurant as restaurantDefaults } from "../lib/restaurant";
import { revealIntroImmediately, withIntroFallback } from "../lib/motionIntro";
import { RestaurantGalleryMarquee } from "./RestaurantGalleryMarquee";
import { RollingLabel } from "./RollingLabel";

const inlineWords = ["vieta,", "kur"] as const;
const closingWords = ["gyvena", "atsiminimai."] as const;

/** BYQ: terra-tory-hero-5 + terra-tory-gallery-1 marquee as media */
export function RestaurantHero({ restaurant }: { restaurant: typeof restaurantDefaults }) {
  const rootRef = React.useRef<HTMLDivElement>(null);

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
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, isMobile, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduceMotion: boolean;
          };

          const label = root.querySelector<HTMLElement>(".restaurant-hero-label");
          const titleLine = root.querySelector<HTMLElement>(".restaurant-hero-title-line");
          const pushLine = root.querySelector<HTMLElement>(".restaurant-hero-title-rule");
          const words = root.querySelectorAll<HTMLElement>(
            ".restaurant-hero-title-row .restaurant-hero-title-word",
          );
          const closingWordsEls = root.querySelectorAll<HTMLElement>(
            ".restaurant-hero-title-closing .restaurant-hero-title-word",
          );
          const actions = root.querySelector<HTMLElement>(".restaurant-hero-actions");

          if (reduceMotion) {
            pushLine?.style.removeProperty("width");
            pushLine?.style.removeProperty("transform");
            revealIntroImmediately(root);
            return;
          }

          clearFallback();

          const introTargets = [label, actions].filter(Boolean) as HTMLElement[];
          if (introTargets.length) {
            gsap.set(introTargets, { autoAlpha: 0 });
          }

          let pushTarget: { element: HTMLElement; width: number } | null = null;
          if (pushLine) {
            pushLine.style.removeProperty("width");
            pushLine.style.removeProperty("transform");
            const width = pushLine.getBoundingClientRect().width;
            pushLine.style.width = "0px";
            pushTarget = { element: pushLine, width };
          }

          const intro = gsap.timeline({
            defaults: { duration: 0.8, ease: "power3.out" },
          });

          if (label) {
            intro.fromTo(label, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.08);
          }

          if (titleLine) {
            intro.fromTo(
              titleLine,
              { y: isMobile ? 18 : 28 },
              { y: 0 },
              0.16,
            );
          }

          if (words.length) {
            intro.fromTo(
              words,
              { y: isMobile ? 16 : 22 },
              { y: 0, stagger: 0.07 },
              0.28,
            );
          }

          if (pushTarget && isDesktop && window.innerWidth > 991) {
            intro.to(
              pushTarget.element,
              {
                width: pushTarget.width,
                duration: 0.82,
                ease: "power3.inOut",
                clearProps: "width",
              },
              0.52,
            );
          } else if (pushLine) {
            pushLine.style.removeProperty("width");
          }

          if (closingWordsEls.length) {
            intro.fromTo(
              closingWordsEls,
              { y: isMobile ? 16 : 22 },
              { y: 0, stagger: 0.07 },
              0.42,
            );
          }

          if (actions) {
            intro.fromTo(
              actions,
              { y: 18, autoAlpha: 0 },
              { y: 0, autoAlpha: 1 },
              0.72,
            );
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
    <div ref={rootRef} className="restaurant-hero" data-byq-component="terra-tory-hero-5" data-cms-section="restaurant-hero">
      <section className="restaurant-hero-top" aria-labelledby="restaurant-hero-title">
        <div className="tt-container">
          <div className="restaurant-hero-heading">
            <p className="section-label light-label restaurant-hero-label">
              RESTORANAS „{restaurant.name.toUpperCase()}“ · NUO {restaurant.since} METŲ
            </p>

            <div className="restaurant-hero-main">
              <h1 id="restaurant-hero-title" className="restaurant-hero-title">
                <span className="restaurant-hero-title-line">Restoranas „Vilkmergė“ –</span>
                <span className="restaurant-hero-title-row">
                  <i
                    className="restaurant-hero-title-rule title-push-line"
                    style={{ width: 0 }}
                    aria-hidden="true"
                  />
                  {inlineWords.map((word) => (
                    <span className="restaurant-hero-title-word" key={word}>
                      {word}
                    </span>
                  ))}
                </span>
                <span className="restaurant-hero-title-closing">
                  {closingWords.map((word) => (
                    <span className="restaurant-hero-title-word" key={word}>
                      {word}
                    </span>
                  ))}
                </span>
              </h1>

              <div className="restaurant-hero-actions">
                <a className="pill-button accent" href="#uzklausa">
                  <RollingLabel>Siųsti užklausą</RollingLabel>
                </a>
                <a
                  className="pill-button outline-light"
                  href={restaurant.mobileHref}
                >
                  <RollingLabel>Skambinti {restaurant.mobileDisplay}</RollingLabel>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="restaurant-hero-media-wrap"
        aria-label="Restorano „Vilkmergė“ nuotraukų galerija"
      >
        <div
          className="restaurant-hero-media restaurant-hero-media-marquee is-visible"
        >
          <RestaurantGalleryMarquee />
        </div>
      </section>
    </div>
  );
}
