import { AvenirButtonArrow } from "../../app/byq-icons";
import {
  defaultContactChannels,
  sectionItemsOrDefault,
  type CmsChannelItem,
} from "../../lib/cms-items";

/** BYQ: structured-data-2 — contact destination channels */
export function ContactChannels({
  items,
  title,
  description,
}: {
  items?: CmsChannelItem[];
  title?: string;
  description?: string;
}) {
  const channels = sectionItemsOrDefault(items, defaultContactChannels);

  return (
    <section
      data-cms-section="contact-channels"
      className="tt-jobs contacts-channels"
      id="keliai"
      aria-labelledby="contacts-channels-title"
      data-byq-component="structured-data-2-contacts"
    >
      <div className="tt-container jobs-layout">
        <div className="jobs-intro">
          <h2 id="contacts-channels-title" data-cms-field="title">
            {title?.trim() || "Kur kreiptis"}
          </h2>
          <p data-cms-field="description">
            {description?.trim() ||
              "Pasirinkite temą — greičiau rasite adresą, užklausą ar darbo pasiūlymą."}
          </p>
        </div>

        <div className="jobs-list" role="region" aria-label="Kontaktų keliai">
          {channels.map((item, index) => (
            <a
              className="job-row"
              href={item.href}
              key={`${item.href}-${index}`}
              aria-label={`${item.title} — ${item.cta}`}
              data-cms-item={index}
            >
              <div className="job-row-copy">
                <h3 data-cms-item-field="title">{item.title}</h3>
                <p className="job-row-summary" data-cms-item-field="body">{item.body}</p>
                <span className="text-link">
                  <span data-cms-item-field="cta">{item.cta}</span>{" "}
                  <span aria-hidden="true">→</span>
                </span>
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
