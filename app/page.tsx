"use client";

import * as React from "react";

const quickLinks = [
  { number: "01", title: "Parduotuvės", text: "Adresai, darbo laikas ir kelio nuorodos.", href: "#parduotuves" },
  { number: "02", title: "Restoranas „Vilkmergė“", text: "Šventėms, renginiams ir susitikimams.", href: "#restoranas" },
  { number: "03", title: "Darbo pasiūlymai", text: "Galimybės Ukmergėje ir rajone.", href: "#karjera" },
  { number: "04", title: "Tapkite tiekėju", text: "Pasiūlykite savo produkciją KOOPS.", href: "#tiekejams" },
];

const stores = [
  {
    name: "Papartis",
    address: "Vasario 16-osios g. 30, Ukmergė",
    hours: "I–VI 7:00–20:00 · VII 7:00–16:00",
    phone: "0 340 53562",
    phoneHref: "+37034053562",
    image: "/store-papartis.jpeg",
    map: "https://maps.app.goo.gl/igZB8hHG6RGBJqfZ8",
  },
  {
    name: "Šermukšnėlė",
    address: "A. Smetonos g. 43, Ukmergė",
    hours: "Kasdien 8:00–20:00",
    phone: "0 340 51447",
    phoneHref: "+37034051447",
    image: "/store-sermuksne.jpeg",
    map: "https://maps.app.goo.gl/tcv1vqRoE8HBueLp6",
  },
  {
    name: "Uosis",
    address: "Putinų g. 40, Ukmergė",
    hours: "Kasdien 8:00–20:00",
    phone: "0 340 64551",
    phoneHref: "+37034064551",
    image: "/store-uosis.jpeg",
    map: "https://www.google.com/maps/search/?api=1&query=Putinų+g.+40+Ukmergė",
  },
];

const jobs = [
  { number: "01", type: "PARDUOTUVĖSE", title: "Pardavėjas (-a)", location: "Ukmergė ir rajonas" },
  { number: "02", type: "RESTORANE", title: "Virėjas (-a)", location: "Restoranas „Vilkmergė“" },
  { number: "03", type: "LOGISTIKOJE", title: "Vairuotojas–sandėlininkas (-ė)", location: "Ukmergė" },
];

function Arrow() {
  return <span aria-hidden="true">›</span>;
}

function RollingLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="rolling-label" aria-hidden="true">
      <span>{children}<Arrow /></span>
      <span>{children}<Arrow /></span>
    </span>
  );
}

