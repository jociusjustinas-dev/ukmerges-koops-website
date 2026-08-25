import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsArticleShare } from "../../../components/NewsArticleShare";
import { RollingLabel } from "../../../components/RollingLabel";
import { SiteFooter } from "../../../components/SiteFooter";
import { SiteHeader } from "../../../components/SiteHeader";
import {
  getNews,
  newsDateLabel,
  newsHref,
  newsItems,
  relatedNews,
  type NewsBodyBlock,
} from "../../../lib/news";

const siteOrigin = "https://ukmerges-koops-koncepcija.jociusj.chatgpt.site";

type NewsPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return newsItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getNews(slug);
  if (!item) return { title: "Naujiena | KOOPS" };
  return {
    title: `${item.title} | KOOPS`,
    description: item.excerpt ?? item.title,
  };
}

function ArticleBlocks({ blocks }: { blocks: NewsBodyBlock[] }) {
  return (
    <div className="news-article-body">
      {blocks.map((block, index) => {
        if (block.type === "p") {
          return <p key={`p-${index}`}>{block.text}</p>;
        }
        if (block.type === "h2") {
          return <h2 key={`h2-${index}`}>{block.text}</h2>;
        }
        if (block.type === "figure") {
          return (
            <figure className="news-article-figure" key={`fig-${index}`}>
              <img src={block.src} alt={block.alt} loading="lazy" />
              {block.caption ? <figcaption>{block.caption}</figcaption> : null}
            </figure>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote className="news-article-quote" key={`q-${index}`}>
              <p>{block.text}</p>
            </blockquote>
          );
        }
        return (
          <aside className="news-article-cta" key={`cta-${index}`}>
            <div>
              <h3>{block.title}</h3>
              <p>{block.text}</p>
            </div>
            <a className="pill-button accent" href={block.href}>
              <RollingLabel>{block.label}</RollingLabel>
            </a>
          </aside>
        );
      })}
    </div>
  );
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const { slug } = await params;
  const item = getNews(slug);
  if (!item) notFound();

  const related = relatedNews(item.slug, 3);
  const shareUrl = `${siteOrigin}${newsHref(item.slug)}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.excerpt,
    datePublished: item.date,
    image: item.image,
    articleSection: item.category,
    publisher: {
      "@type": "Organization",
      name: "KOOPS",
    },
  };

  return (
    <div className="site-shell news-page news-detail-page" id="pradzia">
      <a className="skip-link" href="#turinys">Pereiti prie turinio</a>
      <SiteHeader variant="solid" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main id="turinys">
        <article className="news-article" data-byq-component="centered-news-detail">
          <header className="news-article-hero">
            <div className="tt-container news-article-hero-copy">
              <p className="news-card-meta">
                <span>{item.category}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={item.date}>{newsDateLabel(item.date)}</time>
              </p>
              <h1 id="news-article-title">{item.title}</h1>
              {item.excerpt ? <p className="news-article-lead">{item.excerpt}</p> : null}
            </div>
          </header>

          <div className="news-article-cover">
            <div className="tt-container">
              {item.image ? (
                <div className="news-article-cover-media">
                  <img src={item.image} alt="" />
                </div>
              ) : (
                <div className="news-article-cover-media is-placeholder" aria-hidden="true">
                  <img className="store-cover-logo" src="/koops-logo.png" alt="" />
                </div>
              )}
            </div>
          </div>

          <div className="news-article-content">
            <div className="tt-container news-article-layout">
              <aside className="news-article-rail news-article-rail-back">
                <div className="news-article-rail-sticky">
                  <a className="text-link news-article-back-link" href="/naujienos">
                    ← Visos naujienos
                  </a>
                </div>
              </aside>

              <ArticleBlocks blocks={item.body} />

              <aside className="news-article-rail news-article-rail-share">
                <div className="news-article-rail-sticky">
                  <NewsArticleShare title={item.title} url={shareUrl} />
                </div>
              </aside>
            </div>
          </div>
        </article>

        <section className="tt-news news-related" aria-labelledby="news-related-title">
          <div className="tt-container">
            <div className="news-related-header">
              <h2 id="news-related-title">Kitos naujienos</h2>
              <a className="pill-button ghost" href="/naujienos">
                <RollingLabel>Visos naujienos</RollingLabel>
              </a>
            </div>
            <div className="news-list-grid">
              {related.map((relatedItem) => (
                <a className="news-list-card" href={newsHref(relatedItem.slug)} key={relatedItem.slug}>
                  <div className={`news-list-media${relatedItem.image ? "" : " is-placeholder"}`}>
                    {relatedItem.image ? (
                      <img loading="lazy" src={relatedItem.image} alt="" />
                    ) : (
                      <img className="store-cover-logo" src="/koops-logo.png" alt="" />
                    )}
                  </div>
                  <div className="news-list-copy">
                    <p className="news-card-meta">
                      <span>{relatedItem.category}</span>
                      <span aria-hidden="true">·</span>
                      <time dateTime={relatedItem.date}>{newsDateLabel(relatedItem.date)}</time>
                    </p>
                    <h3>{relatedItem.title}</h3>
                    {relatedItem.excerpt ? <p className="news-list-excerpt">{relatedItem.excerpt}</p> : null}
                    <span className="text-link">Skaityti <span aria-hidden="true">→</span></span>
                  </div>
                </a>
              ))}
            </div>
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
