"use client";

import * as React from "react";
import { revealIntroImmediately, withIntroFallback } from "../lib/motionIntro";

export function ClassifiedsPageMotion() {
  React.useEffect(() => {
    const root = document.querySelector<HTMLElement>(".classifieds-directory");
    if (!root) return;

    const clearFallback = withIntroFallback(root);
    let cancelled = false;
    let revert = () => {};

    void import("gsap").then(({ gsap }) => {
      if (cancelled) return;
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

        if (reduceMotion) {
          revealIntroImmediately(root);
          return;
        }

        clearFallback();

        const label = root.querySelector<HTMLElement>(".section-label");
        const title = root.querySelector<HTMLElement>("h1");
        const lead = root.querySelector<HTMLElement>(".classifieds-directory-lead");
        const cards = root.querySelectorAll<HTMLElement>(".classified-card");
        const empty = root.querySelector<HTMLElement>(".classifieds-empty");
        const emptyContent = empty?.querySelectorAll<HTMLElement>(":scope > *");
        const targets = [label, lead, ...Array.from(cards), empty].filter(Boolean) as HTMLElement[];

        gsap.set(targets, { autoAlpha: 0 });
        if (emptyContent?.length) gsap.set(emptyContent, { autoAlpha: 0 });

        const intro = gsap.timeline({
          defaults: { duration: isMobile ? 0.68 : 0.78, ease: "power3.out" },
          onComplete: () => revealIntroImmediately(root),
        });

        if (label) intro.fromTo(label, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.05);
        if (title) {
          intro.fromTo(
            title,
            { y: isMobile ? 20 : 28 },
            { y: 0 },
            0.12,
          );
        }
        if (lead) intro.fromTo(lead, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.32);

        if (cards.length) {
          intro.fromTo(
            cards,
            { y: isMobile ? 26 : 36, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.08, clearProps: "transform" },
            0.48,
          );
        } else if (empty) {
          intro.fromTo(
            empty,
            { y: isMobile ? 26 : 36, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, clearProps: "transform" },
            0.48,
          );
          if (emptyContent?.length) {
            intro.fromTo(
              emptyContent,
              { y: 16, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, stagger: 0.07, clearProps: "transform" },
              0.6,
            );
          }
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

  return null;
}