export default function Home() {
  const [heroVisible, setHeroVisible] = React.useState(false);
  const [jobSlide, setJobSlide] = React.useState(0);

  React.useEffect(() => setHeroVisible(true), []);

  return (
    <>
      <a className="skip-link" href="#turinys">Pereiti prie turinio</a>

      <header className="floating-nav" data-byq-adaptation="terra-tory-design-system-navigation">
        <div className="nav-shell">
          <a className="brand" href="#pradzia" aria-label="KOOPS – į pradžią">
            <img src="/koops-logo.jpg" alt="KOOPS prekybos sistema" />
          </a>
          <nav className="desktop-nav" aria-label="Pagrindinė navigacija">
            <a href="#parduotuves">Parduotuvės</a>
            <a href="#naujienos">Naujienos</a>
            <a href="#restoranas">Restoranas</a>
            <a href="#karjera">Karjera</a>
            <a href="#apie">Apie mus</a>
          </nav>
          <a className="pill-button dark nav-cta" href="#parduotuves" aria-label="Rasti parduotuvę">
            <RollingLabel>Rasti parduotuvę</RollingLabel>
          </a>
          <details className="mobile-menu">
            <summary>Meniu <span aria-hidden="true">＋</span></summary>
            <nav aria-label="Mobilioji navigacija">
              <a href="#parduotuves">Parduotuvės</a>
              <a href="#naujienos">Naujienos ir akcijos</a>
              <a href="#restoranas">Restoranas</a>
              <a href="#karjera">Karjera</a>
              <a href="#apie">Apie KOOPS</a>
              <a href="#tiekejams">Tiekėjams</a>
            </nav>
          </details>
        </div>
      </header>

      <main id="turinys">
        {/* BYQ: terra-tory-hero-2 */}
        <section className="tt-hero" id="pradzia" data-byq-component="terra-tory-hero-2">
          <div className="tt-hero-grid">
            <div className="tt-hero-media">
              <img src="/koops-hero.jpg" alt="KOOPS parduotuvė Ukmergės rajone" />
            </div>
            <div className="tt-hero-panel">
              <div className="tt-hero-content">
                <div className="tt-hero-top">
                  <p className="section-label">UKMERGĖJE IR RAJONE</p>
                  <h1>Raskite artimiausią KOOPS parduotuvę</h1>
                  <p className="body-large">Adresai, darbo laikas, telefonai ir kelio nuorodos – vienoje vietoje.</p>
                  <a className="pill-button accent" href="#parduotuves" aria-label="Rasti artimiausią parduotuvę">
                    <RollingLabel>Rasti parduotuvę</RollingLabel>
                  </a>
                </div>
                <div className={`hero-badge ${heroVisible ? "is-visible" : ""}`}>
                  <span className="badge-dot" aria-hidden="true">●</span>
                  <span>Arti miesto ir rajono žmonių kasdien</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BYQ: terra-tory-tiles-2 */}
        <section className="tt-features" aria-labelledby="greitos-nuorodos" data-byq-component="terra-tory-tiles-2">
          <div className="tt-container">
            <div className="dashed-divider" />
            <div className="tt-features-layout">
              <div className="tt-features-intro">
                <p className="section-label">GREITOS NUORODOS</p>
                <h2 id="greitos-nuorodos">Ko ieškote šiandien?</h2>
              </div>
              <div className="tt-feature-grid">
                {quickLinks.map((item) => (
                  <a className="tt-feature-card" href={item.href} key={item.title}>
                    <span className="feature-number">{item.number}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                    <span className="feature-arrow" aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BYQ: terra-tory-team-1 adapted to location cards */}
        <section className="tt-locations" id="parduotuves" aria-labelledby="parduotuviu-antraste" data-byq-component="terra-tory-team-1">
          <div className="tt-container">
            <div className="location-headline" id="parduotuviu-antraste">
              <span>Raskite</span><span>artimiausią</span><i aria-hidden="true" /><span>KOOPS</span><span>parduotuvę</span>
            </div>
            <div className="location-grid">
              {stores.map((store) => (
                <article className="location-card" key={store.name}>
                  <a className="location-image" href={store.map} target="_blank" rel="noreferrer" aria-label={`Parduotuvė „${store.name}“ – atverti žemėlapyje`}>
                    <img src={store.image} alt={`Parduotuvė „${store.name}“`} />
                  </a>
                  <div className="location-info">
                    <div><h3>{store.name}</h3><p>{store.address}</p></div>
                    <dl>
                      <div><dt>Darbo laikas</dt><dd>{store.hours}</dd></div>
                      <div><dt>Telefonas</dt><dd><a href={`tel:${store.phoneHref}`}>{store.phone}</a></dd></div>
                    </dl>
                    <a className="light-link" href={store.map} target="_blank" rel="noreferrer">Rodyti žemėlapyje <Arrow /></a>
                  </div>
                </article>
              ))}
            </div>
            <a className="pill-button light section-cta" href="https://ukmergeskoops.lt/parduotuves/" aria-label="Peržiūrėti visas parduotuves">
              <RollingLabel>Visos parduotuvės</RollingLabel>
            </a>
          </div>
        </section>

        {/* BYQ: terra-tory-blog-grid-1 */}
        <section className="tt-news" id="naujienos" aria-labelledby="naujienu-antraste" data-byq-component="terra-tory-blog-grid-1">
          <div className="tt-container">
            <div className="tt-section-header">
              <div className="dashed-divider" />
              <p className="section-label">AKTUALU</p>
              <h2 id="naujienu-antraste">Naujienos ir akcijos</h2>
            </div>
            <div className="news-bento">
              <a className="news-card news-card-large" href="https://ukmergeskoops.lt/naujienos/">
                <img src="/koops-community.jpg" alt="Vietos gamintojų produktai" />
                <div><span className="section-label light-label">NAUJIENOS</span><h3>Vietos skoniai – arčiau jūsų</h3><span className="pill-button light"><RollingLabel>Skaityti</RollingLabel></span></div>
              </a>
              <a className="news-card news-card-accent" href="https://ukmergeskoops.lt/naujienos/"><h3>Naujausi pasiūlymai kasdieniam krepšeliui</h3><span className="pill-button light"><RollingLabel>Peržiūrėti</RollingLabel></span></a>
              <a className="news-card news-card-muted" href="https://ukmergeskoops.lt/naujienos/"><h3>Kas naujo KOOPS parduotuvėse?</h3><span className="pill-button light"><RollingLabel>Sužinoti</RollingLabel></span></a>
              <a className="news-card news-card-wide" href="https://ukmergeskoops.lt/naujienos/"><h3>Naujienos iš Ukmergės krašto</h3><span className="pill-button light"><RollingLabel>Skaityti</RollingLabel></span></a>
            </div>
          </div>
        </section>

        {/* BYQ: terra-tory-combo-6 */}
        <section className="tt-story" id="restoranas" aria-labelledby="restorano-antraste" data-byq-component="terra-tory-combo-6">
          <div className="tt-container">
            <div className="story-headline">
              <p className="section-label light-label">RESTORANAS „VILKMERGĖ“ · NUO 1965 METŲ</p>
              <h2 id="restorano-antraste">Vieta jūsų šventėms, renginiams ir jaukiems susitikimams.</h2>
            </div>
            <div className="story-grid">
              <div className="story-image"><img src="/vilkmerge.jpg" alt="Restorano „Vilkmergė“ lauko erdvė" /></div>
              <div className="story-copy">
                <p>Pačiame Ukmergės centre įsikūręs restoranas tinka jubiliejams, vestuvėms, krikštynoms, oficialiems renginiams ir vakarienėms.</p>
                <dl><div><dt>Pokylių salės</dt><dd>3 salės</dd></div><div><dt>Talpa</dt><dd>Iki 154 svečių</dd></div></dl>
                <a className="pill-button accent" href="https://ukmergeskoops.lt/restoranas-vilkmerge/" aria-label="Sužinoti apie restoraną Vilkmergė"><RollingLabel>Apie restoraną</RollingLabel></a>
                <a className="light-link" href="tel:+37034053235">Skambinti 0 340 53235</a>
              </div>
            </div>
          </div>
        </section>

        {/* BYQ: terra-tory-tiles-1 adapted to job listings */}
        <section className="tt-jobs" id="karjera" aria-labelledby="karjeros-antraste" data-byq-component="terra-tory-tiles-1">
          <div className="orbit orbit-large" aria-hidden="true" />
          <div className="orbit orbit-small" aria-hidden="true" />
          <div className="tt-container jobs-inner">
            <div className="jobs-header">
              <div><p className="section-label light-label">KARJERA</p><h2 id="karjeros-antraste">Darbas arti namų</h2></div>
              <div className="slider-controls">
                <button type="button" onClick={() => setJobSlide((s) => Math.max(0, s - 1))} disabled={jobSlide === 0} aria-label="Ankstesnis darbo pasiūlymas">‹</button>
                <button type="button" onClick={() => setJobSlide((s) => Math.min(jobs.length - 1, s + 1))} disabled={jobSlide === jobs.length - 1} aria-label="Kitas darbo pasiūlymas">›</button>
              </div>
            </div>
            <div className="jobs-mask">
              <div className="jobs-track" style={{ "--slide": jobSlide } as React.CSSProperties}>
                {jobs.map((job) => (
                  <a className="job-card" href="https://ukmergeskoops.lt/skelbimai/" key={job.title}>
                    <div><span className="job-number">{job.number}</span><p className="section-label light-label">{job.type}</p><h3>{job.title}</h3></div>
                    <div><p>{job.location}</p><span className="light-link">Plačiau <Arrow /></span></div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BYQ: terra-tory-combo-4 */}
        <section className="tt-about" id="apie" aria-labelledby="apie-antraste" data-byq-component="terra-tory-combo-4">
          <div className="tt-container">
            <h2 className="about-statement" id="apie-antraste">Vietos žmonėms. Vietos verslui.</h2>
            <div className="about-split">
              <div className="about-panel">
                <div><p className="section-label">APIE KOOPS</p><h3>Kasdien šalia Ukmergės krašto žmonių</h3><p className="body-large">Ukmergės rajono vartotojų kooperatyvas vienija prekybos ir maitinimo veiklas mieste bei rajone.</p></div>
                <ul>
                  <li><span>01</span>Parduotuvės mieste ir rajone</li>
                  <li><span>02</span>Restoranas renginiams</li>
                  <li><span>03</span>Darbo vietos vietos žmonėms</li>
                  <li><span>04</span>Galimybės vietos tiekėjams</li>
                </ul>
              </div>
              <div className="about-image"><img src="/koops-hero.jpg" alt="KOOPS parduotuvė Ukmergės rajone" /></div>
            </div>
          </div>
        </section>

        {/* BYQ: terra-tory-contact-1 */}
        <section className="tt-contact" id="tiekejams" aria-labelledby="tiekeju-antraste" data-byq-component="terra-tory-contact-1">
          <div className="tt-container contact-grid">
            <div className="contact-content">
              <div className="contact-heading"><p className="section-label">TIEKĖJAMS</p><h2 id="tiekeju-antraste">Auginkime vietos pasiūlą kartu</h2><p>Ieškome patikimų gamintojų ir tiekėjų, norinčių pasiūlyti savo produkciją KOOPS pirkėjams.</p></div>
              <div className="contact-details">
                <div><strong>Adresas</strong><p>Vasario 16-osios g. 30<br />LT-20130 Ukmergė</p></div>
                <div><strong>El. paštas</strong><p><a href="mailto:direktore@urvk.lt">direktore@urvk.lt</a></p></div>
              </div>
              <form className="supplier-form" action="mailto:direktore@urvk.lt" method="post" encType="text/plain">
                <div className="form-halves">
                  <label><span>JŪSŲ VARDAS</span><input name="vardas" type="text" autoComplete="name" required /></label>
                  <label><span>EL. PAŠTAS</span><input name="el_pastas" type="email" autoComplete="email" required /></label>
                </div>
                <label><span>PASIŪLYMAS</span><textarea name="pasiulymas" rows={5} required /></label>
                <button className="pill-button dark" type="submit"><span>Siųsti pasiūlymą <Arrow /></span></button>
                <p className="form-note">Paspaudus bus atverta jūsų el. pašto programa.</p>
              </form>
            </div>
            <div className="contact-image"><img src="/koops-community.jpg" alt="Vietos gamintojų produkcija" /></div>
          </div>
        </section>
      </main>

      {/* BYQ: terra-tory-footer-1 */}
      <footer className="tt-footer" data-byq-component="terra-tory-footer-1">
        <section className="footer-cta" aria-labelledby="footer-cta-title">
          <div className="orbit footer-orbit-one" aria-hidden="true" /><div className="orbit footer-orbit-two" aria-hidden="true" />
          <p className="section-label light-label">KOOPS</p>
          <h2 id="footer-cta-title">Parduotuvė gali būti arčiau, nei manote</h2>
          <a className="pill-button accent" href="#parduotuves" aria-label="Rasti KOOPS parduotuvę"><RollingLabel>Rasti parduotuvę</RollingLabel></a>
        </section>
        <div className="tt-container footer-content">
          <div className="footer-grid">
            <div className="footer-brand"><img src="/koops-logo.jpg" alt="KOOPS prekybos sistema" /><p>Arti miesto ir rajono žmonių kasdien.</p></div>
            <nav aria-label="Poraštės navigacija">
              <div><p className="section-label">PAGRINDINIAI</p><a href="#parduotuves">Parduotuvės</a><a href="#naujienos">Naujienos</a><a href="#restoranas">Restoranas</a><a href="#karjera">Karjera</a></div>
              <div><p className="section-label">KOOPERATYVAS</p><a href="#apie">Apie KOOPS</a><a href="#tiekejams">Tiekėjams</a><a href="https://ukmergeskoops.lt/kontaktai/">Kontaktai</a></div>
              <div><p className="section-label">KONTAKTAI</p><a href="tel:+37034053235">0 340 53235</a><a href="mailto:direktore@urvk.lt">direktore@urvk.lt</a><a href="https://ukmergeskoops.lt/privatumo-politika/">Privatumo politika</a></div>
            </nav>
          </div>
          <div className="footer-bottom"><p>© {new Date().getFullYear()} Ukmergės rajono vartotojų kooperatyvas</p><a href="#pradzia">Į puslapio viršų ↑</a></div>
        </div>
      </footer>
    </>
  );
}
