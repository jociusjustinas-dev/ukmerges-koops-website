/** Intro FOUC apsauga: CSS slepia elementus, kol GSAP / fallback juos atveria. */

function clearStuckIntroInline(root: HTMLElement) {
  const nodes: HTMLElement[] = [root, ...Array.from(root.querySelectorAll<HTMLElement>("*"))];
  for (const el of nodes) {
    if (el.style.opacity === "0") el.style.removeProperty("opacity");
    if (el.style.visibility === "hidden") el.style.removeProperty("visibility");
  }
}

export function withIntroFallback(root: HTMLElement, delayMs = 1600) {
  const id = window.setTimeout(() => {
    clearStuckIntroInline(root);
    root.classList.add("is-intro-fallback");
  }, delayMs);

  return () => window.clearTimeout(id);
}

export function revealIntroImmediately(root: HTMLElement) {
  clearStuckIntroInline(root);
  root.classList.add("is-intro-fallback");
}
