export const aboutOrg = {
  legalName: "Ukmergės rajono vartotojų kooperatyvas",
  shortName: "KOOPS",
  addressLines: ["Vasario 16-osios g. 30", "LT-20130 Ukmergė"],
  email: "direktore@urvk.lt",
  phoneDisplay: "0 340 53235",
  phoneHref: "tel:+37034053235",
  storeCount: 34,
};

export const aboutHeroGallery = [
  {
    src: "/koops-bento-local-shopping.jpg",
    alt: "Pirkėja krauna vietos produktus į pirkinių krepšį",
  },
  {
    src: "/ukmerge-fields-2.jpg",
    alt: "Ukmergės krašto laukai",
  },
  {
    src: "/ukmerge-fields-6.jpg",
    alt: "Ukmergės krašto rytmečio laukai",
  },
  {
    src: "/ukmerge-fields-1.jpg",
    alt: "Žemės ūkio kraštovaizdis Ukmergės rajone",
  },
] as const;

export const aboutStory = {
  label: "ŽMONĖS · VIETA · ISTORIJA",
  title: "Kooperatyvas, augęs kartu su Ukmergės kraštu",
  body: "KOOPS jungia parduotuves, restoraną „Vilkmergė“ ir vietos partnerius. Dirbame tam, kad kasdienės prekės, darbas ir šventės būtų arčiau namų.",
  image: {
    src: "/ukmerge-fields-5.jpg",
    alt: "Ukmergės krašto laukai",
  },
  facts: [
    { label: "Parduotuvės", value: "34 vietos" },
    { label: "Centras", value: "Ukmergė" },
    { label: "Restoranas", value: "„Vilkmergė“" },
  ],
};

export const aboutPillars = [
  {
    title: "Žmonės",
    body: "Pirkėjai, komanda ir vietos gamintojai — kooperatyvas gyvas dėl kasdienių santykių Ukmergėje ir rajone.",
    tone: "bone" as const,
  },
  {
    title: "Vieta",
    body: "Parduotuvės mieste ir seniūnijose, restoranas centre — paslaugos ten, kur žmonės gyvena ir švenčia.",
    tone: "sprout" as const,
  },
  {
    title: "Istorija",
    body: "Ilgametė kooperatyvo patirtis ir „Vilkmergės“ tradicija — patikimas partneris krašto kasdienybei.",
    tone: "moss" as const,
  },
] as const;
