/** Demonstraciniai restorano duomenys — patvirtinti prieš WordPress. */

export const restaurant = {
  name: "Vilkmergė",
  since: 1965,
  tagline: "Vieta jūsų šventėms, renginiams ir jaukiems susitikimams.",
  lead:
    "Pačiame Ukmergės centre įsikūręs restoranas tinka jubiliejams, vestuvėms, krikštynoms, oficialiems renginiams ir vakarienėms.",
  phoneDisplay: "0 340 53235",
  phoneHref: "tel:+37034053235",
  email: "vilkmerge@ukmergeskoops.lt",
  address: "Vytauto g. 69, Ukmergė",
  mapUrl: "https://maps.google.com/?q=Vilkmerg%C4%97+Ukmerg%C4%97",
  hallsCount: 3,
  maxGuests: 154,
  hours: "Pagal užsakymą ir renginį",
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
    slug: "vidurine-sale",
    name: "Vidurinė salė",
    capacity: "Iki 40 svečių",
    suited: "Krikštynos, šeimos šventės, oficialūs susitikimai",
    image: "/vilkmerge-table.jpg",
  },
  {
    slug: "maza-sale",
    name: "Mažoji salė",
    capacity: "Iki 24 svečių",
    suited: "Jaukios vakarienės ir mažesnės progos",
    image: "/vilkmerge-menu.jpg",
  },
];

export const restaurantGallery = [
  { src: "/vilkmerge.jpg", alt: "Restorano „Vilkmergė“ lauko erdvė", big: true },
  { src: "/vilkmerge-hall.jpg", alt: "Pokylių salė", big: false },
  { src: "/vilkmerge-table.jpg", alt: "Šventiškai serviruotas stalas", big: false },
  { src: "/vilkmerge-menu.jpg", alt: "Sezono užkandžiai", big: true },
];

export const restaurantEventTypes = [
  "Jubiliejus",
  "Vestuvės",
  "Krikštynos",
  "Įmonės renginys",
  "Vakarienė",
  "Kita",
];
