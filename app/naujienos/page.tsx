import type { Metadata } from "next";
import { NewsListing } from "../../components/NewsListing";
import { NewsPageHeading } from "../../components/NewsPageHeading";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { getKoopsCmsData } from "../../lib/wordpress";
import { CmsPageController } from "../../components/CmsPageController";

export const metadata: Metadata = {
  title: "Naujienos ir akcijos | KOOPS",
  description: "KOOPS naujienos, akcijos ir Ukmergės krašto aktualijos — vietos produkcija, parduotuvės ir restoranas „Vilkmergė“.",
  alternates: { canonical: "/naujienos" },
};

export default async function NewsArchivePage() {
  const { news, pages } = await getKoopsCmsData();
  return (
    <div className="site-shell news-page" id="pradzia" data-cms-page="naujienos">
      <a className="skip-link" href="#turinys">Pereiti prie turinio</a>
      <SiteHeader variant="solid" />

      <main id="turinys">
        {/* BYQ: terra-tory-blog-grid-1 card language adapted to archive list */}
        <section className="tt-news news-page-main" aria-labelledby="news-archive-title" data-byq-component="terra-tory-blog-grid-1" data-cms-section="news-listing">
          <div className="tt-container">
            <NewsPageHeading />
            <NewsListing items={news} />
          </div>
        </section>
      </main>
      <CmsPageController page="naujienos" sections={pages.naujienos?.sections} />

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
