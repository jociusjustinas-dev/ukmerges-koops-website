export function KoopsBentoSection({ cmsSection = "home-bento" }: { cmsSection?: string }) {
  return (
    <section
      data-cms-section={cmsSection}
      className="koops-bento-section"
      aria-labelledby="koops-bento-title"
      data-byq-component="terra-tory-home-c-features"
    >
      <div className="tt-container">
        <header className="koops-bento-header">
          <div className="dashed-divider" aria-hidden="true" />
          <p className="section-label">KOOPS KASDIEN</p>
          <h2 id="koops-bento-title">Viskas, ko reikia — arčiau jūsų</h2>
        </header>

        <div className="koops-bento-grid">
          <a className="koops-bento-card" href="/parduotuves">
            <p className="section-label">PARDUOTUVĖS</p>
            <div className="koops-bento-card-bottom">
              <div className="koops-bento-card-content">
                <h3>Raskite</h3>
                <p>Adresai, darbo laikas ir kelio nuorodos.</p>
              </div>
              <span className="text-link">Rasti parduotuvę <span aria-hidden="true">→</span></span>
            </div>
          </a>

          <a
            className="koops-bento-media koops-bento-media-tall"
            href="/parduotuves"
            aria-label="Rasti artimiausią KOOPS parduotuvę"
          >
            <img
              src="/koops-hero.jpg"
              alt="KOOPS parduotuvė Ukmergės rajone"
              loading="lazy"
            />
          </a>

          <a className="koops-bento-card koops-bento-card-career" href="/karjera">
            <p className="section-label">KARJERA</p>
            <div className="koops-bento-card-bottom">
              <div className="koops-bento-card-content">
                <h3>Darbo pasiūlymai</h3>
                <p>Galimybės Ukmergėje ir rajone.</p>
              </div>
              <span className="text-link">Peržiūrėti pasiūlymus <span aria-hidden="true">→</span></span>
            </div>
          </a>

          <a className="koops-bento-card" href="/tiekejams">
            <p className="section-label">TIEKĖJAMS</p>
            <div className="koops-bento-card-bottom">
              <div className="koops-bento-card-content">
                <h3>Tapkite tiekėju</h3>
                <p>Pasiūlykite savo produkciją KOOPS.</p>
              </div>
              <span className="text-link">Tapti tiekėju <span aria-hidden="true">→</span></span>
            </div>
          </a>

          <a
            className="koops-bento-media"
            href="/parduotuves"
            aria-label="Rasti artimiausią KOOPS parduotuvę"
          >
            <img
              src="/koops-bento-local-shopping.jpg"
              alt="Pirkėja KOOPS parduotuvėje renkasi vietos produktus"
              loading="lazy"
            />
          </a>

          <div className="koops-bento-card koops-bento-card-accent">
            <p className="section-label">RESTORANAS</p>
            <div className="koops-bento-card-content">
              <h3>Restoranas „Vilkmergė“</h3>
              <p>Šventėms, renginiams ir susitikimams.</p>
            </div>
            <div className="koops-bento-actions">
              <a className="text-link" href="/restoranas">Sužinoti daugiau <span aria-hidden="true">→</span></a>
            </div>
            <span className="koops-bento-circle" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
