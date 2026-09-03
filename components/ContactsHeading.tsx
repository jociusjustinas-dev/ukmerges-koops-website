"use client";

import * as React from "react";
import { revealIntroImmediately, withIntroFallback } from "../lib/motionIntro";

/** H1 su brūkšnio intro animacija — kaip kituose puslapiuose */
export function ContactsHeading() {
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

        const label = root.querySelector<HTMLElement>(".contacts-heading-label");
        const title = root.querySelector<HTMLElement>(".contacts-heading-title");
        const pushLine = root.querySelector<HTMLElement>(".contacts-heading-title-rule");
        const lead = root.querySelector<HTMLElement>(".contacts-heading-lead");

        const targets = [label, lead].filter(Boolean) as HTMLElement[];
        gsap.set(targets, { autoAlpha: 0 });

        if (pushLine) {
          gsap.set(pushLine, { scaleX: 0, transformOrigin: "left center" });
        }

        const intro = gsap.timeline({
          defaults: { duration: 0.75, ease: "power3.out" },
          onComplete: () => revealIntroImmediately(root),
        });
        if (label) intro.fromTo(label, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.05);
        if (title) intro.fromTo(title, { y: 20 }, { y: 0 }, 0.12);
        if (pushLine) {
          intro.to(pushLine, { scaleX: 1, duration: 0.7, ease: "power2.out", clearProps: "transform,transformOrigin" }, 0.28);
        }
        if (lead) intro.fromTo(lead, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.36);
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
      <p className="section-label contacts-heading-label">KONTAKTAI</p>
      <h1 id="contacts-form-title" className="careers-hero-title contacts-heading-title">
        <span className="careers-hero-title-line">Susisiekite</span>
        <span className="careers-hero-title-row">
          <i
            className="careers-hero-title-rule contacts-heading-title-rule"
            style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
            aria-hidden="true"
          />
          <span>su KOOPS</span>
        </span>
      </h1>
      <p className="contacts-heading-lead">
        Adresas, telefonas ar trumpa žinutė — be spėliojimo.
      </p>
    </div>
  );
}
