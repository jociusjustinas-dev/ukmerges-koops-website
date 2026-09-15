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
import { FlyersListing } from "./FlyersListing";
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

function headingProps(section: CmsPageSection) {
  return {
    eyebrow: section.eyebrow,
    title: section.title,
    description: section.description,
    primaryLabel: section.primaryLabel,
    primaryUrl: section.primaryUrl,
  };
}

function renderSection(section: CmsPageSection, context: CmsRenderContext) {
  switch (section.type) {
    case "home-hero":
      return <HomeHero imageUrl={section.imageUrl} />;
    case "home-bento":
      return <KoopsBentoSection />;
    case "home-stores":
      return <HomeStores stores={context.featuredStores} />;
    case "home-news":
      return <HomeNews items={context.featuredNews} flyers={context.flyers} />;
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
      return <StoresDirectory stores={context.stores} {...headingProps(section)} />;
    case "stores-faq":
      return <StoresFaq items={section.items as never} eyebrow={section.eyebrow} title={section.title} />;
    case "news-listing":
      return <NewsListingSection items={context.news} flyers={context.flyers} title={section.title} />;
    case "flyers-listing":
      return (
        <FlyersListing
          items={context.flyers}
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />
      );
    case "classifieds-listing":
      return <ClassifiedsListing items={context.classifieds} {...headingProps(section)} />;
    case "restaurant-hero":
      return <RestaurantHero restaurant={context.restaurant} />;
    case "restaurant-features":
      return <RestaurantValueFeatures items={section.items as never} />;
    case "restaurant-halls":
      return (
        <RestaurantHalls
          restaurant={context.restaurant}
          items={section.items as never}
          primaryLabel={section.primaryLabel}
          primaryUrl={section.primaryUrl}
        />
      );
    case "restaurant-enquiry":
      return <RestaurantEnquiry restaurant={context.restaurant} {...headingProps(section)} />;
    case "careers-hero":
      return <CareersHero {...headingProps(section)} />;
    case "careers-features":
      return <CareersValueFeatures items={section.items as never} />;
    case "careers-jobs":
      return <CareersJobs jobs={context.jobs} {...headingProps(section)} />;
    case "careers-enquiry":
      return <CareersEnquiry {...headingProps(section)} />;
    case "suppliers-hero":
      return <SuppliersHero {...headingProps(section)} />;
    case "suppliers-looking":
      return (
        <SuppliersLookingFor
          items={section.items as never}
          galleryUrls={section.galleryUrls}
          primaryLabel={section.primaryLabel}
          primaryUrl={section.primaryUrl}
        />
      );
    case "suppliers-process":
      return (
        <SuppliersProcess
          items={section.items as never}
          title={section.title}
          description={section.description}
          primaryLabel={section.primaryLabel}
          primaryUrl={section.primaryUrl}
        />
      );
    case "suppliers-enquiry":
      return <SuppliersEnquiry imageUrl={section.imageUrl} {...headingProps(section)} />;
    case "about-hero":
      return <AboutHero {...headingProps(section)} />;
    case "about-story":
      return <AboutStory {...headingProps(section)} imageUrl={section.imageUrl} />;
    case "about-pillars":
      return <AboutPillars items={section.items as never} />;
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
      return <ContactForm options={context.options} imageUrl={section.imageUrl} {...headingProps(section)} />;
    case "contact-channels":
      return <ContactChannels items={section.items as never} title={section.title} description={section.description} />;
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
