"use client";

import * as React from "react";
import gsap from "gsap";
import { revealIntroImmediately, withIntroFallback } from "../lib/motionIntro";
import { RollingLabel } from "./RollingLabel";

const gallery = [
  {
    src: "/local-produce-customer.jpg",
    alt: "KOOPS pirkėja parduotuvėje",
  },
  {
    src: "/koops-community.jpg",
    alt: "KOOPS bendruomenė Ukmergėje",
  },
  {
    src: "/store-pivonija.jpeg",
    alt: "KOOPS parduotuvė „Pivonija“",
  },
  {
    src: "/local-produce-couple.jpg",
    alt: "KOOPS komanda ir vietos produkcija",
  },
] as const;

/** BYQ: terra-tory-hero-6 — careers hero + image grid */
export function CareersHero() {
  const rootRef = React.useRef<HTMLElement>(null);

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

        const label = root.querySelector<HTMLElement>(".careers-hero-label");
        const title = root.querySelector<HTMLElement>(".careers-hero-title");
        const pushLine = root.querySelector<HTMLElement>(".careers-hero-title-rule");
        const lead = root.querySelector<HTMLElement>(".careers-hero-lead");
        const actions = root.querySelector<HTMLElement>(".careers-hero-actions");
        const frames = root.querySelectorAll<HTMLElement>(".careers-hero-frame");

        const targets = [label, title, lead, actions, ...Array.from(frames)].filter(
          Boolean,
        ) as HTMLElement[];
        gsap.set(targets, { autoAlpha: 0 });

        let pushWidth = 0;
        if (pushLine) {
          pushLine.style.removeProperty("width");
          pushWidth = pushLine.getBoundingClientRect().width;
          pushLine.style.width = "0px";
        }

        const finishIntro = () => {
          gsap.set(targets, { clearProps: "opacity,visibility,transform" });
          if (pushLine) gsap.set(pushLine, { clearProps: "width" });
          root.classList.add("is-intro-fallback");
          clearFallback();
        };

        const intro = gsap.timeline({
          defaults: { duration: 0.75, ease: "power3.out" },
          onComplete: finishIntro,
        });
        if (label) intro.fromTo(label, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.05);
        if (title) intro.fromTo(title, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.12);
        if (pushLine && pushWidth) {
          intro.to(pushLine, { width: pushWidth, duration: 0.7, ease: "power2.out" }, 0.28);
        }
        if (lead) intro.fromTo(lead, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.32);
        if (actions) intro.fromTo(actions, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.4);
        if (frames.length) {
          intro.fromTo(
            frames,
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.08 },
            0.48,
          );
        }
      },
    );

    return () => {
      clearFallback();
      media.revert();
    };
  }, []);

  return (
    <section
      data-cms-section="careers-hero"
      ref={rootRef}
      className="careers-hero"
      aria-labelledby="careers-hero-title"
      data-byq-component="terra-tory-hero-6"
    >
      <div className="tt-container">
        <div className="careers-hero-top">
          <p className="section-label careers-hero-label">KARJERA</p>
          <div className="careers-hero-main">
            <div className="careers-hero-heading">
              <h1 id="careers-hero-title" className="careers-hero-title">
                <span className="careers-hero-title-line">Darbas arti</span>
                <span className="careers-hero-title-row">
                  <i className="careers-hero-title-rule" aria-hidden="true" />
                  <span> namų</span>
                </span>
                <span className="careers-hero-title-line">Ukmergėje ir rajone</span>
              </h1>
              <div className="careers-hero-actions">
                <a className="pill-button dark" href="#pozicijos" aria-label="Žiūrėti laisvas pozicijas">
                  <RollingLabel>Laisvos pozicijos</RollingLabel>
                </a>
              </div>
            </div>
            <p className="careers-hero-lead">
              KOOPS ieško žmonių parduotuvėse, restorane „Vilkmergė“ ir logistikoje. Aiškus skelbimas,
              vieta ir paprastas kandidatavimo kelias — be spėliojimo.
            </p>
          </div>
        </div>

        <div className="careers-hero-gallery" aria-label="KOOPS darbo aplinkos nuotraukos">
          {gallery.map((item, index) => (
            <figure
              key={item.src}
              className="careers-hero-frame"
            >
              <img src={item.src} alt={item.alt} loading={index < 2 ? "eager" : "lazy"} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
