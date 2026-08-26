"use client";

import * as React from "react";
import gsap from "gsap";
import { aboutHeroGallery } from "../lib/about";
import { revealIntroImmediately, withIntroFallback } from "../lib/motionIntro";
import { RollingLabel } from "./RollingLabel";

/** BYQ: terra-tory-hero-6 — about hero */
export function AboutHero() {
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

        const label = root.querySelector<HTMLElement>(".about-hero-label");
        const title = root.querySelector<HTMLElement>(".about-hero-title");
        const pushLine = root.querySelector<HTMLElement>(".about-hero-title-rule");
        const lead = root.querySelector<HTMLElement>(".about-hero-lead");
        const actions = root.querySelector<HTMLElement>(".about-hero-actions");
        const frames = root.querySelectorAll<HTMLElement>(".about-hero-frame");

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
      className="careers-hero about-hero"
      aria-labelledby="about-hero-title"
      data-byq-component="terra-tory-hero-6"
    >
      <div className="tt-container">
        <div className="careers-hero-top">
          <p className="section-label about-hero-label">APIE KOOPS</p>
          <div className="careers-hero-main">
            <div className="careers-hero-heading">
              <h1 id="about-hero-title" className="careers-hero-title about-hero-title">
                <span className="careers-hero-title-line">Vietos žmonėms.</span>
                <span className="careers-hero-title-row">
                  <i className="careers-hero-title-rule about-hero-title-rule" aria-hidden="true" />
                  <span>Vietos verslui.</span>
                </span>
              </h1>
              <div className="careers-hero-actions about-hero-actions">
                <a className="pill-button dark" href="/parduotuves" aria-label="Rasti KOOPS parduotuvę">
                  <RollingLabel>Rasti parduotuvę</RollingLabel>
                </a>
              </div>
            </div>
            <p className="careers-hero-lead about-hero-lead">
              Ukmergės rajono vartotojų kooperatyvas — parduotuvės, restoranas ir partnerystė su vietos
              žmonėmis kasdien.
            </p>
          </div>
        </div>

        <div className="careers-hero-gallery" aria-label="KOOPS ir Ukmergės krašto nuotraukos">
          {aboutHeroGallery.map((item, index) => (
            <figure
              key={item.src}
              className="careers-hero-frame about-hero-frame"
            >
              <img src={item.src} alt={item.alt} loading={index === 0 ? "eager" : "lazy"} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
