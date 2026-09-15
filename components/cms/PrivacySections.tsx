import type { CmsProcessItem } from "../../lib/cms-items";
import { sectionItemsOrDefault } from "../../lib/cms-items";

const defaultPrivacySections: CmsProcessItem[] = [
  {
    step: "01",
    title: "Kas valdo duomenis",
    body: "Ukmergės rajono vartotojų kooperatyvas, Vasario 16-osios g. 30, LT-20130 Ukmergė. Klausimus galite siųsti adresu direktore@urvk.lt.",
  },
  {
    step: "02",
    title: "Kokius slapukus naudojame",
    body: "Būtinieji slapukai reikalingi svetainės veikimui ir jūsų pasirinkimui įsiminti. Statistikos bei rinkodaros priemonės gali veikti tik gavus atskirą sutikimą.",
  },
  {
    step: "03",
    title: "Šiuo metu saugomas pasirinkimas",
    body: "Šiuo metu nėra įjungtų statistikos ar rinkodaros sekimo priemonių.",
  },
  {
    step: "04",
    title: "Kaip pakeisti pasirinkimą",
    body: "Poraštėje pasirinkite „Slapukų nustatymai“. Sutikimą atšaukti yra taip pat paprasta, kaip jį duoti.",
  },
];

function linkifyEmail(text: string) {
  const match = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (!match) return text;
  const [email] = match;
  const [before, after] = text.split(email);
  return (
    <>
      {before}
      <a href={`mailto:${email}`}>{email}</a>
      {after}
    </>
  );
}

export function PrivacyHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  return (
    <section
      className="privacy-hero"
      aria-labelledby="privacy-title"
      data-cms-section="privacy-hero"
      id="privatumas"
    >
      <div className="tt-container privacy-hero-inner">
        <p className="section-label light-label" data-cms-field="eyebrow">
          {eyebrow?.trim() || "PRIVATUMAS"}
        </p>
        <h1 id="privacy-title" data-cms-field="title" style={{ whiteSpace: "pre-line" }}>
          {title?.trim() || "Jūsų pasirinkimas.\nAiškiai ir paprastai."}
        </h1>
        <p data-cms-field="description">
          {description?.trim() ||
            "Čia paaiškiname, kokias technologijas naudojame svetainėje ir kaip galite valdyti savo sutikimą."}
        </p>
      </div>
    </section>
  );
}

export function PrivacyBody({
  eyebrow,
  description,
  items,
}: {
  eyebrow?: string;
  description?: string;
  items?: CmsProcessItem[];
}) {
  const sections = sectionItemsOrDefault(items, defaultPrivacySections);

  return (
    <section
      className="privacy-content"
      aria-label="Privatumo ir slapukų informacija"
      data-cms-section="privacy-body"
      id="privatumo-turinys"
    >
      <div className="tt-container privacy-layout">
        <aside className="privacy-summary">
          <p className="section-label" data-cms-field="eyebrow">
            {eyebrow?.trim() || "TRUMPAI"}
          </p>
          <p data-cms-field="description">
            {description?.trim() ||
              "Nebūtinieji slapukai neįjungiami, kol nepasirenkate jų leisti. Sutikimą bet kada galima pakeisti poraštėje."}
          </p>
        </aside>
        <div className="privacy-sections">
          {sections.map((item, index) => (
            <article key={`${item.step}-${index}`} data-cms-item={index}>
              <span data-cms-item-field="step">{item.step}</span>
              <div>
                <h2 data-cms-item-field="title">{item.title}</h2>
                {index === 2 ? (
                  <>
                    <div className="cookie-table-wrap">
                      <table className="cookie-table">
                        <thead>
                          <tr>
                            <th>Pavadinimas</th>
                            <th>Paskirtis</th>
                            <th>Trukmė</th>
                            <th>Kategorija</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>koops_consent</td>
                            <td>Išsaugo jūsų slapukų pasirinkimą.</td>
                            <td>6 mėnesiai</td>
                            <td>Būtinasis</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="privacy-note" data-cms-item-field="body">
                      {item.body}
                    </p>
                  </>
                ) : (
                  <p data-cms-item-field="body">{linkifyEmail(item.body)}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
