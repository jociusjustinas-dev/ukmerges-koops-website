import { Fragment } from "react";
import type { CmsPageSection, CmsRenderContext } from "../lib/cms-render";
import { AboutHero } from "./AboutHero";
import { AboutStory } from "./AboutStory";
import { CareersHero } from "./CareersHero";
import { RestaurantHero } from "./RestaurantHero";
import { SuppliersHero } from "./SuppliersHero";
import {
  FooterCta,
  HomeHero,
  HomeJobs,
  HomeNews,
  HomeRestaurant,
  HomeStores,
  HomeSuppliers,
} from "./cms/HomeCatalogSections";
import {
  CareersEnquiry,
  CareersJobs,
  ClassifiedsListing,
  ContactForm,
  NewsListingSection,
  RestaurantEnquiry,
  RestaurantHalls,
  StoresDirectory,
  StoresFaq,
  SuppliersEnquiry,
} from "./cms/SiteCatalogSections";
import { AboutPillars } from "./sections/AboutPillars";
import { CareersValueFeatures } from "./sections/CareersValueFeatures";
import { ContactChannels } from "./sections/ContactChannels";
import { KoopsBentoSection } from "./sections/KoopsBentoSection";
import { KoopsValueFeaturesSection } from "./sections/KoopsValueFeaturesSection";
import { RestaurantValueFeatures } from "./sections/RestaurantValueFeatures";
import { SuppliersLookingFor } from "./sections/SuppliersLookingFor";
import { SuppliersProcess } from "./sections/SuppliersProcess";

type Props = {
  sections: CmsPageSection[];
  context: CmsRenderContext;
  skipFooterCta?: boolean;
};

function renderSection(section: CmsPageSection, context: CmsRenderContext) {
  switch (section.type) {
    case "home-hero":
      return <HomeHero imageUrl={section.imageUrl} />;
    case "home-bento":
      return <KoopsBentoSection />;
    case "home-stores":
      return <HomeStores stores={context.featuredStores} />;
    case "home-news":
      return <HomeNews items={context.featuredNews} />;
    case "home-restaurant":
      return <HomeRestaurant restaurant={context.restaurant} galleryUrls={section.galleryUrls} />;
    case "home-jobs":
      return <HomeJobs jobs={context.jobs} />;
    case "home-values":
      return <KoopsValueFeaturesSection />;
    case "home-suppliers":
      return <HomeSuppliers imageUrl={section.imageUrl} />;
    case "footer-cta":
      return <FooterCta />;
    case "stores-directory":
      return <StoresDirectory stores={context.stores} />;
    case "stores-faq":
      return <StoresFaq />;
    case "news-listing":
      return <NewsListingSection items={context.news} />;
    case "classifieds-listing":
      return <ClassifiedsListing items={context.classifieds} />;
    case "restaurant-hero":
      return <RestaurantHero restaurant={context.restaurant} />;
    case "restaurant-features":
      return <RestaurantValueFeatures restaurant={context.restaurant} />;
    case "restaurant-halls":
      return <RestaurantHalls restaurant={context.restaurant} />;
    case "restaurant-enquiry":
      return <RestaurantEnquiry restaurant={context.restaurant} />;
    case "careers-hero":
      return <CareersHero />;
    case "careers-features":
      return <CareersValueFeatures />;
    case "careers-jobs":
      return <CareersJobs jobs={context.jobs} />;
    case "careers-enquiry":
      return <CareersEnquiry />;
    case "suppliers-hero":
      return <SuppliersHero />;
    case "suppliers-looking":
      return <SuppliersLookingFor />;
    case "suppliers-process":
      return <SuppliersProcess />;
    case "suppliers-enquiry":
      return <SuppliersEnquiry imageUrl={section.imageUrl} />;
    case "about-hero":
      return <AboutHero />;
    case "about-story":
      return <AboutStory />;
    case "about-pillars":
      return <AboutPillars />;
    case "about-bento":
      return (
        <KoopsBentoSection
          cmsSection="about-bento"
          wideImage={{
            src: section.imageUrl?.trim() || "/store-uosis.jpeg",
            alt: "KOOPS parduotuvė „Uosis“",
          }}
        />
      );
    case "contact-form":
      return <ContactForm options={context.options} imageUrl={section.imageUrl} />;
    case "contact-channels":
      return <ContactChannels />;
    default:
      return null;
  }
}

export function CmsPageSections({ sections, context, skipFooterCta = false }: Props) {
  return (
    <>
      {sections.map((section, index) => {
        if (skipFooterCta && section.type === "footer-cta") return null;
        const node = renderSection(section, context);
        if (!node) return null;
        return <Fragment key={`${section.id || section.type}-${index}`}>{node}</Fragment>;
      })}
    </>
  );
}
