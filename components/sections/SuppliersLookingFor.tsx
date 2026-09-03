import { supplierLookingFor } from "../../lib/suppliers";

/** BYQ: terra-tory-bento-1 — ko ieškome (kaip restorano salės) */
export function SuppliersLookingFor() {
  const { fresh, dairy, meat, local } = supplierLookingFor;

  return (
    <section
      className="koops-bento-section suppliers-looking"
      id="ko-ieskome"
      aria-labelledby="suppliers-looking-title"
      data-byq-component="terra-tory-bento-1"
    >
      <div className="tt-container">
        <header className="koops-bento-header">
          <div className="dashed-divider" aria-hidden="true" />
          <p className="section-label">KO IEŠKOME</p>
          <h2 id="suppliers-looking-title">Produkcija, kuri tinka KOOPS lentynoms</h2>
        </header>

        <div className="koops-bento-grid">
          <article className="koops-bento-card">
            <p className="section-label">{fresh.label}</p>
            <div className="koops-bento-card-bottom">
              <div className="koops-bento-card-content">
                <h3>{fresh.title}</h3>
                <p>{fresh.body}</p>
              </div>
            </div>
          </article>

          <div className="koops-bento-media koops-bento-media-tall" aria-hidden="true">
            <img loading="lazy" src="/ukmerge-fields-4.jpg" alt="" />
          </div>

          <article className="koops-bento-card koops-bento-card-career">
            <p className="section-label">{dairy.label}</p>
            <div className="koops-bento-card-bottom">
              <div className="koops-bento-card-content">
                <h3>{dairy.title}</h3>
                <p>{dairy.body}</p>
              </div>
            </div>
          </article>

          <div className="koops-bento-media" aria-hidden="true">
            <img loading="lazy" src="/ukmerge-fields-1.jpg" alt="" />
          </div>

          <article className="koops-bento-card">
            <p className="section-label">{meat.label}</p>
            <div className="koops-bento-card-bottom">
              <div className="koops-bento-card-content">
                <h3>{meat.title}</h3>
                <p>{meat.body}</p>
              </div>
            </div>
          </article>

          <div className="koops-bento-card koops-bento-card-accent">
            <p className="section-label">{local.label}</p>
            <div className="koops-bento-card-content">
              <h3>{local.title}</h3>
              <p>{local.body}</p>
            </div>
            <div className="koops-bento-actions">
              <a className="text-link" href="#forma">
                Siųsti pasiūlymą <span aria-hidden="true">→</span>
              </a>
            </div>
            <span className="koops-bento-circle" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
