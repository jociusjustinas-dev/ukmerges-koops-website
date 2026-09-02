import type { Metadata } from "next";
import { RollingLabel } from "../../components/RollingLabel";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { classifieds } from "../../lib/classifieds";

export const metadata: Metadata = {
  title: "Skelbimai | KOOPS Ukmergė",
  description: "KOOPS skelbimai: nuomojamos patalpos, turto pasiūlymai ir kita aktuali informacija Ukmergėje bei rajone.",
};

export default function ClassifiedsPage() {
  return (
    <div className="site-shell classifieds-page" id="pradzia">
      <a className="skip-link" href="#turinys">Pereiti prie turinio</a>
      <SiteHeader variant="solid" />

      <main id="turinys">
        <section className="classifieds-hero" aria-labelledby="classifieds-title">
          <div className="orbit classifieds-orbit" aria-hidden="true" />
          <div className="tt-container classifieds-hero-inner">
            <p className="section-label light-label">KOOPS SKELBIMAI</p>
            <h1 id="classifieds-title">Skelbimai</h1>
            <p>Nuomojamos patalpos, turto pasiūlymai ir kita aktuali KOOPS informacija vienoje vietoje.</p>
          </div>
        </section>

        <section className="classifieds-archive" aria-labelledby="classifieds-active-title">
          <div className="tt-container">
            <header className="classifieds-section-head">
              <div>
                <p className="section-label">AKTUALU</p>
                <h2 id="classifieds-active-title">Aktyvūs skelbimai</h2>
              </div>
              <p>{classifieds.length} {classifieds.length === 1 ? "skelbimas" : "skelbimų"}</p>
            </header>

            {classifieds.length ? (
              <div className="classifieds-grid">
                {classifieds.map((item) => (
                  <article className="classified-card" key={item.slug}>
                    <div className="classified-card-top">
                      <span>{item.category}</span>
                      <span>{item.status}</span>
                    </div>
                    <div>
                      <h2>{item.title}</h2>
                      <p>{item.excerpt}</p>
                    </div>
                    <dl>
                      <div><dt>Vieta</dt><dd>{item.location}</dd></div>
                      {item.area ? <div><dt>Plotas</dt><dd>{item.area}</dd></div> : null}
                      {item.price ? <div><dt>Kaina</dt><dd>{item.price}</dd></div> : null}
                    </dl>
                  </article>
                ))}
              </div>
            ) : (
              <div className="classifieds-empty">
                <p className="section-label">ŠIUO METU</p>
                <h2>Aktyvių skelbimų nėra</h2>
                <p>Jei domina KOOPS nuomojamos patalpos ar kitas turtas, susisiekite su administracija.</p>
                <a className="pill-button accent" href="/kontaktai">
                  <RollingLabel>Susisiekti</RollingLabel>
                </a>
              </div>
            )}

            <div className="classifieds-info-grid" aria-label="Skelbimų kategorijos">
              <article>
                <span>01</span>
                <h3>Patalpų nuoma</h3>
                <p>Vieta, plotas, paskirtis, nuomos sąlygos ir kontaktai.</p>
              </article>
              <article>
                <span>02</span>
                <h3>Turto pasiūlymai</h3>
                <p>Parduodamas ar kitaip siūlomas KOOPS turtas.</p>
              </article>
              <article>
                <span>03</span>
                <h3>Kita informacija</h3>
                <p>Kiti vieši pasiūlymai ir kooperatyvo skelbimai.</p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter showCta={false} />
    </div>
  );
}

