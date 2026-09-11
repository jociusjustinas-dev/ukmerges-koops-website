import { restaurant as restaurantDefaults } from "./restaurant";
import type { Classified } from "./classifieds";
import type { Job } from "./jobs";
import type { NewsItem } from "./news";
import type { Store } from "./stores";
import type { CmsPageSection, KoopsCmsData, WordPressOptions } from "./wordpress";

export type { CmsPageSection, WordPressOptions };

export const defaultPageSections: Record<string, string[]> = {
  pradinis: ["home-hero", "home-bento", "home-stores", "home-news", "home-restaurant", "home-jobs", "home-values", "home-suppliers", "footer-cta"],
  parduotuves: ["stores-directory", "stores-faq", "footer-cta"],
  naujienos: ["news-listing", "footer-cta"],
  skelbimai: ["classifieds-listing"],
  restoranas: ["restaurant-hero", "restaurant-features", "restaurant-halls", "restaurant-enquiry"],
  karjera: ["careers-hero", "careers-features", "careers-jobs", "careers-enquiry"],
  tiekejams: ["suppliers-hero", "suppliers-looking", "suppliers-process", "suppliers-enquiry"],
  apie: ["about-hero", "about-story", "about-pillars", "about-bento"],
  kontaktai: ["contact-form", "contact-channels"],
};

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "").replace(/^0/, "+370")}`;
}

export type CmsRenderContext = {
  options: WordPressOptions;
  stores: Store[];
  news: NewsItem[];
  classifieds: Classified[];
  jobs: Job[];
  featuredStores: Store[];
  featuredNews: NewsItem[];
  restaurant: typeof restaurantDefaults;
};

export function createCmsRenderContext(cms: KoopsCmsData): CmsRenderContext {
  const featuredStores = [
    cms.stores.find((store) => store.slug === "pusele"),
    ...cms.stores.filter((store) => Boolean(store.image) && store.slug !== "pusele"),
  ]
    .filter((store): store is Store => Boolean(store))
    .slice(0, 5);

  const restaurant = {
    ...restaurantDefaults,
    since: Number(cms.options.restaurant_since) || restaurantDefaults.since,
    phoneDisplay: cms.options.restaurant_phone || restaurantDefaults.phoneDisplay,
    phoneHref: phoneHref(cms.options.restaurant_phone || restaurantDefaults.phoneDisplay),
    mobileDisplay: cms.options.restaurant_mobile || restaurantDefaults.mobileDisplay,
    mobileHref: phoneHref(cms.options.restaurant_mobile || restaurantDefaults.mobileDisplay),
    email: cms.options.restaurant_email || restaurantDefaults.email,
    address: cms.options.restaurant_address || restaurantDefaults.address,
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      cms.options.restaurant_address || restaurantDefaults.address,
    )}`,
    hallsCount: Number(cms.options.restaurant_halls) || restaurantDefaults.hallsCount,
    maxGuests: Number(cms.options.restaurant_capacity) || restaurantDefaults.maxGuests,
  };

  return {
    options: cms.options,
    stores: cms.stores,
    news: cms.news,
    classifieds: cms.classifieds,
    jobs: cms.jobs,
    featuredStores,
    featuredNews: cms.news.slice(0, 4),
    restaurant,
  };
}

export function resolvePageSections(page: string, sections?: CmsPageSection[]): CmsPageSection[] {
  if (sections?.length) {
    return sections;
  }

  return (defaultPageSections[page] || []).map((type) => ({
    id: type,
    type,
    enabled: true,
  }));
}

export function getCmsPageView(cms: KoopsCmsData, page: string) {
  const context = createCmsRenderContext(cms);
  const sections = resolvePageSections(page, cms.pages[page]?.sections);
  return {
    context,
    sections,
    hasFooterCta: sections.some((section) => section.type === "footer-cta"),
  };
}
