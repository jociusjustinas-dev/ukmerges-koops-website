"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let dispose = () => {};

    void Promise.all([
      import("lenis"),
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        lerp: 0.075,
        wheelMultiplier: 0.6,
        gestureOrientation: "vertical",
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
      });

      const updateScrollTrigger = () => ScrollTrigger.update();
      const updateLenis = (time: number) => lenis.raf(time * 1000);

      lenis.on("scroll", updateScrollTrigger);
      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();

      dispose = () => {
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
