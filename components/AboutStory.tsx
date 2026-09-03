import { RollingLabel } from "./RollingLabel";
import { aboutOrg, aboutStory } from "../lib/about";

/** BYQ: terra-tory-combo-6 — about story */
export function AboutStory() {
  return (
    <section data-cms-section="about-story"
      className="tt-story about-story"
      aria-labelledby="about-story-title"
      data-byq-component="terra-tory-combo-6"
    >
      <div className="tt-container">
        <div className="story-headline">
          <p className="section-label light-label">{aboutStory.label}</p>
          <h2 id="about-story-title">{aboutStory.title}</h2>
        </div>
        <div className="story-grid">
          <div className="story-image">
            <img src={aboutStory.image.src} alt={aboutStory.image.alt} loading="lazy" />
          </div>
          <div className="story-copy">
            <p>{aboutStory.body}</p>
            <dl>
              {aboutStory.facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
            <div className="story-actions">
              <a className="pill-button accent" href="/parduotuves">
                <RollingLabel>Rasti parduotuvę</RollingLabel>
              </a>
              <a
                className="pill-button outline-light"
                href={aboutOrg.phoneHref}
                aria-label={`Skambinti ${aboutOrg.phoneDisplay}`}
              >
                <RollingLabel>Skambinti {aboutOrg.phoneDisplay}</RollingLabel>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
