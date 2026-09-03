import type { Metadata } from "next";
import { ClassifiedsPageMotion } from "../../components/ClassifiedsPageMotion";
import { RollingLabel } from "../../components/RollingLabel";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { getKoopsCmsData } from "../../lib/wordpress";
import { CmsPageController } from "../../components/CmsPageController";

export const metadata: Metadata = {
  title: "Skelbimai | KOOPS Ukmergė",
  description: "KOOPS skelbimai: nuomojamos patalpos, turto pasiūlymai ir kita aktuali informacija Ukmergėje bei rajone.",
  alternates: { canonical: "/skelbimai" },
};

export default async function ClassifiedsPage() {
  const { classifieds, pages } = await getKoopsCmsData();
  return (
    <div className="site-shell classifieds-page" id="pradzia" data-cms-page="skelbimai">
      <a className="skip-link" href="#turinys">Pereiti prie turinio</a>
      <ClassifiedsPageMotion />
      <SiteHeader />

      <main id="turinys">
        <section className="classifieds-directory" aria-labelledby="classifieds-title" data-cms-section="classifieds-listing">
          <div className="tt-container classifieds-directory-inner">
            <p className="section-label light-label">KOOPS SKELBIMAI</p>
            <h1 id="classifieds-title">Skelbimai</h1>
            <p className="classifieds-directory-lead">
              Nuomojamos patalpos, turto pasiūlymai ir kita aktuali KOOPS informacija vienoje vietoje.
            </p>

            <div className="classifieds-listing">
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
                  <h2>Naujų skelbimų šiuo metu nėra</h2>
                  <p>Jei domina KOOPS nuomojamos patalpos ar kitas turtas, susisiekite su administracija.</p>
                  <a className="pill-button accent" href="/kontaktai">
                    <RollingLabel>Susisiekti</RollingLabel>
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <CmsPageController page="skelbimai" sections={pages.skelbimai?.sections} />

      <SiteFooter showCta={false} />
    </div>
  );
}
