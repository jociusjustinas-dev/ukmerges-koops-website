export function KoopsBentoSection() {
  return (
    <section
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
          <a className="koops-bento-card" href="#parduotuves">
            <p className="section-label">PARDUOTUVĖS</p>
            <div className="koops-bento-card-content">
              <h3>Raskite</h3>
              <p>Adresai, darbo laikas ir kelio nuorodos.</p>
            </div>
          </a>

          <a
            className="koops-bento-media koops-bento-media-tall"
            href="#parduotuves"
            aria-label="Rasti artimiausią KOOPS parduotuvę"
          >
            <img
              src="/koops-hero.jpg"
              alt="KOOPS parduotuvė Ukmergės rajone"
              loading="lazy"
            />
          </a>

          <a className="koops-bento-card" href="#restoranas">
            <p className="section-label">RESTORANAS</p>
            <div className="koops-bento-card-content">
              <h3>3 salės</h3>
              <p>Šventėms, renginiams ir jaukiems susitikimams.</p>
            </div>
          </a>

          <a
            className="koops-bento-media"
            href="#restoranas"
            aria-label="Sužinoti apie restoraną „Vilkmergė“"
          >
            <img
              src="/vilkmerge.jpg"
              alt="Restorano „Vilkmergė“ salė"
              loading="lazy"
            />
          </a>

          <a
            className="koops-bento-media"
            href="#tiekejams"
            aria-label="Tapti KOOPS tiekėju"
          >
            <img
              src="/koops-community.jpg"
              alt="Vietos gamintojų produkcija KOOPS parduotuvėje"
              loading="lazy"
            />
          </a>

          <div className="koops-bento-card koops-bento-card-accent">
            <p className="section-label">KARJERA IR TIEKĖJAMS</p>
            <div className="koops-bento-card-content">
              <h3>Auginkime kartu</h3>
              <p>Darbo galimybės vietos žmonėms ir partnerystė gamintojams.</p>
            </div>
            <div className="koops-bento-actions">
              <a className="koops-bento-link" href="#karjera">Darbo pasiūlymai <span aria-hidden="true">→</span></a>
              <a className="koops-bento-link" href="#tiekejams">Tapti tiekėju <span aria-hidden="true">→</span></a>
            </div>
            <span className="koops-bento-circle" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
