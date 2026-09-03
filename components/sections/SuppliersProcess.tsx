import { RollingLabel } from "../RollingLabel";
import { supplierProcessSteps } from "../../lib/suppliers";

/** BYQ: structured-data-2 / tt-jobs — process steps (kaip veikia) */
export function SuppliersProcess() {
  return (
    <section data-cms-section="suppliers-process"
      className="tt-jobs suppliers-process"
      id="kaip-veikia"
      aria-labelledby="suppliers-process-title"
      data-byq-component="structured-data-2-process"
    >
      <div className="tt-container jobs-layout">
        <div className="jobs-intro">
          <h2 id="suppliers-process-title">Trys žingsniai iki kontakto</h2>
          <p>
            Aiškus kelias: ką pateikti, ką darome mes ir kas vyks po užklausos — be spėliojimo.
          </p>
          <a className="pill-button accent" href="#forma" aria-label="Siųsti produkcijos pasiūlymą">
            <RollingLabel>Siųsti pasiūlymą</RollingLabel>
          </a>
        </div>

        <ol className="jobs-list suppliers-process-list" aria-label="Tiekėjo kelio žingsniai">
          {supplierProcessSteps.map((item) => (
            <li className="job-row suppliers-process-step" key={item.step}>
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
