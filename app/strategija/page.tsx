import type { Metadata } from "next";
import { RollingLabel } from "../../components/RollingLabel";

export const metadata: Metadata = {
  title: "KOOPS | Svetainės atnaujinimo strategija",
  description: "Ukmergės rajono vartotojų kooperatyvo svetainės atnaujinimo strategija.",
};

const goals = [
  { number: "01", title: "Rasti parduotuvę", text: "Aiškiai parodyti artimiausią vietą, darbo laiką ir maršrutą." },
  { number: "02", title: "Paversti susidomėjimą veiksmu", text: "Sutrumpinti kelią iki restorano užklausos, kontakto ar kandidatavimo." },
  { number: "03", title: "Auginti tiekėjų užklausas", text: "Sukurti patikimą, paprastą kelią vietos gamintojams pasiūlyti produkciją." },
  { number: "04", title: "Stiprinti KOOPS vardą", text: "Parodyti kooperatyvą kaip artimą, aktualų ir gyvą Ukmergės krašto partnerį." },
];

const audiences = [
  { label: "PIRKĖJAS", title: "Nori greitai rasti", text: "Adresą, darbo laiką, kelią ir aktualias naujienas." },
  { label: "KLIENTAS", title: "Ieško vietos renginiui", text: "Restorano „Vilkmergė“ informacijos, salių ir tiesioginio kontakto." },
  { label: "KANDIDATAS", title: "Vertina aiškumą", text: "Aktualias darbo vietas, vietą ir paprastą kandidatavimo veiksmą." },
  { label: "TIEKĖJAS", title: "Nori pasiūlyti produkciją", text: "Ką pateikti, kam rašyti ir ko tikėtis toliau." },
];

