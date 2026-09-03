"use client";

import * as React from "react";

const features = [
  {
    title: "Arti namų",
    body: "Darbas Ukmergėje ir rajone — be ilgos kelionės į didesnį miestą.",
    tone: "bone" as const,
    icon: (
      <svg width="100%" height="100%" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M29.3332 23.9053V31.3347C29.3332 31.7027 29.0346 32.0013 28.6666 32.0013C28.2986 32.0013 27.9999 31.7027 27.9999 31.3347V23.9053C27.9999 21.7 26.4959 19.8267 24.3439 19.3493L15.1892 17.3187C14.8839 17.2507 14.6666 16.98 14.6666 16.668V7.47733C14.6666 6.42533 13.9532 5.516 13.0079 5.36267C12.4119 5.268 11.8266 5.424 11.3719 5.81067C10.9239 6.192 10.6666 6.748 10.6666 7.33467V25.5187C10.6666 25.7747 10.5199 26.008 10.2892 26.1187C10.0586 26.232 9.78523 26.2 9.5839 26.04L6.0679 23.24C5.22523 22.4547 3.95723 22.4973 3.20656 23.3C2.45456 24.1053 2.4959 25.376 3.2999 26.1307L8.25856 30.8507C8.52523 31.104 8.5359 31.5267 8.28256 31.7933C8.15056 31.9307 7.9759 32 7.7999 32C7.63456 32 7.46923 31.9387 7.3399 31.816L2.38523 27.0987C1.04923 25.8453 0.978564 23.7307 2.23323 22.388C3.48656 21.048 5.59723 20.9747 6.9399 22.2293L9.33456 24.1333V7.33467C9.33456 6.356 9.76256 5.42933 10.5092 4.79467C11.2572 4.16 12.2479 3.88933 13.2226 4.04533C14.8066 4.30267 16.0012 5.77733 16.0012 7.476V16.132L24.6346 18.0467C27.4012 18.66 29.3346 21.0693 29.3346 23.904L29.3332 23.9053Z" />
      </svg>
    ),
  },
  {
    title: "Aiškios pozicijos",
    body: "Kiekviename skelbime — pavadinimas, vieta ir trumpas aprašymas, ką veiksite.",
    tone: "sprout" as const,
    icon: (
      <svg width="100%" height="100%" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M29.3333 25.4V6.6C30.8533 6.29067 32 4.944 32 3.33333C32 1.49467 30.5053 0 28.6667 0C27.056 0 25.7093 1.14667 25.4 2.66667H6.6C6.29067 1.14667 4.944 0 3.33333 0C1.49467 0 0 1.49467 0 3.33333C0 4.944 1.14667 6.29067 2.66667 6.6V25.4C1.14667 25.7093 0 27.056 0 28.6667C0 30.5053 1.49467 32 3.33333 32C4.944 32 6.29067 30.8533 6.6 29.3333H25.4C25.7093 30.8533 27.056 32 28.6667 32C30.5053 32 32 30.5053 32 28.6667C32 27.056 30.8533 25.7093 29.3333 25.4ZM25.4 28H6.6C6.33467 26.696 5.30533 25.6667 4 25.4V6.6C5.304 6.33467 6.33333 5.30533 6.6 4H25.4C25.6653 5.304 26.6947 6.33333 28 6.6V25.4C26.696 25.6653 25.6667 26.6947 25.4 28Z" />
      </svg>
    ),
  },
  {
    title: "Įvairūs keliai",
    body: "Parduotuvės, restoranas ir logistika — galite rinktis pagal patirtį ir ritmą.",
    tone: "moss" as const,
    icon: (
      <svg width="100%" height="100%" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M6 19.9987H16.6667C17.7693 19.9987 18.6667 19.1014 18.6667 17.9987V16.6654C18.6667 15.5627 17.7693 14.6654 16.6667 14.6654H6C4.89733 14.6654 4 15.5627 4 16.6654V17.9987C4 19.1014 4.89733 19.9987 6 19.9987ZM5.33333 16.6654C5.33333 16.2974 5.632 15.9987 6 15.9987H16.6667C17.0347 15.9987 17.3333 16.2974 17.3333 16.6654V17.9987C17.3333 18.3667 17.0347 18.6654 16.6667 18.6654H6C5.632 18.6654 5.33333 18.3667 5.33333 17.9987V16.6654ZM22 26.6654H26C27.1027 26.6654 28 25.768 28 24.6654V16.6654C28 15.5627 27.1027 14.6654 26 14.6654H22C20.8973 14.6654 20 15.5627 20 16.6654V24.6654C20 25.768 20.8973 26.6654 22 26.6654ZM21.3333 16.6654C21.3333 16.2974 21.632 15.9987 22 15.9987H26C26.368 15.9987 26.6667 16.2974 26.6667 16.6654V24.6654C26.6667 25.0334 26.368 25.332 26 25.332H22C21.632 25.332 21.3333 25.0334 21.3333 24.6654V16.6654ZM6 26.6654H16.6667C17.7693 26.6654 18.6667 25.768 18.6667 24.6654V23.332C18.6667 22.2294 17.7693 21.332 16.6667 21.332H6C4.89733 21.332 4 22.2294 4 23.332V24.6654C4 25.768 4.89733 26.6654 6 26.6654ZM5.33333 23.332C5.33333 22.964 5.632 22.6654 6 22.6654H16.6667C17.0347 22.6654 17.3333 22.964 17.3333 23.332V24.6654C17.3333 25.0334 17.0347 25.332 16.6667 25.332H6C5.632 25.332 5.33333 25.0334 5.33333 24.6654V23.332ZM26 1.33203H6C2.692 1.33203 0 4.02403 0 7.33203V24.6654C0 27.9734 2.692 30.6654 6 30.6654H26C29.308 30.6654 32 27.9734 32 24.6654V7.33203C32 4.02403 29.308 1.33203 26 1.33203ZM30.6667 24.6654C30.6667 27.2387 28.5733 29.332 26 29.332H6C3.42667 29.332 1.33333 27.2387 1.33333 24.6654V11.9987H30.6667V24.6654ZM30.6667 10.6654H1.33333V7.33203C1.33333 4.7587 3.42667 2.66536 6 2.66536H26C28.5733 2.66536 30.6667 4.7587 30.6667 7.33203V10.6654ZM14.6667 6.66536C14.6667 7.40136 14.0693 7.9987 13.3333 7.9987C12.5973 7.9987 12 7.40136 12 6.66536C12 5.92936 12.5973 5.33203 13.3333 5.33203C14.0693 5.33203 14.6667 5.92936 14.6667 6.66536ZM6.66667 6.66536C6.66667 7.40136 6.06933 7.9987 5.33333 7.9987C4.59733 7.9987 4 7.40136 4 6.66536C4 5.92936 4.59733 5.33203 5.33333 5.33203C6.06933 5.33203 6.66667 5.92936 6.66667 6.66536ZM10.6667 6.66536C10.6667 7.40136 10.0693 7.9987 9.33333 7.9987C8.59733 7.9987 8 7.40136 8 6.66536C8 5.92936 8.59733 5.33203 9.33333 5.33203C10.0693 5.33203 10.6667 5.92936 10.6667 6.66536Z" />
      </svg>
    ),
  },
  {
    title: "Paprastas kandidatavimas",
    body: "Pasirinkite skelbimą ir kandidatuokite išorinėje nuorodoje — arba parašykite, jei neradote tinkamos pozicijos.",
    tone: "honey" as const,
    icon: (
      <svg width="100%" height="100%" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M29.3333 18.6667H13.3333V4.66667C13.3333 2.09333 11.24 0 8.66667 0H4.66667C2.09333 0 0 2.09333 0 4.66667V26C0 29.308 2.692 32 6 32H27.3333C29.9067 32 32 29.9067 32 27.3333V23.3333C32 20.76 29.9067 18.6667 27.3333 18.6667ZM30.6667 27.3333C30.6667 29.172 29.172 30.6667 27.3333 30.6667H6C3.42667 30.6667 1.33333 28.5733 1.33333 26V4.66667C1.33333 2.828 2.82933 1.33333 4.66667 1.33333H8.66667C10.504 1.33333 12 2.828 12 4.66667V5.33333H8.66667C8.29867 5.33333 8 5.632 8 6C8 6.368 8.29867 6.66667 8.66667 6.66667H12V12H8.66667C8.29867 12 8 12.2987 8 12.6667C8 13.0347 8.29867 13.3333 8.66667 13.3333H12V18.6667H8.66667C8.29867 18.6667 8 18.9653 8 19.3333C8 19.7013 8.29867 20 8.66667 20H12V23.3333C12 23.7013 12.2987 24 12.6667 24C13.0347 24 13.3333 23.7013 13.3333 23.3333V20H18.6667V23.3333C18.6667 23.7013 18.9653 24 19.3333 24C19.7013 24 20 23.7013 20 23.3333V20H25.3333V23.3333C25.3333 23.7013 25.632 24 26 24C26.368 24 26.6667 23.7013 26.6667 23.3333V20H27.3333C29.172 20 30.6667 21.4947 30.6667 23.3333V27.3333Z" />
      </svg>
    ),
  },
];

/** BYQ: terra-tory value features — adapted for careers */
export function CareersValueFeatures() {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section data-cms-section="careers-features"
      className="restaurant-features careers-features"
      aria-labelledby="careers-features-title"
      data-byq-component="terra-tory-value-features"
    >
      <div className="tt-container">
        <div className="dashed-divider restaurant-features-divider" aria-hidden="true" />

        <div className="restaurant-features-layout">
          <div className="restaurant-features-intro">
            <p className="section-label">KODĖL KOOPS</p>
            <h2 id="careers-features-title">Vietos darbas, aiškus kelias ir komanda šalia</h2>
          </div>

          <div ref={gridRef} className="restaurant-features-grid">
            {features.map((feature, i) => (
              <article
                key={feature.title}
                className={`restaurant-feature-card is-tone-${feature.tone}${visible ? " is-visible" : ""}`}
                style={{ transitionDelay: visible ? `${i * 100}ms` : "0ms" }}
              >
                <div className="restaurant-feature-icon">{feature.icon}</div>
                <div className="restaurant-feature-copy">
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
