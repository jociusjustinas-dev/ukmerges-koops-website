"use client";

import * as React from "react";
import { revealIntroImmediately, withIntroFallback } from "../lib/motionIntro";

/** Naujienų archyvo H1 su brūkšnio intro — kaip ContactsHeading, be label ir lead */
export function NewsPageHeading({ title }: { title?: string } = {}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const heading = title?.trim() || "Naujienos ir akcijos";

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
          root.querySelector<HTMLElement>(".news-heading-title-rule")?.style.removeProperty("width");
          revealIntroImmediately(root);
          return;
        }

        clearFallback();

        const titleEl = root.querySelector<HTMLElement>(".news-heading-title");
        const pushLine = root.querySelector<HTMLElement>(".news-heading-title-rule");

        let pushWidth = 0;
        if (pushLine) {
          pushLine.style.removeProperty("width");
          pushLine.style.removeProperty("transform");
          pushLine.style.removeProperty("transform-origin");
          pushWidth = pushLine.getBoundingClientRect().width;
          pushLine.style.width = "0px";
        }

        const intro = gsap.timeline({
          defaults: { duration: 0.75, ease: "power3.out" },
          onComplete: () => revealIntroImmediately(root),
        });
        if (titleEl) intro.fromTo(titleEl, { y: 20 }, { y: 0 }, 0.12);
        if (pushLine && pushWidth) {
          intro.to(pushLine, { width: pushWidth, duration: 0.7, ease: "power2.out", clearProps: "width" }, 0.28);
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
      <h1 id="news-archive-title" className="careers-hero-title news-heading-title" data-cms-field="title">
        {heading}
      </h1>
    </div>
  );
}
