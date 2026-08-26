import { socialLinks } from "./site";

/** Demonstraciniai kontaktai — patvirtinti prieš WordPress */
export const contactsOrg = {
  legalName: "Ukmergės rajono vartotojų kooperatyvas",
  shortName: "KOOPS",
  addressLines: ["Vasario 16-osios g. 30", "LT-20130 Ukmergė"],
  email: "direktore@urvk.lt",
  phoneDisplay: "0 340 53235",
  phoneHref: "tel:+37034053235",
  privacyUrl: "https://ukmergeskoops.lt/privatumo-politika/",
  note: "Demonstraciniai kontaktai. Galutinius telefonus ir el. paštus patvirtinsime prieš WordPress.",
};

export const contactChannels = [
  {
    title: "Parduotuvės",
    body: "Adresai, darbo laikas ir maršrutas iki artimiausios KOOPS parduotuvės.",
    href: "/parduotuves",
    cta: "Rasti parduotuvę",
  },
  {
    title: "Restoranas „Vilkmergė“",
    body: "Šventės, renginiai, salės ir tiesioginė užklausa.",
    href: "/restoranas",
    cta: "Apie restoraną",
  },
  {
    title: "Tiekėjams",
    body: "Pasiūlykite produkciją — ką pateikti ir kam rašyti.",
    href: "/tiekejams",
    cta: "Siųsti pasiūlymą",
  },
  {
    title: "Karjera",
    body: "Darbo pasiūlymai Ukmergėje ir rajone.",
    href: "/karjera",
    cta: "Darbo pasiūlymai",
  },
] as const;

export { socialLinks };
