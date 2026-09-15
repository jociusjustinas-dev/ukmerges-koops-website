import { CmsPageController } from "../../components/CmsPageController";
import { CmsPageSections } from "../../components/CmsPageSections";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { getCmsPageView } from "../../lib/cms-render";
import { createPageMetadata } from "../../lib/metadata";
import { absoluteUrl } from "../../lib/site-url";
import { getKoopsCmsData } from "../../lib/wordpress";

export const metadata = createPageMetadata({
  title: "Restoranas „Vilkmergė“ | KOOPS",
  description: "Restoranas „Vilkmergė“ Ukmergėje — 3 salės, iki 154 svečių. Užklausa šventei, renginiui ar vakarienei ir tiesioginis skambutis.",
  path: "/restoranas",
  image: "/vilkmerge.jpg",
});

export default async function RestaurantPage() {
  const cms = await getKoopsCmsData();
  const { context, sections, footerCtaProps } = getCmsPageView(cms, "restoranas");
  const restaurant = context.restaurant;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${absoluteUrl("/restoranas")}#restaurant`,
    name: `Restoranas „${restaurant.name}“`,
    telephone: restaurant.phoneHref.replace("tel:", ""),
    email: restaurant.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address,
      addressLocality: "Ukmergė",
      addressCountry: "LT",
    },
    image: absoluteUrl("/vilkmerge.jpg"),
    hasMap: restaurant.mapUrl,
    parentOrganization: { "@id": `${absoluteUrl("/")}#organization` },
    url: absoluteUrl("/restoranas"),
  };

  return (
    <div className="site-shell restaurant-page" id="pradzia" data-cms-page="restoranas">
      <a className="skip-link" href="#turinys">
        Pereiti prie turinio
      </a>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main id="turinys">
        <CmsPageSections sections={sections} context={context} skipFooterCta />
      </main>
      <CmsPageController page="restoranas" sections={sections} />

      <SiteFooter {...footerCtaProps} />
    </div>
  );
}
