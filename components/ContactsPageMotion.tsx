"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { revealIntroImmediately, withIntroFallback } from "../lib/motionIntro";

gsap.registerPlugin(ScrollTrigger);

/** Kontaktų puslapio antrinis turinys po H1 — forma / kanalai */
export function ContactsPageMotion() {
  React.useLayoutEffect(() => {
    const page = document.querySelector<HTMLElement>(".contacts-page");
    if (!page) return;

    const formSection = page.querySelector<HTMLElement>(".contacts-form-section");
    const channels = page.querySelector<HTMLElement>(".contacts-channels");

    const clearFormFallback = formSection ? withIntroFallback(formSection) : () => {};
    const clearChannelsFallback = channels ? withIntroFallback(channels) : () => {};
    let channelsSafetyId = 0;

    const media = gsap.matchMedia();
    media.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        canAnimate: "(prefers-reduced-motion: no-preference)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { reduceMotion, isMobile } = context.conditions as {
          reduceMotion: boolean;
          isMobile: boolean;
        };

        if (reduceMotion) {
          if (formSection) revealIntroImmediately(formSection);
          if (channels) revealIntroImmediately(channels);
          return;
        }

        if (formSection) {
          clearFormFallback();

          const details = formSection.querySelector<HTMLElement>(".contact-details");
          const form = formSection.querySelector<HTMLElement>(".supplier-form");
          const image = formSection.querySelector<HTMLElement>(".contact-image");
          const blocks = [details, form, image].filter(Boolean) as HTMLElement[];

          if (blocks.length) {
            gsap.set(blocks, { autoAlpha: 0 });
            gsap.fromTo(
              blocks,
              { y: 20, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.75,
                ease: "power3.out",
                stagger: 0.08,
                delay: 0.45,
                onComplete: () => revealIntroImmediately(formSection),
              },
            );
          } else {
            revealIntroImmediately(formSection);
          }
        }

        if (channels) {
          clearChannelsFallback();

          const introCopy = channels.querySelectorAll<HTMLElement>(".jobs-intro > *");
          const rows = channels.querySelectorAll<HTMLElement>(".job-row");
          const targets = [...Array.from(introCopy), ...Array.from(rows)];

          if (targets.length) {
            gsap.set(targets, { autoAlpha: 0 });
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: channels,
                  start: isMobile ? "top 88%" : "top 82%",
                  once: true,
                },
                defaults: { duration: 0.75, ease: "power3.out" },
                onComplete: () => revealIntroImmediately(channels),
              })
              .fromTo(
                introCopy,
                { y: 18, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, stagger: 0.06 },
                0,
              )
              .fromTo(
                rows,
                { y: 20, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, stagger: 0.08 },
                introCopy.length ? 0.12 : 0,
              );

            /* Jei ScrollTrigger neįsijungia (Lenis / mažas ekranas) — neatidėliotinai atidaryti */
            window.clearTimeout(channelsSafetyId);
            channelsSafetyId = window.setTimeout(() => {
              const stillHidden = targets.some(
                (el) => Number.parseFloat(window.getComputedStyle(el).opacity || "1") < 0.05,
              );
              if (stillHidden) {
                gsap.set(targets, { autoAlpha: 1, clearProps: "transform" });
                revealIntroImmediately(channels);
              }
            }, 2800);
          } else {
            revealIntroImmediately(channels);
          }
        }
      },
    );

    return () => {
      window.clearTimeout(channelsSafetyId);
      clearFormFallback();
      clearChannelsFallback();
      media.revert();
    };
  }, []);

  return null;
}
