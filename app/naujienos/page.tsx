import type { Metadata } from "next";
import { NewsListing } from "../../components/NewsListing";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "Naujienos ir akcijos | KOOPS",
  description: "KOOPS naujienos, akcijos ir Ukmergės krašto aktualijos — vietos produkcija, parduotuvės ir restoranas „Vilkmergė“.",
};

export default function NewsArchivePage() {
  return (
    <div className="site-shell news-page" id="pradzia">
      <a className="skip-link" href="#turinys">Pereiti prie turinio</a>
      <SiteHeader variant="solid" />

      <main id="turinys">
        {/* BYQ: terra-tory-blog-grid-1 card language adapted to archive list */}
        <section className="tt-news news-page-main" aria-labelledby="news-archive-title" data-byq-component="terra-tory-blog-grid-1">
          <div className="tt-container">
            <div className="tt-section-header news-page-header">
              <div className="dashed-divider" />
              <h1 id="news-archive-title">Naujienos ir akcijos</h1>
              <p className="news-page-lead">
                Kas vyksta KOOPS tinkle: vietos produkcija, parduotuvių aktualijos ir restoranas „Vilkmergė“.
              </p>
            </div>

            <NewsListing />
          </div>
        </section>
      </main>

      <SiteFooter
        ctaHref="/parduotuves"
        ctaLabel="Rasti parduotuvę"
        ctaAriaLabel="Rasti KOOPS parduotuvę"
        ctaTitleDesktop={["Parduotuvė gali būti", "arčiau, nei manote"]}
        ctaTitleMobile={["Parduotuvė gali", "būti arčiau,", "nei manote"]}
      />
    </div>
  );
}
