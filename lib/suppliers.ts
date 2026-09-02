export const suppliersContact = {
  email: "direktore@urvk.lt",
  phoneDisplay: "0 340 53235",
  phoneHref: "tel:+37034053235",
  addressLines: ["Vasario 16-osios g. 30", "LT-20130 Ukmergė"],
  note: "Demonstracinis kelias. Galutinį kontaktą ir procesą reikia patvirtinti prieš WordPress.",
};

/** Demonstracinės kategorijos — patvirtinti prieš WordPress */
export const supplierLookingFor = {
  fresh: {
    label: "ŠVIEŽIA",
    title: "Daržovės ir vaisiai",
    body: "Sezoninė produkcija iš Ukmergės krašto ir aplinkinių ūkių.",
  },
  dairy: {
    label: "PIENAS · KEPINIAI",
    title: "Kasdienė lentyna",
    body: "Pieno produktai, sūriai, duona ir kepiniai.",
  },
  meat: {
    label: "MĖSA · ŽUVIS",
    title: "Pagrindinis asortimentas",
    body: "Šviežia ir apdorota mėsa, žuvies gaminiai.",
  },
  local: {
    label: "VIETOS GAMINIAI",
    title: "Aiški kilmė",
    body: "Medus, uogienės, konservai, gėrimai. Demonstracinis sąrašas — patvirtinsime prieš WordPress.",
  },
} as const;

/** Demonstracinis tiekėjo kelias — patvirtinti prieš WordPress */
export const supplierProcessSteps = [
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
] as const;