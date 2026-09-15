import { RollingLabel } from "../RollingLabel";
import {
  defaultSuppliersProcess,
  sectionItemsOrDefault,
  type CmsProcessItem,
} from "../../lib/cms-items";

/** BYQ: structured-data-2 / tt-jobs — process steps (kaip veikia) */
export function SuppliersProcess({
  items,
  title,
  description,
  primaryLabel,
  primaryUrl,
}: {
  items?: CmsProcessItem[];
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryUrl?: string;
}) {
  const steps = sectionItemsOrDefault(items, defaultSuppliersProcess);
  const ctaLabel = primaryLabel?.trim() || "Siųsti pasiūlymą";
  const ctaHref = primaryUrl?.trim() || "#forma";

  return (
    <section
      data-cms-section="suppliers-process"
      className="tt-jobs suppliers-process"
      id="kaip-veikia"
      aria-labelledby="suppliers-process-title"
      data-byq-component="structured-data-2-process"
    >
      <div className="tt-container jobs-layout">
        <div className="jobs-intro">
          <h2 id="suppliers-process-title" data-cms-field="title">
            {title?.trim() || "Trys žingsniai iki kontakto"}
          </h2>
          <p data-cms-field="description">
            {description?.trim() ||
              "Aiškus kelias: ką pateikti, ką darome mes ir kas vyks po užklausos — be spėliojimo."}
          </p>
          <a className="pill-button accent" href={ctaHref} aria-label="Siųsti produkcijos pasiūlymą" data-cms-field="primary-link">
            <RollingLabel>{ctaLabel}</RollingLabel>
          </a>
        </div>

        <ol className="jobs-list suppliers-process-list" aria-label="Tiekėjo kelio žingsniai">
          {steps.map((item, index) => (
            <li className="job-row suppliers-process-step" key={`${item.step}-${index}`}>
              <div className="job-row-copy">
                <div className="job-row-meta">
                  <span className="suppliers-process-num">{item.step}</span>
                </div>
                <h3>{item.title}</h3>
                <p className="job-row-summary">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
