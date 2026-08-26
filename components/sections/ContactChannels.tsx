import { AvenirButtonArrow } from "../../app/byq-icons";
import { contactChannels } from "../../lib/contacts";

/** BYQ: structured-data-2 — contact destination channels */
export function ContactChannels() {
  return (
    <section
      className="tt-jobs contacts-channels"
      id="keliai"
      aria-labelledby="contacts-channels-title"
      data-byq-component="structured-data-2-contacts"
    >
      <div className="tt-container jobs-layout">
        <div className="jobs-intro">
          <h2 id="contacts-channels-title">Kur kreiptis</h2>
          <p>
            Pasirinkite temą — greičiau rasite adresą, užklausą ar darbo pasiūlymą.
          </p>
        </div>

        <div className="jobs-list" aria-label="Kontaktų keliai">
          {contactChannels.map((item) => (
            <a
              className="job-row"
              href={item.href}
              key={item.href}
              aria-label={`${item.title} — ${item.cta}`}
            >
              <div className="job-row-copy">
                <h3>{item.title}</h3>
                <p className="job-row-summary">{item.body}</p>
              </div>
              <span className="job-row-arrow" aria-hidden="true">
                <AvenirButtonArrow />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
