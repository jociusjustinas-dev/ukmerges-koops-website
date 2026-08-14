const Arrow = () => <span aria-hidden="true">↗</span>;

const quickLinks = [
  { number: "01", title: "Parduotuvės", text: "Adresai, darbo laikas ir kelio nuorodos.", href: "#parduotuves" },
  { number: "02", title: "Restoranas „Vilkmergė“", text: "Šventėms, renginiams ir jaukiems susitikimams.", href: "#restoranas" },
  { number: "03", title: "Darbo pasiūlymai", text: "Prisijunkite prie KOOPS komandos Ukmergės krašte.", href: "#karjera" },
  { number: "04", title: "Tapkite tiekėju", text: "Pasiūlykite vietos žmonėms savo produkciją.", href: "#tiekejams" },
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
  { type: "PARDUOTUVĖSE", title: "Pardavėjas (-a)", location: "Ukmergė ir rajonas" },
  { type: "RESTORANE", title: "Virėjas (-a)", location: "Restoranas „Vilkmergė“" },
  { type: "LOGISTIKOJE", title: "Vairuotojas–sandėlininkas (-ė)", location: "Ukmergė" },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#turinys">Pereiti prie turinio</a>

      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#pradzia" aria-label="KOOPS – į pradžią">
            <img src="/koops-logo.jpg" alt="KOOPS prekybos sistema" />
          </a>

          <nav className="desktop-nav" aria-label="Pagrindinė navigacija">
            <a href="#parduotuves">Parduotuvės</a>
            <a href="#naujienos">Naujienos ir akcijos</a>
            <a href="#restoranas">Restoranas</a>
            <a href="#karjera">Karjera</a>
            <a href="#apie">Apie KOOPS</a>
          </nav>

          <a className="button button-small header-cta" href="#parduotuves">
            Rasti parduotuvę <Arrow />
          </a>

          <details className="mobile-menu">
            <summary aria-label="Atverti meniu">Meniu <span aria-hidden="true">＋</span></summary>
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
        <section className="hero section-shell" id="pradzia">
          <div className="hero-media">
            <img src="/koops-hero.jpg" alt="KOOPS parduotuvė Ukmergės rajone" />
            <div className="hero-media-tag"><span aria-hidden="true">●</span> Arti kasdien</div>
          </div>

          <div className="hero-copy">
            <p className="eyebrow">Ukmergėje ir rajone</p>
            <h1>Raskite artimiausią <em>KOOPS</em> parduotuvę</h1>
            <p className="lead">Vienoje vietoje raskite parduotuvių adresus, darbo laiką, telefonus ir patogias kelio nuorodas.</p>
            <div className="hero-actions">
              <a className="button" href="#parduotuves">Rasti parduotuvę <Arrow /></a>
              <a className="text-link" href="#naujienos">Naujienos ir akcijos <span aria-hidden="true">↓</span></a>
            </div>
            <dl className="hero-facts" aria-label="KOOPS privalumai">
              <div><dt>Vieta</dt><dd>Ukmergė ir rajonas</dd></div>
              <div><dt>Informacija</dt><dd>Adresai ir darbo laikas</dd></div>
            </dl>
          </div>
        </section>

        <section className="quick-section section-shell" aria-labelledby="greitos-nuorodos">
          <div className="section-heading compact">
            <p className="eyebrow">Greitos nuorodos</p>
            <h2 id="greitos-nuorodos">Ko ieškote šiandien?</h2>
          </div>
          <div className="quick-grid">
            {quickLinks.map((item) => (
              <a className="quick-card" href={item.href} key={item.title}>
                <span className="card-number">{item.number}</span>
                <div><h3>{item.title}</h3><p>{item.text}</p></div>
                <span className="card-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>

        <section className="stores section-shell" id="parduotuves" aria-labelledby="parduotuviu-antraste">
          <div className="section-heading split-heading">
            <div><p className="eyebrow">Parduotuvės</p><h2 id="parduotuviu-antraste">Arčiau jūsų kasdien</h2></div>
            <div><p>Greitai patikrinkite darbo laiką ir atverkite kelio nuorodą. Čia pateikiama dalis parduotuvių.</p><a className="text-link" href="https://ukmergeskoops.lt/parduotuves/">Visos parduotuvės <Arrow /></a></div>
          </div>

          <div className="store-grid">
            {stores.map((store) => (
              <article className="store-card" key={store.name}>
                <a className="store-image-link" href={store.map} target="_blank" rel="noreferrer" aria-label={`${store.name} – atverti žemėlapyje`}>
                  <img src={store.image} alt={`Parduotuvė „${store.name}“`} />
                </a>
                <div className="store-body">
                  <div className="store-title-row"><h3>{store.name}</h3><span aria-hidden="true">↗</span></div>
                  <p>{store.address}</p>
                  <dl><div><dt>Darbo laikas</dt><dd>{store.hours}</dd></div><div><dt>Telefonas</dt><dd><a href={`tel:${store.phoneHref}`}>{store.phone}</a></dd></div></dl>
                  <a className="store-map-link" href={store.map} target="_blank" rel="noreferrer">Rodyti žemėlapyje <Arrow /></a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="news section-shell" id="naujienos" aria-labelledby="naujienu-antraste">
          <div className="section-heading split-heading">
            <div><p className="eyebrow">Aktualu</p><h2 id="naujienu-antraste">Naujienos ir akcijos</h2></div>
            <div><p>Svarbiausi pasiūlymai ir naujienos iš KOOPS parduotuvių bei veiklų.</p><a className="text-link" href="https://ukmergeskoops.lt/naujienos/">Visos naujienos <Arrow /></a></div>
          </div>

          <div className="news-grid">
            <a className="news-featured" href="https://ukmergeskoops.lt/naujienos/">
              <img src="/koops-community.jpg" alt="Spalvingi vietos gamintojų produktai" />
              <div className="news-overlay"><span className="tag">NAUJIENOS</span><h3>Vietos skoniai – arčiau jūsų</h3><p>Atraskite kasdienius ir sezoninius pasiūlymus KOOPS parduotuvėse.</p><span className="button button-light">Skaityti daugiau <Arrow /></span></div>
            </a>
            <a className="news-tile news-tile-light" href="https://ukmergeskoops.lt/naujienos/"><span className="tag">AKCIJOS</span><h3>Naujausi pasiūlymai jūsų kasdieniam krepšeliui</h3><span className="tile-link">Peržiūrėti <Arrow /></span></a>
            <a className="news-tile news-tile-yellow" href="https://ukmergeskoops.lt/naujienos/"><span className="tag">KOOPS</span><h3>Kas naujo mūsų parduotuvėse?</h3><span className="tile-link">Sužinoti <Arrow /></span></a>
            <a className="news-tile news-tile-wide" href="https://ukmergeskoops.lt/naujienos/"><span className="tag">BENDRUOMENĖ</span><h3>Naujienos iš Ukmergės krašto</h3><span className="tile-link">Skaityti <Arrow /></span></a>
          </div>
        </section>

        <section className="restaurant section-shell" id="restoranas" aria-labelledby="restorano-antraste">
          <div className="restaurant-title"><p className="eyebrow eyebrow-light">Nuo 1965 metų</p><h2 id="restorano-antraste">Restoranas „Vilkmergė“ – jūsų šventėms ir susitikimams</h2></div>
          <div className="restaurant-grid">
            <img src="/vilkmerge.jpg" alt="Restorano „Vilkmergė“ lauko erdvė" />
            <div className="restaurant-copy">
              <p>Pačiame Ukmergės centre įsikūręs restoranas tinka jubiliejams, vestuvėms, krikštynoms, oficialiems renginiams ir jaukioms vakarienėms.</p>
              <dl><div><dt>Pokylių salės</dt><dd>3 salės</dd></div><div><dt>Talpa</dt><dd>Iki 154 svečių</dd></div></dl>
              <div className="restaurant-actions"><a className="button button-yellow" href="https://ukmergeskoops.lt/restoranas-vilkmerge/">Apie restoraną <Arrow /></a><a className="text-link text-link-light" href="tel:+37034053235">Skambinti 0 340 53235</a></div>
            </div>
          </div>
        </section>

        <section className="careers section-shell" id="karjera" aria-labelledby="karjeros-antraste">
          <div className="career-intro"><p className="eyebrow">Karjera</p><h2 id="karjeros-antraste">Darbas arti namų</h2><p>Ieškome žmonių, kurie vertina stabilumą, atsakomybę ir kasdienį ryšį su vietos bendruomene.</p><a className="text-link" href="https://ukmergeskoops.lt/skelbimai/">Visi darbo pasiūlymai <Arrow /></a></div>
          <div className="job-list">
            {jobs.map((job) => (
              <a className="job-row" href="https://ukmergeskoops.lt/skelbimai/" key={job.title}>
                <span className="tag">{job.type}</span><div><h3>{job.title}</h3><p>{job.location}</p></div><span className="job-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>

        <section className="about section-shell" id="apie" aria-labelledby="apie-antraste">
          <div className="about-copy"><p className="eyebrow">Apie KOOPS</p><h2 id="apie-antraste">Vietos žmonėms. Vietos verslui.</h2><p>Ukmergės rajono vartotojų kooperatyvas vienija prekybos ir maitinimo veiklas, kurios kasdien yra šalia miesto bei rajono žmonių.</p>
            <ul className="about-points"><li><span>01</span> Parduotuvės mieste ir rajone</li><li><span>02</span> Restoranas renginiams ir šventėms</li><li><span>03</span> Darbo vietos vietos žmonėms</li><li><span>04</span> Galimybės vietos tiekėjams</li></ul>
          </div>
          <img src="/koops-hero.jpg" alt="KOOPS parduotuvė Ukmergės rajone" />
        </section>

        <section className="supplier section-shell" id="tiekejams" aria-labelledby="tiekeju-antraste">
          <div className="supplier-orbit supplier-orbit-one" aria-hidden="true" />
          <div className="supplier-orbit supplier-orbit-two" aria-hidden="true" />
          <p className="eyebrow eyebrow-light">Tiekėjams</p>
          <h2 id="tiekeju-antraste">Jūsų produktas galėtų būti arčiau vietos pirkėjo</h2>
          <p>Ieškome patikimų gamintojų ir tiekėjų, norinčių augti kartu su KOOPS.</p>
          <a className="button button-yellow" href="mailto:direktore@urvk.lt?subject=Pasiūlymas%20KOOPS%20tiekėjams">Pasiūlyti produkciją <Arrow /></a>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <div className="footer-main">
          <div className="footer-brand"><img src="/koops-logo.jpg" alt="KOOPS prekybos sistema" /><p>Arti miesto ir rajono žmonių kasdien.</p></div>
          <div><h2>Navigacija</h2><a href="#parduotuves">Parduotuvės</a><a href="#naujienos">Naujienos ir akcijos</a><a href="#restoranas">Restoranas</a><a href="#karjera">Karjera</a></div>
          <div><h2>Kooperatyvas</h2><a href="#apie">Apie KOOPS</a><a href="#tiekejams">Tiekėjams</a><a href="https://ukmergeskoops.lt/kontaktai/">Kontaktai</a><a href="https://ukmergeskoops.lt/privatumo-politika/">Privatumo politika</a></div>
          <address><h2>Kontaktai</h2><p>Vasario 16-osios g. 30<br />LT-20130 Ukmergė</p><a href="tel:+37034053235">0 340 53235</a><a href="mailto:direktore@urvk.lt">direktore@urvk.lt</a></address>
        </div>
        <div className="footer-bottom"><p>© {new Date().getFullYear()} Ukmergės rajono vartotojų kooperatyvas</p><a href="#pradzia">Į puslapio viršų ↑</a></div>
      </footer>
    </>
  );
}
