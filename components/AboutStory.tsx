import { RollingLabel } from "./RollingLabel";
import { aboutOrg, aboutStory } from "../lib/about";

/** BYQ: terra-tory-combo-6 — about story */
export function AboutStory({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryUrl,
  imageUrl,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryUrl?: string;
  imageUrl?: string;
} = {}) {
  const ctaLabel = primaryLabel?.trim() || "Rasti parduotuvę";
  const ctaHref = primaryUrl?.trim() || "/parduotuves";

  return (
    <section data-cms-section="about-story"
      className="tt-story about-story"
      id="about-story"
      aria-labelledby="about-story-title"
      data-byq-component="terra-tory-combo-6"
    >
      <div className="tt-container">
        <div className="story-headline">
          <p className="section-label light-label" data-cms-field="eyebrow">
            {eyebrow?.trim() || aboutStory.label}
          </p>
          <h2 id="about-story-title" data-cms-field="title">
            {title?.trim() || aboutStory.title}
          </h2>
        </div>
        <div className="story-grid">
          <div className="story-image">
            <img
              src={imageUrl?.trim() || aboutStory.image.src}
              alt={aboutStory.image.alt}
              loading="lazy"
              data-cms-field="image"
            />
          </div>
          <div className="story-copy">
            <p data-cms-field="description">{description?.trim() || aboutStory.body}</p>
            <dl>
              {aboutStory.facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
            <div className="story-actions">
              <a className="pill-button accent" href={ctaHref} data-cms-field="primary-link">
                <RollingLabel>{ctaLabel}</RollingLabel>
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
