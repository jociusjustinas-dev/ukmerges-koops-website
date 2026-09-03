export const restaurant = {
  name: "Vilkmergė",
  since: 1965,
  tagline: "Vieta jūsų šventėms, renginiams ir jaukiems susitikimams.",
  lead:
    "Pačiame Ukmergės centre įsikūręs restoranas tinka jubiliejams, vestuvėms, krikštynoms, oficialiems renginiams ir vakarienėms.",
  phoneDisplay: "0 340 52079",
  phoneHref: "tel:+37034052079",
  mobileDisplay: "+370 618 72548",
  mobileHref: "tel:+37061872548",
  email: "restoranas@urvk.lt",
  address: "Kauno g. 7, Ukmergė",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Kauno+g.+7,+Ukmergė",
  hallsCount: 3,
  maxGuests: 154,
};

export type RestaurantHall = {
  slug: string;
  name: string;
  capacity: string;
  suited: string;
  image: string;
};

export const restaurantHalls: RestaurantHall[] = [
  {
    slug: "didele-sale",
    name: "Didžioji salė",
    capacity: "Iki 90 svečių",
    suited: "Vestuvės, jubiliejai, įmonių vakarai",
    image: "/vilkmerge-hall.jpg",
  },
  {
    slug: "baras",
    name: "Baras",
    capacity: "Iki 40 svečių",
    suited: "Krikštynos, šeimos šventės, oficialūs susitikimai",
    image: "/vilkmerge-table.jpg",
  },
  {
    slug: "maza-sale",
    name: "Mažoji salė",
    capacity: "Iki 8 svečių",
    suited: "Jaukios vakarienės ir mažesnės progos",
    image: "/vilkmerge-menu.jpg",
  },
];

export const restaurantGallery = [
  { src: "/vilkmerge.jpg", alt: "Restorano „Vilkmergė“ lauko erdvė", big: true },
];

export const restaurantEventTypes = [
  "Jubiliejus",
  "Vestuvės",
  "Krikštynos",
  "Įmonės renginys",
  "Vakarienė",
  "Kita",
];
