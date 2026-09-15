/** Shared CMS item list defaults for Gutenberg repeaters. */

export type CmsFaqItem = {
  question: string;
  answer: string;
};

export type CmsHallItem = {
  name: string;
  capacity: string;
  description: string;
  imageUrl?: string;
  imageId?: number;
};

export type CmsFeatureItem = {
  title: string;
  body: string;
};

export type CmsLookingItem = {
  label: string;
  title: string;
  body: string;
};

export type CmsProcessItem = {
  step: string;
  title: string;
  body: string;
};

export type CmsChannelItem = {
  title: string;
  body: string;
  href: string;
  cta: string;
};

export type CmsSectionItem =
  | CmsFaqItem
  | CmsHallItem
  | CmsFeatureItem
  | CmsLookingItem
  | CmsProcessItem
  | CmsChannelItem;

export const defaultStoreFaqs: CmsFaqItem[] = [
  {
    question: "Kur rasti artimiausią KOOPS parduotuvę?",
    answer: "Sąraše arba žemėlapyje pasirinkite vietą. Ukmergės miestą ir rajoną galima atskirti filtru.",
  },
  {
    question: "Ar visos parduotuvės dirba vienodu laiku?",
    answer:
      "Ne. Mieste dažniausiai dirbama iki 20 val., dalis kaimo parduotuvių sekmadieniais nedirba. Laikas nurodytas prie kiekvienos vietos.",
  },
  {
    question: "Kaip gauti kelią iki parduotuvės?",
    answer: "Kortelėje spauskite „Rodyti žemėlapyje“ — žemėlapis dešinėje priartins pasirinktą parduotuvę.",
  },
  {
    question: "Kaip paskambinti pasirinktai parduotuvei?",
    answer:
      "Telefonas rodomas kortelėje ir greitoje peržiūroje. Spauskite numerį — skambutis prasidės iš karto.",
  },
  {
    question: "Ar KOOPS parduotuvės yra tik Ukmergės mieste?",
    answer:
      "Ne. Tinklas apima Ukmergę ir rajoną — kaimus bei miestelius. Sąraše naudokite filtrą „Ukmergė“ arba „Rajonas“.",
  },
];

export const defaultRestaurantHalls: CmsHallItem[] = [
  {
    name: "Didžioji salė",
    capacity: "Iki 90",
    description: "Vestuvės, jubiliejai, įmonių vakarai.",
    imageUrl: "/vilkmerge-hall.jpg",
  },
  {
    name: "Baras",
    capacity: "Iki 40",
    description: "Krikštynos, šeimos šventės, oficialūs susitikimai.",
    imageUrl: "/vilkmerge-table.jpg",
  },
  {
    name: "Mažoji salė",
    capacity: "Iki 8",
    description: "Jaukios vakarienės ir mažesnės progos.",
    imageUrl: "/vilkmerge-menu.jpg",
  },
];

export const defaultRestaurantFeatures: CmsFeatureItem[] = [
  {
    title: "Trys salės",
    body: "Skirtingiems formatams — nuo jaukios vakarienės iki didesnės šventės ar įmonės vakaro.",
  },
  {
    title: "Iki 154 svečių",
    body: "Restorane galime priimti iki 154 svečių. Siūlome Didžiąją salę, barą ir mažąją salę, kurioje telpa iki 8 svečių.",
  },
  {
    title: "Ukmergės centre",
    body: "Kauno g. 7, Ukmergė. Patogu svečiams ir organizatoriams — vieta, kurią lengva rasti.",
  },
  {
    title: "Aiški užklausa",
    body: "Forma arba skambutis — greitai suderinsime salę, datą ir meniu be spėliojimo.",
  },
];

export const defaultCareersFeatures: CmsFeatureItem[] = [
  {
    title: "Arti namų",
    body: "Darbas Ukmergėje ir rajone — be ilgos kelionės į didesnį miestą.",
  },
  {
    title: "Aiškios pozicijos",
    body: "Kiekviename skelbime — pavadinimas, vieta ir trumpas aprašymas, ką veiksite.",
  },
  {
    title: "Įvairūs keliai",
    body: "Parduotuvės, restoranas ir logistika — galite rinktis pagal patirtį ir ritmą.",
  },
  {
    title: "Paprastas kandidatavimas",
    body: "Pasirinkite skelbimą ir kandidatuokite išorinėje nuorodoje — arba parašykite, jei neradote tinkamos pozicijos.",
  },
];

export const defaultSuppliersLooking: CmsLookingItem[] = [
  {
    label: "ŠVIEŽIA",
    title: "Daržovės ir vaisiai",
    body: "Sezoninė produkcija iš Ukmergės krašto ir aplinkinių ūkių.",
  },
  {
    label: "PIENAS · KEPINIAI",
    title: "Kasdienė lentyna",
    body: "Pieno produktai, sūriai, duona ir kepiniai.",
  },
  {
    label: "MĖSA · ŽUVIS",
    title: "Pagrindinis asortimentas",
    body: "Šviežia ir apdorota mėsa, žuvies gaminiai.",
  },
  {
    label: "VIETOS GAMINIAI",
    title: "Aiški kilmė",
    body: "Medus, uogienės, konservai ir gėrimai.",
  },
];

export const defaultSuppliersProcess: CmsProcessItem[] = [
  {
    step: "01",
    title: "Pateikite pasiūlymą",
    body: "Produktą, kilmę, apytikslį kiekį ir kaip su jumis susisiekti. Trumpai pakanka pirmajam žingsniui.",
  },
  {
    step: "02",
    title: "Peržiūrime",
    body: "Įvertiname, ar produkcija tinka KOOPS asortimentui ir pirkėjų poreikiams.",
  },
  {
    step: "03",
    title: "Susisiekiame",
    body: "Grįžtame dėl tolesnių žingsnių — sąlygų, terminų ir bendradarbiavimo.",
  },
];

export const defaultAboutPillars: CmsFeatureItem[] = [
  {
    title: "Žmonės",
    body: "Pirkėjai, komanda ir vietos gamintojai — kooperatyvas gyvas dėl kasdienių santykių Ukmergėje ir rajone.",
  },
  {
    title: "Vieta",
    body: "Parduotuvės mieste ir seniūnijose, restoranas centre — paslaugos ten, kur žmonės gyvena ir švenčia.",
  },
  {
    title: "Istorija",
    body: "Ilgametė kooperatyvo patirtis ir „Vilkmergės“ tradicija — patikimas partneris krašto kasdienybei.",
  },
];

export const defaultContactChannels: CmsChannelItem[] = [
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
];

export function sectionItemsOrDefault<T extends CmsSectionItem>(
  items: CmsSectionItem[] | undefined,
  fallback: T[],
): T[] {
  if (Array.isArray(items) && items.length) {
    return items as T[];
  }
  return fallback;
}
