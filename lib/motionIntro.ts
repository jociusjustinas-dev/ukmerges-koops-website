/** Intro FOUC apsauga: CSS slepia elementus, kol GSAP / fallback juos atveria. */

export function withIntroFallback(root: HTMLElement, delayMs = 1600) {
  const id = window.setTimeout(() => {
    root.classList.add("is-intro-fallback");
  }, delayMs);

  return () => window.clearTimeout(id);
}

export function revealIntroImmediately(root: HTMLElement) {
  root.classList.add("is-intro-fallback");
}
