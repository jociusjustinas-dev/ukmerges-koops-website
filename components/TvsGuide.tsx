"use client";

import { useEffect, useState } from "react";
import { RollingLabel } from "./RollingLabel";

const ADMIN_URL = "https://orchid-grouse-384861.hostingersite.com/wp-admin/";

const sections = [
  { id: "pirma-diena", title: "Pirma diena" },
  { id: "meniu", title: "Admin meniu" },
  { id: "bendri-duomenys", title: "Bendri duomenys" },
  { id: "sekcijos", title: "Puslapių sekcijos" },
  { id: "naujienos", title: "Naujienos" },
  { id: "parduotuves", title: "Parduotuvės" },
  { id: "karjera", title: "Darbo pasiūlymai" },
  { id: "skelbimai", title: "Skelbimai" },
  { id: "uzklausos", title: "Užklausos" },
  { id: "nuorodos", title: "Nuorodos ir nuotraukos" },
  { id: "nekeisti", title: "Ko nekeisti" },
  { id: "daznos", title: "Dažnos užduotys" },
] as const;

type SectionId = (typeof sections)[number]["id"];

function isSectionId(id: string): id is SectionId {
  return sections.some((section) => section.id === id);
}

export function TvsGuide() {
  const [active, setActive] = useState<SectionId>(sections[0].id);

  useEffect(() => {
    const nodes = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id && isSectionId(visible.target.id)) {
          setActive(visible.target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="guide-page">
      <header className="strategy-nav">
        <a href="/" className="strategy-brand" aria-label="Grįžti į KOOPS svetainę">
          <img src="/koops-logo.png" alt="KOOPS" />
        </a>
        <a className="pill-button dark strategy-back" href="/" aria-label="Grįžti į svetainę">
          <RollingLabel>Į svetainę</RollingLabel>
        </a>
      </header>

      <section className="strategy-hero guide-hero">
        <div className="strategy-orbit strategy-orbit-one" aria-hidden="true" />
        <div className="strategy-orbit strategy-orbit-two" aria-hidden="true" />
        <div className="strategy-wrap strategy-hero-grid">
          <div>
            <p className="strategy-kicker">Vidaus vadovas · noindex</p>
            <h1>Kaip naudotis<br />KOOPS TVS</h1>
          </div>
          <div className="strategy-hero-note">
            <p>Turinį keičiate WordPress administracijoje. Viešą svetainę lankytojai mato atskirai — dizaino čia liesti nereikia.</p>
            <span>WordPress · headless</span>
          </div>
        </div>
      </section>

      <div className="guide-shell strategy-wrap">
        <aside className="guide-aside" aria-label="Turinys">
          <p className="guide-aside-label">Turinys</p>
          <nav>
            <ol className="guide-toc">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={active === section.id ? "is-active" : undefined}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="guide-main">
          <section id="pirma-diena" className="guide-section">
            <h2>Pirma diena</h2>
            <p>
              Turinį redaguojate čia:{" "}
              <a href={ADMIN_URL} rel="noopener noreferrer">
                {ADMIN_URL}
              </a>
              . Įveskite WordPress vartotoją ir slaptažodį.
            </p>
            <div className="guide-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Kur</th>
                    <th>Kam</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>/wp-admin/</code></td>
                    <td>Turinį redaguojate</td>
                  </tr>
                  <tr>
                    <td>Vieša svetainė</td>
                    <td>Kaip mato lankytojas</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>Po kiekvieno pakeitimo spauskite <strong>Atnaujinti</strong> arba <strong>Publikuoti</strong>, tada atidarykite viešą puslapį naujoje kortelėje. Jei nesimato — perkraukite be cache: Mac <code>Cmd+Shift+R</code>, Windows <code>Ctrl+Shift+R</code>.</p>
          </section>

          <section id="meniu" className="guide-section">
            <h2>Admin meniu</h2>
            <div className="guide-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Meniu</th>
                    <th>Kam skirtas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>KOOPS → Bendri duomenys</strong></td>
                    <td>Telefonas, adresas, el. paštas, restorano kontaktai, socialiniai tinklai</td>
                  </tr>
                  <tr>
                    <td><strong>KOOPS → Puslapių sekcijos</strong></td>
                    <td>Puslapių blokų eiliškumas ir matomumas</td>
                  </tr>
                  <tr>
                    <td><strong>Puslapiai</strong></td>
                    <td>Pradinis, Parduotuvės, Restoranas ir kiti puslapiai — sekcijos su screenshotais</td>
                  </tr>
                  <tr>
                    <td><strong>Įrašai</strong></td>
                    <td>Naujienos ir akcijos</td>
                  </tr>
                  <tr>
                    <td><strong>Parduotuvės</strong></td>
                    <td>34 parduotuvių adresai, darbo laikas, telefonas, žemėlapis</td>
                  </tr>
                  <tr>
                    <td><strong>Darbo pasiūlymai</strong></td>
                    <td>Karjeros skelbimai</td>
                  </tr>
                  <tr>
                    <td><strong>Skelbimai</strong></td>
                    <td>Patalpų nuoma ir kiti skelbimai</td>
                  </tr>
                  <tr>
                    <td><strong>KOOPS → Užklausos</strong></td>
                    <td>Laiškai iš formų</td>
                  </tr>
                  <tr>
                    <td><strong>Medija</strong></td>
                    <td>Nuotraukos</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="bendri-duomenys" className="guide-section">
            <h2>Bendri duomenys</h2>
            <p>Kelias: <strong>KOOPS → Bendri duomenys</strong>. Čia įvesta informacija naudojama visoje svetainėje — jos nedubliuokite atskirose sekcijose.</p>
            <ul>
              <li>organizacijos pavadinimas, adresas, telefonai, el. paštas, darbo laikas;</li>
              <li>Facebook ir Instagram;</li>
              <li>formų gavėjas <code>direktore@urvk.lt</code>;</li>
              <li>restorano „Vilkmergė“ telefonai, el. paštas, adresas, salės ir talpa.</li>
            </ul>
            <p><strong>Viešos svetainės adresas</strong> (<code>frontend_url</code>) keičiamas tik tada, kai gyvas domenas prijungtas prie Vercel. Iki tol neliesti.</p>
          </section>

          <section id="sekcijos" className="guide-section">
            <h2>Puslapių sekcijos</h2>
            <p>Kiekvienas viešas puslapis surinktas iš jau sukodintų KOOPS sekcijų. Dizaino čia nesukursite iš naujo — pasirenkate sekciją ir keičiate tekstus, nuorodas ar nuotraukas.</p>
            <ol>
              <li>Atidarykite <strong>Puslapiai</strong> ir reikiamą puslapį, arba eikite per <strong>KOOPS → Puslapių sekcijos</strong>.</li>
              <li>Spauskite <strong>+</strong> → <strong>Blokai</strong> → <strong>KOOPS sekcijos</strong>.</li>
              <li>Pasirinkite sekciją pagal nuotrauką ir pavadinimą, pvz. „Pradinis · Hero“.</li>
              <li>Paspaudę bloką dešinėje rasite laukus: antraštė, aprašymas, mygtukas, nuoroda, nuotrauka ar galerija.</li>
              <li>Jei sekcijos laikinai nereikia — išjunkite „Rodyti svetainėje“, netrinkite viso bloko.</li>
            </ol>
            <p>Drobėje matote tikrą svetainės vaizdą. Spustelėjus sekciją pažymimas atitinkamas blokas. Lauką WordPress laiko pakeitimu tik tada, kai jis skiriasi nuo numatytojo.</p>
          </section>

          <section id="naujienos" className="guide-section">
            <h2>Naujienos</h2>
            <p>Kelias: <strong>Įrašai → Visi įrašai</strong> arba <strong>Pridėti naują</strong>.</p>
            <ul>
              <li>pavadinimas tampa naujienos antrašte;</li>
              <li>tekstą rašykite paprastai — paragrafas, antraštė, sąrašas;</li>
              <li>viršelio nuotrauką kelkite per <strong>Išskirtinis paveikslėlis</strong>;</li>
              <li>paskelbimui spauskite <strong>Publikuoti</strong>.</li>
            </ul>
            <p>Komentarai svetainėje nenaudojami. Naują įrašą kurkite, seną archyvuokite arba ištrinkite, jei jis nebeaktualus.</p>
          </section>

          <section id="parduotuves" className="guide-section">
            <h2>Parduotuvės</h2>
            <p>Kelias: <strong>Parduotuvės</strong>. Visi laukai yra Gutenberg <strong>Dokumentas</strong> skydelyje dešinėje: nuotrauka, teritorija ir kontaktai.</p>
            <div className="guide-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Laukas</th>
                    <th>Ką vesti</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Pavadinimas</td>
                    <td>Parduotuvės vardas, pvz. „Pušelė“</td>
                  </tr>
                  <tr>
                    <td>Teritorija</td>
                    <td>Miestas arba rajonas</td>
                  </tr>
                  <tr>
                    <td>Vietovė, adresas, telefonas</td>
                    <td>Kaip turi matyti lankytojas</td>
                  </tr>
                  <tr>
                    <td>Darbo laikas</td>
                    <td>Trumpai, su tarpais, pvz. I–V 8:00–20:00</td>
                  </tr>
                  <tr>
                    <td>Google Maps nuoroda</td>
                    <td>Pieštuku atidarykite nuorodų langą ir įklijuokite Maps adresą</td>
                  </tr>
                  <tr>
                    <td>Rodyti karuselėje</td>
                    <td>Jei parduotuvė turi būti pradiniame puslapyje</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>Platuma ir ilguma reikalingos žemėlapiui. Jei keičiate adresą — atnaujinkite ir Maps nuorodą.</p>
          </section>

          <section id="karjera" className="guide-section">
            <h2>Darbo pasiūlymai</h2>
            <p>Kelias: <strong>Darbo pasiūlymai → Pridėti naują</strong>.</p>
            <ul>
              <li>pavadinimas — darbo pozicija;</li>
              <li>aprašyme — ką veiks žmogus ir ko tikimasi;</li>
              <li>dešinėje: darbo vieta, krūvis, sritis, kandidatavimo nuoroda, data „kandidatuoti iki“.</li>
            </ul>
            <p>Jei skelbimas nebegalioja — išjunkite publikavimą arba ištrinkite. Tuščias sąrašas svetainėje atrodo tvarkingiau nei pasenę skelbimai.</p>
          </section>

          <section id="skelbimai" className="guide-section">
            <h2>Skelbimai</h2>
            <p>Kelias: <strong>Skelbimai</strong>. Tinka patalpų nuomai ir kitiems trumpalaikiams pranešimams.</p>
            <ul>
              <li>vieta, plotas, kaina;</li>
              <li>būsena: aktyvus arba rezervuotas;</li>
              <li>galioja iki;</li>
              <li>kontaktinis telefonas ir el. paštas.</li>
            </ul>
          </section>

          <section id="uzklausos" className="guide-section">
            <h2>Užklausos</h2>
            <p>Kelias: <strong>KOOPS → Užklausos</strong>. Čia krenta visos svetainės formos.</p>
            <div className="guide-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Forma</th>
                    <th>Laiškas eina į</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Restoranas</td>
                    <td><code>restoranas@urvk.lt</code></td>
                  </tr>
                  <tr>
                    <td>Kontaktai, tiekėjai, karjera</td>
                    <td><code>direktore@urvk.lt</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>Atsakant naudokite lankytojo el. paštą — jis jau yra laiško Reply-To. Pašto siuntimą jungia FluentSMTP; kol jis neprijungtas, užklausa vis tiek išsisaugo šiame sąraše.</p>
          </section>

          <section id="nuorodos" className="guide-section">
            <h2>Nuorodos ir nuotraukos</h2>
            <p>Nuorodų lauke spauskite pieštuką — atsidaro WordPress nuorodų langas. Galite ieškoti puslapio, įrašo, parduotuvės ar įrašyti adresą ranka, pvz. <code>/parduotuves</code> ar <code>/restoranas#uzklausa</code>.</p>
            <p>Nuotrauką keiskite per tą patį sekcijos skydelį arba <strong>Medija</strong>. Galerijose naudokite WordPress galerijos langą. Kelkite tik tas nuotraukas, kurios padeda suprasti pasiūlymą.</p>
          </section>

          <section id="nekeisti" className="guide-section">
            <h2>Ko nekeisti</h2>
            <ul>
              <li>puslapių adresų (slug), jei nuorodos jau veikia: <code>/parduotuves</code>, <code>/restoranas</code>, <code>/apie</code>;</li>
              <li><strong>Viešos svetainės adreso</strong>, kol domenas <code>ukmergeskoops.lt</code> neprijungtas prie Vercel;</li>
              <li>spalvų, šriftų ir mygtukų — jie valdomi svetainės kode, ne WordPress;</li>
              <li>paragrafų ir atsitiktinių Gutenberg blokų puslapiuose — naudokite tik KOOPS sekcijas;</li>
              <li><strong>Pradinis paruošimas</strong> — kartoti galima, bet tai skirta importui, ne kasdieniam redagavimui.</li>
            </ul>
          </section>

          <section id="daznos" className="guide-section">
            <h2>Dažnos užduotys</h2>
            <div className="guide-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Noriu</th>
                    <th>Kur eiti</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Pakeisti telefoną visoje svetainėje</td>
                    <td>KOOPS → Bendri duomenys</td>
                  </tr>
                  <tr>
                    <td>Pakeisti pradinio puslapio antraštę</td>
                    <td>Puslapiai → Pradinis → hero sekcija</td>
                  </tr>
                  <tr>
                    <td>Paskelbti akciją</td>
                    <td>Įrašai → Pridėti naują</td>
                  </tr>
                  <tr>
                    <td>Pataisyti parduotuvės darbo laiką</td>
                    <td>Parduotuvės → pasirinkti įrašą → Dokumentas</td>
                  </tr>
                  <tr>
                    <td>Įdėti darbo skelbimą</td>
                    <td>Darbo pasiūlymai → Pridėti naują</td>
                  </tr>
                  <tr>
                    <td>Pažiūrėti, kas rašė per formą</td>
                    <td>KOOPS → Užklausos</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
