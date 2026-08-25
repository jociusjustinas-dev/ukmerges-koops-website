"use client";

import { useEffect } from "react";

export function StoresPageMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".stores-page");
    if (!root) return;

    let cancelled = false;
    let revert = () => {};

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const media = gsap.matchMedia();

      media.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, isMobile, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduceMotion: boolean;
          };

          const pushLines = root.querySelectorAll<HTMLElement>(".title-push-line");

          if (reduceMotion) {
            pushLines.forEach((line) => line.style.removeProperty("width"));
            return;
          }

          const directory = root.querySelector<HTMLElement>(".stores-directory");
          if (directory) {
            const label = directory.querySelector<HTMLElement>(".section-label");
            const words = directory.querySelectorAll<HTMLElement>(".location-headline > span");
            const pushLine = directory.querySelector<HTMLElement>(".title-push-line");
            const lead = directory.querySelector<HTMLElement>(".stores-directory-lead");
            const finder = directory.querySelector<HTMLElement>(".stores-finder");

            let pushTarget: { element: HTMLElement; width: number } | null = null;
            if (pushLine) {
              pushLine.style.removeProperty("width");
              const width = pushLine.getBoundingClientRect().width;
              pushLine.style.width = "0px";
              pushTarget = { element: pushLine, width };
            }

            const intro = gsap.timeline({
              defaults: { duration: 0.8, ease: "power3.out" },
            });

            if (label) {
              intro.fromTo(label, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.08);
            }

            if (words.length) {
              intro.fromTo(
                words,
                { y: isMobile ? 24 : 42, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, stagger: 0.07 },
                0.16,
              );
            }

            if (pushTarget && isDesktop && window.innerWidth > 1100) {
              intro.to(
                pushTarget.element,
                {
                  width: pushTarget.width,
                  duration: 0.82,
                  ease: "power3.inOut",
                  clearProps: "width",
                },
                0.68,
              );
            } else if (pushLine) {
              pushLine.style.removeProperty("width");
            }

            if (lead) {
              intro.fromTo(lead, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.5);
            }

            if (finder) {
              intro.fromTo(
                finder,
                { y: isMobile ? 24 : 36, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.88, clearProps: "transform" },
                0.62,
              );
            }
          }

          const faq = root.querySelector<HTMLElement>(".stores-faq");
          if (faq) {
            const faqHeadings = faq.querySelectorAll<HTMLElement>(
              ".stores-faq-layout > div:first-child > *",
            );
            const faqItems = faq.querySelectorAll<HTMLElement>(".stores-faq-list details");

            const faqTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: faq,
                start: isMobile ? "top 88%" : "top 82%",
                once: true,
              },
              defaults: { ease: "power3.out" },
            });

            if (faqHeadings.length) {
              faqTimeline.fromTo(
                faqHeadings,
                { y: isMobile ? 20 : 28, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.08 },
                0,
              );
            }

            if (faqItems.length) {
              faqTimeline.fromTo(
                faqItems,
                { y: isMobile ? 20 : 28, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.08 },
                faqHeadings.length ? 0.28 : 0,
              );
            }
          }

          const footerCta = root.querySelector<HTMLElement>(".footer-cta");
          if (footerCta) {
            const footerParts = footerCta.querySelectorAll<HTMLElement>(":scope > :not(.orbit)");
            gsap.timeline({
              scrollTrigger: {
                trigger: footerCta,
                start: isMobile ? "top 88%" : "top 82%",
                once: true,
              },
              defaults: { ease: "power3.out" },
            }).fromTo(
              footerParts,
              { y: isMobile ? 20 : 28, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.08 },
              0,
            );
          }

          window.requestAnimationFrame(() => ScrollTrigger.refresh());
        },
      );

      revert = () => media.revert();
    });

    return () => {
      cancelled = true;
      revert();
    };
  }, []);

  return null;
}
