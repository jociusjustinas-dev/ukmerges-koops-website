"use client";

import * as React from "react";
import { revealIntroImmediately, withIntroFallback } from "../lib/motionIntro";

/** Naujienų archyvo H1 su brūkšnio intro — kaip ContactsHeading, be label ir lead */
export function NewsPageHeading() {
  const rootRef = React.useRef<HTMLDivElement>(null);

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

        const title = root.querySelector<HTMLElement>(".news-heading-title");
        const pushLine = root.querySelector<HTMLElement>(".news-heading-title-rule");

        if (pushLine) {
          gsap.set(pushLine, { scaleX: 0, transformOrigin: "left center" });
        }

        const intro = gsap.timeline({
          defaults: { duration: 0.75, ease: "power3.out" },
          onComplete: () => revealIntroImmediately(root),
        });
        if (title) intro.fromTo(title, { y: 20 }, { y: 0 }, 0.12);
        if (pushLine) {
          intro.to(pushLine, { scaleX: 1, duration: 0.7, ease: "power2.out", clearProps: "transform,transformOrigin" }, 0.28);
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
    <div className="tt-section-header news-page-header news-heading" ref={rootRef}>
      <h1 id="news-archive-title" className="careers-hero-title news-heading-title">
        <span className="careers-hero-title-line">Naujienos</span>
        <span className="careers-hero-title-row">
          <i
            className="careers-hero-title-rule news-heading-title-rule"
            style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
            aria-hidden="true"
          />
          <span>ir akcijos</span>
        </span>
      </h1>
    </div>
  );
}
