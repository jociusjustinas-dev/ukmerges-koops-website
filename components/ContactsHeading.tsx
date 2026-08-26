"use client";

import * as React from "react";
import gsap from "gsap";
import { contactsOrg } from "../lib/contacts";
import { revealIntroImmediately, withIntroFallback } from "../lib/motionIntro";

/** H1 su brūkšnio intro animacija — kaip kituose puslapiuose */
export function ContactsHeading() {
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

        const label = root.querySelector<HTMLElement>(".contacts-heading-label");
        const title = root.querySelector<HTMLElement>(".contacts-heading-title");
        const pushLine = root.querySelector<HTMLElement>(".contacts-heading-title-rule");
        const lead = root.querySelector<HTMLElement>(".contacts-heading-lead");

        const targets = [label, title, lead].filter(Boolean) as HTMLElement[];
        gsap.set(targets, { autoAlpha: 0 });

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
        if (label) intro.fromTo(label, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.05);
        if (title) intro.fromTo(title, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.12);
        if (pushLine && pushWidth) {
          intro.to(pushLine, { width: pushWidth, duration: 0.7, ease: "power2.out" }, 0.28);
        }
        if (lead) intro.fromTo(lead, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.36);
      },
    );

    return () => {
      clearFallback();
      media.revert();
    };
  }, []);

  return (
    <div className="contact-heading contacts-heading" ref={rootRef}>
      <p className="section-label contacts-heading-label">KONTAKTAI</p>
      <h1 id="contacts-form-title" className="careers-hero-title contacts-heading-title">
        <span className="careers-hero-title-line">Susisiekite</span>
        <span className="careers-hero-title-row">
          <i className="careers-hero-title-rule contacts-heading-title-rule" aria-hidden="true" />
          <span>su KOOPS</span>
        </span>
      </h1>
      <p className="contacts-heading-lead">
        Adresas, telefonas ar trumpa žinutė — be spėliojimo. {contactsOrg.note}
      </p>
    </div>
  );
}