export default function StrategyPage() {
  return (
    <main className="strategy-page">
      <header className="strategy-nav">
        <a href="/" className="strategy-brand" aria-label="Grįžti į KOOPS koncepciją">
          <img src="/koops-logo.png" alt="KOOPS prekybos sistema" />
        </a>
        <a className="pill-button dark strategy-back" href="/" aria-label="Grįžti į KOOPS koncepciją">
          <RollingLabel>Į koncepciją</RollingLabel>
        </a>
      </header>

      <section className="strategy-hero">
        <div className="strategy-orbit strategy-orbit-one" aria-hidden="true" />
        <div className="strategy-orbit strategy-orbit-two" aria-hidden="true" />
        <div className="strategy-wrap strategy-hero-grid">
          <div>
            <p className="strategy-kicker">UKMERGĖS RAJONO VARTOTOJŲ KOOPERATYVAS</p>
            <h1>KOOPS svetainės<br />atnaujinimo strategija</h1>
          </div>
          <div className="strategy-hero-note">
            <p>Atnaujinta svetainė turi tapti ne informacijos sandėliu, o kasdieniu keliu į artimiausią parduotuvę, restoraną, darbą ir partnerystę.</p>
            <span>2026 · Koncepcijos etapas</span>
          </div>
        </div>
      </section>

      <section className="strategy-section strategy-intro">
        <div className="strategy-wrap">
          <p className="strategy-kicker dark">STRATEGINĖ KRYPTIS</p>
          <div className="strategy-intro-grid">
            <h2>Vienas aiškus principas:<br />lankytojas turi rasti atsakymą<br />greičiau nei spėja suabejoti.</h2>
            <p>Prioritetas nėra „daugiau turinio“. Prioritetas — trumpesnis kelias iki konkretaus veiksmo.</p>
          </div>
        </div>
      </section>

      <section className="strategy-section strategy-goals">
        <div className="strategy-wrap">
          <div className="strategy-heading-row"><p className="strategy-kicker">VERSLO TIKSLAI</p><span>4 prioritetai</span></div>
          <div className="strategy-goal-grid">
            {goals.map((goal, index) => (
              <article className={`strategy-goal strategy-goal-${index + 1}`} key={goal.number}>
                <span>{goal.number}</span>
                <h3>{goal.title}</h3>
                <p>{goal.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="strategy-section strategy-audiences">
        <div className="strategy-wrap">
          <div className="strategy-heading-row"><p className="strategy-kicker">AUDITORIJOS</p><span>4 pagrindiniai scenarijai</span></div>
          <div className="strategy-audience-grid">
            {audiences.map((audience) => (
              <article className="strategy-audience" key={audience.label}>
                <p className="strategy-kicker dark">{audience.label}</p>
                <h3>{audience.title}</h3>
                <p>{audience.text}</p>
                <span aria-hidden="true">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="strategy-section strategy-flow-section">
        <div className="strategy-wrap">
          <p className="strategy-kicker">VARTOTOJO KELIAS</p>
          <h2>Mažiau pasirinkimų.<br />Daugiau užbaigtų veiksmų.</h2>
          <div className="strategy-flow">
            <article><span>01</span><h3>Atrasti</h3><p>Hero ir navigacija iš karto iškelia parduotuves, restoraną, karjerą bei tiekėjus.</p></article>
            <article><span>02</span><h3>Įvertinti</h3><p>Puslapiai pateikia tik sprendimui reikalingą informaciją: vietą, laiką, talpą, sąlygas.</p></article>
            <article><span>03</span><h3>Veikti</h3><p>Aiškūs CTA veda į maršrutą, skambutį, užklausą ar kandidato kontaktą.</p></article>
          </div>
        </div>
      </section>

      <section className="strategy-section strategy-content">
        <div className="strategy-wrap strategy-content-grid">
          <div>
            <p className="strategy-kicker dark">SEO + AEO + TURINYS</p>
            <h2>Turinys turi būti naudingas ir žmogui, ir paieškai.</h2>
          </div>
          <div className="strategy-checks">
            <p><b>SEO</b> — atskiri, indeksuojami puslapiai parduotuvėms, restoranui, karjerai ir tiekėjams.</p>
            <p><b>AEO</b> — konkretūs atsakymai į klausimus: kur, kada, kam ir kaip susisiekti.</p>
            <p><b>Schema</b> — LocalBusiness, Restaurant, JobPosting, FAQ ir Organization duomenys.</p>
            <p><b>Accessibility</b> — semantinė antraščių logika, ryškūs focus states, kontrastas ir klaviatūros navigacija.</p>
          </div>
        </div>
      </section>

      <section className="strategy-section strategy-architecture">
        <div className="strategy-wrap">
          <div className="strategy-heading-row"><p className="strategy-kicker dark">INFORMACINĖ ARCHITEKTŪRA</p><span>5 pagrindiniai keliai</span></div>
          <div className="strategy-architecture-intro">
            <h2>Vienas pagrindinis puslapis.<br />Aiški struktūra po juo.</h2>
            <p>Navigacija turi atspindėti realius lankytojo tikslus, o ne vidinę organizacijos struktūrą.</p>
          </div>
          <div className="strategy-sitemap">
            <article className="strategy-sitemap-home"><span>01</span><h3>Pradinis puslapis</h3><p>Orientuoja, kas yra KOOPS ir kur eiti toliau.</p></article>
            <article><span>02</span><h3>Parduotuvės</h3><p>Adresai · darbo laikas · maršrutas</p></article>
            <article><span>03</span><h3>Naujienos</h3><p>Akcijos · vietos skoniai · krašto istorijos</p></article>
            <article><span>04</span><h3>Restoranas</h3><p>Salės · talpa · užklausa · skambutis</p></article>
            <article><span>05</span><h3>Karjera</h3><p>Darbo pasiūlymai · kandidatavimas</p></article>
            <article><span>06</span><h3>Tiekėjams</h3><p>Pasiūlymo forma · kontaktas · privatumas</p></article>
            <article><span>07</span><h3>Apie KOOPS</h3><p>Žmonės · vieta · kooperatyvo istorija</p></article>
          </div>
        </div>
      </section>

      <footer className="strategy-footer">
        <div className="strategy-wrap">
          <p className="strategy-kicker">KITAS ŽINGSNIS</p>
          <h2>Patvirtinti strateginę kryptį ir pereiti prie turinio bei puslapių struktūros.</h2>
          <a href="/" className="pill-button accent strategy-footer-cta" aria-label="Atidaryti pradinio puslapio koncepciją">
            <RollingLabel>Atidaryti koncepciją</RollingLabel>
          </a>
        </div>
      </footer>
    </main>
  );
}
