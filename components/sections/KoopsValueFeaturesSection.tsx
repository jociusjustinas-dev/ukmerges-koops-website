"use client";

import * as React from "react";

const valueFeatures = [
  {
    title: "Parduotuvės",
    image: "/local-produce-tomatoes.jpg",
    imageAlt: "Pirkėja renkasi vietoje užaugintus pomidorus",
    variant: "photo",
    body: "Kasdienės prekės ir vietos gamintojų produkcija Ukmergės mieste bei rajone.",
  },
  {
    title: "Restoranas",
    image: "/ukmerge-fields-3.jpg",
    imageAlt: "Ukmergės krašto laukai vakaro šviesoje",
    variant: "light",
    body: "„Vilkmergė“ – erdvė šventėms, renginiams ir jaukiems susitikimams.",
  },
  {
    title: "Darbo vietos",
    image: "/local-produce-couple.jpg",
    imageAlt: "Pirkėjai renkasi vietos gamintojų produkciją",
    variant: "photo",
    body: "Galimybės dirbti arti namų parduotuvėse, restorane ir logistikoje.",
  },
  {
    title: "Vietos tiekėjai",
    image: "/ukmerge-fields-4.jpg",
    imageAlt: "Dirbami laukai ir sodybos Ukmergės rajone",
    variant: "light",
    body: "Bendradarbiaujame su gamintojais, norinčiais pasiekti KOOPS pirkėjus.",
  },
  {
    title: "Bendruomenė",
    image: "/ukmerge-fields-6.jpg",
    imageAlt: "Rytinis Ukmergės krašto peizažas",
    variant: "photo",
    body: "Esame šalia vietos žmonių, jų kasdienybės ir svarbiausių progų.",
  },
  {
    title: "Kasdienės paslaugos",
    image: "/local-produce-customer.jpg",
    imageAlt: "Pirkėja kraunasi kasdienius produktus į daugkartinį krepšį",
    variant: "light",
    body: "Patogios paslaugos ir pažįstamas aptarnavimas ten, kur gyvenate.",
  },
];

export function KoopsValueFeaturesSection() {
  const [manuallyPaused, setManuallyPaused] = React.useState(false);
  const [hoverPaused, setHoverPaused] = React.useState(false);
  const paused = manuallyPaused || hoverPaused;

  return (
    <section className="tt-about" id="apie" aria-labelledby="apie-antraste" data-byq-component="terra-tory-services-1">
      <div className="tt-container">
        <div className="about-marquee-header">
          <p className="section-label">APIE KOOPS</p>
          <h2 id="apie-antraste">Vietos žmonėms. Vietos verslui.</h2>
          <button
            className="about-marquee-toggle"
            type="button"
            onClick={() => setManuallyPaused((current) => !current)}
            aria-pressed={manuallyPaused}
          >
            {manuallyPaused ? "Tęsti judėjimą" : "Sustabdyti judėjimą"}
          </button>
        </div>
      </div>

      <div
        className="about-marquee"
        role="region"
        aria-label="KOOPS veiklos ir vertės"
        onMouseEnter={() => setHoverPaused(true)}
        onMouseLeave={() => setHoverPaused(false)}
      >
        <div className={`about-marquee-track${paused ? " is-paused" : ""}`}>
          {[0, 1, 2].map((copyIndex) => (
            <div className="about-marquee-set" aria-hidden={copyIndex === 0 ? undefined : true} key={copyIndex}>
              {valueFeatures.map((feature) => (
                <article className={`about-feature-card is-${feature.variant}`} key={`${copyIndex}-${feature.title}`}>
                  <h3>{feature.title}</h3>
                  <img loading="lazy" src={feature.image} alt={feature.imageAlt} />
                  <p>{feature.body}</p>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
