import { HomePage } from "../components/HomePage";
import { restaurant as restaurantDefaults } from "../lib/restaurant";
import { getKoopsCmsData } from "../lib/wordpress";

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "").replace(/^0/, "+370")}`;
}

export default async function Home() {
  const cms = await getKoopsCmsData();
  const featuredStores = [
    cms.stores.find((store) => store.slug === "pusele"),
    ...cms.stores.filter((store) => Boolean(store.image) && store.slug !== "pusele"),
  ].filter((store): store is (typeof cms.stores)[number] => Boolean(store)).slice(0, 5);

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

  return (
    <HomePage
      featuredStores={featuredStores}
      featuredNews={cms.news.slice(0, 4)}
      jobs={cms.jobs}
      restaurant={restaurant}
      cmsSections={cms.pages.pradinis?.sections}
    />
  );
}
