"use client";

import * as React from "react";
import gsap from "gsap";
import { revealIntroImmediately, withIntroFallback } from "../lib/motionIntro";

/** Naujienų archyvo H1 su brūkšnio intro — kaip ContactsHeading, be label ir lead */
export function NewsPageHeading() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const clearFallback = withIntroFallback(root);
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

        if (title) gsap.set(title, { autoAlpha: 0 });

        let pushWidth = 0;
        if (pushLine) {
          pushLine.style.removeProperty("width");
          pushWidth = pushLine.getBoundingClientRect().width;
          pushLine.style.width = "0px";
        }

        const intro = gsap.timeline({
          defaults: { duration: 0.75, ease: "power3.out" },
          onComplete: () => revealIntroImmediately(root),
        });
        if (title) intro.fromTo(title, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.12);
        if (pushLine && pushWidth) {
          intro.to(pushLine, { width: pushWidth, duration: 0.7, ease: "power2.out" }, 0.28);
        }
      },
    );

    return () => {
      clearFallback();
      media.revert();
    };
  }, []);

  return (
    <div className="tt-section-header news-page-header news-heading" ref={rootRef}>
      <h1 id="news-archive-title" className="careers-hero-title news-heading-title">
        <span className="careers-hero-title-line">Naujienos</span>
        <span className="careers-hero-title-row">
          <i className="careers-hero-title-rule news-heading-title-rule" aria-hidden="true" />
          <span>ir akcijos</span>
        </span>
      </h1>
    </div>
  );
}
