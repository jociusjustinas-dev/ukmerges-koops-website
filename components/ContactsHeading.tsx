"use client";

import * as React from "react";
import { revealIntroImmediately, withIntroFallback } from "../lib/motionIntro";

/** H1 su brūkšnio intro animacija — kaip kituose puslapiuose */
export function ContactsHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
} = {}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const heading = title?.trim() || "Susisiekite su KOOPS";
  const lead = description?.trim() || "Adresas, telefonas ar trumpa žinutė — be spėliojimo.";

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
          root.querySelector<HTMLElement>(".contacts-heading-title-rule")?.style.removeProperty("width");
          revealIntroImmediately(root);
          return;
        }

        clearFallback();

        const label = root.querySelector<HTMLElement>(".contacts-heading-label");
        const titleEl = root.querySelector<HTMLElement>(".contacts-heading-title");
        const pushLine = root.querySelector<HTMLElement>(".contacts-heading-title-rule");
        const leadEl = root.querySelector<HTMLElement>(".contacts-heading-lead");

        const targets = [label, leadEl].filter(Boolean) as HTMLElement[];
        gsap.set(targets, { autoAlpha: 0 });

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
        if (label) intro.fromTo(label, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.05);
        if (titleEl) intro.fromTo(titleEl, { y: 20 }, { y: 0 }, 0.12);
        if (pushLine && pushWidth) {
          intro.to(pushLine, { width: pushWidth, duration: 0.7, ease: "power2.out", clearProps: "width" }, 0.28);
        }
        if (leadEl) intro.fromTo(leadEl, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.36);
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
    <div className="contact-heading contacts-heading" ref={rootRef}>
      <p className="section-label contacts-heading-label" data-cms-field="eyebrow">
        {eyebrow?.trim() || "KONTAKTAI"}
      </p>
      <h1 id="contacts-form-title" className="careers-hero-title contacts-heading-title" data-cms-field="title">
        {heading}
      </h1>
      <p className="contacts-heading-lead" data-cms-field="description">
        {lead}
      </p>
    </div>
  );
}
