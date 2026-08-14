"use client";

import * as React from "react";

const valueFeatures = [
  {
    title: "Parduotuvės",
    icon: "https://byqsupply-components.netlify.app/Terra-Tory/images/ServiceIcon.svg",
    body: "Kasdienės prekės ir vietos gamintojų produkcija Ukmergės mieste bei rajone.",
  },
  {
    title: "Restoranas",
    icon: "https://byqsupply-components.netlify.app/Terra-Tory/images/ServiceIcon-1.svg",
    body: "„Vilkmergė“ – erdvė šventėms, renginiams ir jaukiems susitikimams.",
  },
  {
    title: "Darbo vietos",
    icon: "https://byqsupply-components.netlify.app/Terra-Tory/images/Service-Icon-2.svg",
    body: "Galimybės dirbti arti namų parduotuvėse, restorane ir logistikoje.",
  },
  {
    title: "Vietos tiekėjai",
    icon: "https://byqsupply-components.netlify.app/Terra-Tory/images/ServiceIcon-3.svg",
    body: "Bendradarbiaujame su gamintojais, norinčiais pasiekti KOOPS pirkėjus.",
  },
  {
    title: "Bendruomenė",
    icon: "https://byqsupply-components.netlify.app/Terra-Tory/images/ServiceIcon.svg",
    body: "Esame šalia vietos žmonių, jų kasdienybės ir svarbiausių progų.",
  },
  {
    title: "Kasdienės paslaugos",
    icon: "https://byqsupply-components.netlify.app/Terra-Tory/images/Service-Icon-2.svg",
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
                <article className="about-feature-card" key={`${copyIndex}-${feature.title}`}>
                  <h3>{feature.title}</h3>
                  <img loading="lazy" src={feature.icon} alt="" />
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

