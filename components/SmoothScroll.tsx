"use client";

import { useEffect } from "react";

function isModifiedClick(event: MouseEvent) {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function isBackToTopLink(link: HTMLAnchorElement) {
  if (link.classList.contains("footer-back-to-top")) return true;

  const href = link.getAttribute("href");
  if (!href) return false;

  if (href === "#pradzia") return true;

  try {
    const url = new URL(href, window.location.href);
    return url.hash === "#pradzia" && url.pathname === window.location.pathname;
  } catch {
    return false;
  }
}

export function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    let dispose = () => {};

    void Promise.all([
      import("lenis"),
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = reduceMotion
        ? null
        : new Lenis({
            lerp: 0.075,
            wheelMultiplier: 0.6,
            gestureOrientation: "vertical",
            smoothWheel: true,
            syncTouch: false,
            autoRaf: false,
          });

      const scrollToTop = () => {
        if (lenis) {
          lenis.scrollTo(0, { force: true, lock: true });
        } else {
          window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        }

        if (window.location.hash !== "#pradzia") {
          history.replaceState(null, "", `${window.location.pathname}${window.location.search}#pradzia`);
        }
      };

      const onClick = (event: MouseEvent) => {
        if (event.defaultPrevented || isModifiedClick(event)) return;

        const link = (event.target as Element | null)?.closest?.("a");
        if (!(link instanceof HTMLAnchorElement) || !isBackToTopLink(link)) return;

        event.preventDefault();
        scrollToTop();
      };

      document.addEventListener("click", onClick);

      if (!lenis) {
        dispose = () => document.removeEventListener("click", onClick);
        return;
      }

      const updateScrollTrigger = () => ScrollTrigger.update();
      const updateLenis = (time: number) => lenis.raf(time * 1000);

      lenis.on("scroll", updateScrollTrigger);
      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();

      dispose = () => {
        document.removeEventListener("click", onClick);
        lenis.off("scroll", updateScrollTrigger);
        gsap.ticker.remove(updateLenis);
        lenis.destroy();
      };
    });

    return () => {
      cancelled = true;
      dispose();
    };
  }, []);

  return null;
}
