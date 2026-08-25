"use client";

import * as React from "react";
import gsap from "gsap";
import { revealIntroImmediately, withIntroFallback } from "../lib/motionIntro";
import { RollingLabel } from "./RollingLabel";

const gallery = [
  {
    src: "/local-produce-tomatoes.jpg",
    alt: "Vietos pomidorai KOOPS pasiūloje",
  },
  {
    src: "/ukmerge-fields-2.jpg",
    alt: "Ukmergės krašto laukai",
  },
  {
    src: "/koops-bento-local-shopping.jpg",
    alt: "Vietos produkcija parduotuvėje",
  },
  {
    src: "/ukmerge-fields-1.jpg",
    alt: "Žemės ūkio kraštovaizdis Ukmergės rajone",
  },
] as const;

/** BYQ: terra-tory-hero-6 — suppliers hero */
export function SuppliersHero() {
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

        clearFallback();

        const label = root.querySelector<HTMLElement>(".suppliers-hero-label");
        const title = root.querySelector<HTMLElement>(".suppliers-hero-title");
        const pushLine = root.querySelector<HTMLElement>(".suppliers-hero-title-rule");
        const lead = root.querySelector<HTMLElement>(".suppliers-hero-lead");
        const actions = root.querySelector<HTMLElement>(".suppliers-hero-actions");
        const frames = root.querySelectorAll<HTMLElement>(".suppliers-hero-frame");

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

        const intro = gsap.timeline({ defaults: { duration: 0.75, ease: "power3.out" } });
        if (label) intro.fromTo(label, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.05);
        if (title) intro.fromTo(title, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.12);
        if (pushLine && pushWidth) {
          intro.to(pushLine, { width: pushWidth, duration: 0.7, ease: "power2.out" }, 0.28);
        }
        if (lead) intro.fromTo(lead, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.32);
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
      ref={rootRef}
      className="careers-hero suppliers-hero"
      aria-labelledby="suppliers-hero-title"
      data-byq-component="terra-tory-hero-6"
    >
      <div className="tt-container">
        <div className="careers-hero-top">
          <p className="section-label suppliers-hero-label">TIEKĖJAMS</p>
          <div className="careers-hero-main">
            <div className="careers-hero-heading">
              <h1 id="suppliers-hero-title" className="careers-hero-title suppliers-hero-title">
                <span className="careers-hero-title-line">Auginkime</span>
                <span className="careers-hero-title-row">
                  <i className="careers-hero-title-rule suppliers-hero-title-rule" aria-hidden="true" />
                  <span>vietos pasiūlą</span>
                </span>
                <span className="careers-hero-title-line">kartu</span>
              </h1>
              <div className="careers-hero-actions suppliers-hero-actions">
                <a className="pill-button dark" href="#forma" aria-label="Siųsti produkcijos pasiūlymą">
                  <RollingLabel>Siųsti pasiūlymą</RollingLabel>
                </a>
              </div>
            </div>
            <p className="careers-hero-lead suppliers-hero-lead">
              Ieškome patikimų gamintojų ir tiekėjų. Aišku, ką pateikti, kam rašyti ir kas vyks po
              užklausos — be spėliojimo.
            </p>
          </div>
        </div>

        <div className="careers-hero-gallery" aria-label="Vietos produkcijos ir krašto nuotraukos">
          {gallery.map((item, index) => (
            <figure
              key={item.src}
              className={`careers-hero-frame suppliers-hero-frame${index > 0 ? " careers-hero-frame-desktop" : ""}`}
            >
              <img src={item.src} alt={item.alt} loading={index === 0 ? "eager" : "lazy"} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
