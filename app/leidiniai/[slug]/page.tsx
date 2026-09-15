import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FlyerViewer } from "../../../components/FlyerViewer";
import { SiteFooter } from "../../../components/SiteFooter";
import { SiteHeader } from "../../../components/SiteHeader";
import { flyerHref } from "../../../lib/flyers";
import { createPageMetadata } from "../../../lib/metadata";
import { getKoopsCmsData } from "../../../lib/wordpress";

type FlyerPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { flyers } = await getKoopsCmsData();
  return flyers.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: FlyerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { flyers } = await getKoopsCmsData();
  const item = flyers.find((entry) => entry.slug === slug);
  if (!item) return { title: "Leidinys | KOOPS" };
  return createPageMetadata({
    title: `${item.title} | KOOPS`,
    description: item.excerpt || `${item.title} — KOOPS akcijų leidinys.`,
    path: flyerHref(item.slug),
    image: item.image || item.pages[0],
  });
}

export default async function FlyerPage({ params }: FlyerPageProps) {
  const { slug } = await params;
  const { flyers } = await getKoopsCmsData();
  const flyer = flyers.find((entry) => entry.slug === slug);
  if (!flyer) notFound();

  return (
    <div className="site-shell flyers-page" id="pradzia">
      <a className="skip-link" href="#turinys">Pereiti prie turinio</a>
      <SiteHeader variant="solid" />
      <main id="turinys">
        <section className="flyer-detail" aria-labelledby="flyer-title">
          <div className="tt-container">
            <FlyerViewer flyer={flyer} />
          </div>
        </section>
      </main>
      <SiteFooter showCta={false} />
    </div>
  );
}
