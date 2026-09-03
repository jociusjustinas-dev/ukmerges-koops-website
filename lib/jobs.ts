export type Job = {
  id: string;
  number: string;
  type: string;
  title: string;
  location: string;
  employment: string;
  summary: string;
  /** Išorinė kandidatavimo / skelbimo nuoroda (CV portalas, senas skelbimas ir pan.). */
  applyUrl: string;
};

export const careersContact = {
  email: "direktore@urvk.lt",
  phoneDisplay: "0 340 53235",
  phoneHref: "tel:+37034053235",
  address: "Vasario 16-osios g. 30, Ukmergė",
  listingsUrl: "/karjera#pozicijos",
};

/** Bendras demo URL — vėliau keisti į konkretaus skelbimo nuorodą. */
const demoApplyUrl = careersContact.listingsUrl;

export const jobs: Job[] = [
  {
    id: "pardavejas",
    number: "01",
    type: "PARDUOTUVĖSE",
    title: "Pardavėjas (-a)",
    location: "Ukmergė ir rajonas",
    employment: "Pilnas etatas",
    summary: "Kasdienis darbas su pirkėjais, prekių papildymas ir šiltas aptarnavimas parduotuvėje.",
    applyUrl: demoApplyUrl,
  },
  {
    id: "virejas",
    number: "02",
    type: "RESTORANE",
    title: "Virėjas (-a)",
    location: "Restoranas „Vilkmergė“",
    employment: "Pilnas etatas",
    summary: "Maisto gamyba šventėms ir kasdieniam meniu restorano virtuvėje.",
    applyUrl: demoApplyUrl,
  },
  {
    id: "vairuotojas",
    number: "03",
    type: "LOGISTIKOJE",
    title: "Vairuotojas–sandėlininkas (-ė)",
    location: "Ukmergė",
    employment: "Pilnas etatas",
    summary: "Prekių išvežiojimas į parduotuves ir sandėlio darbai.",
    applyUrl: demoApplyUrl,
  },
  {
    id: "padavejas",
    number: "04",
    type: "RESTORANE",
    title: "Padavėjas (-a)",
    location: "Restoranas „Vilkmergė“",
    employment: "Dalinis / pilnas etatas",
    summary: "Svečių aptarnavimas salėse per šventes, renginius ir vakarienes.",
    applyUrl: demoApplyUrl,
  },
];
