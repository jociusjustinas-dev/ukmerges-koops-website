export type NewsTone = "featured" | "accent" | "muted" | "wide";

export type NewsBodyBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "figure"; src: string; alt: string; caption?: string }
  | { type: "quote"; text: string }
  | { type: "cta"; title: string; text: string; href: string; label: string };

export type NewsItem = {
  slug: string;
  title: string;
  excerpt?: string;
  category: string;
  date: string;
  image?: string;
  tone: NewsTone;
  body: NewsBodyBlock[];
};

function simpleBody(paragraphs: string[]): NewsBodyBlock[] {
  return paragraphs.map((text) => ({ type: "p", text }));
}

/** Demonstraciniai įrašai — galutinį turinį patvirtinti prieš WordPress. */
export const newsItems: NewsItem[] = [
  {
    slug: "vietos-skoniai",
    title: "Vietos skoniai – arčiau jūsų",
    excerpt: "Atraskite Ukmergės krašto gamintojų produkciją mūsų parduotuvėse.",
    category: "Naujienos",
    date: "2026-08-12",
    image: "/local-produce-couple.jpg",
    tone: "featured",
    body: simpleBody([
      "KOOPS parduotuvėse Ukmergėje ir rajone nuolat ieškome būdų, kaip priartinti vietos gamintojų produkciją prie kasdienio pirkėjo krepšelio.",
      "Trumpesnis kelias nuo ūkio iki lentynos reiškia šviežesnį produktą, aiškesnę kilmę ir stipresnį ryšį su krašto žmonėmis.",
      "Kviečiame užsukti į artimiausią parduotuvę ir atrasti, ką šį sezoną siūlo Ukmergės krašto gamintojai.",
    ]),
  },
  {
    slug: "pasiulymai-krepseliui",
    title: "Naujausi pasiūlymai kasdieniam krepšeliui",
    excerpt: "Savaitės akcijos ir kasdienio krepšelio pasiūlymai KOOPS parduotuvėse.",
    category: "Akcijos",
    date: "2026-08-08",
    image: "/koops-hero-market.jpg",
    tone: "accent",
    body: simpleBody([
      "Savaitės pasiūlymai KOOPS parduotuvėse skirti kasdieniam krepšeliui — nuo pagrindinių produktų iki vietos gamintojų prekių.",
      "Aktualius pasiūlymus rasite parduotuvėse Ukmergėje ir rajone. Jei ieškote artimiausios vietos, naudokitės parduotuvių žemėlapiu.",
    ]),
  },
  {
    slug: "kas-naujo-parduotuvese",
    title: "Kas naujo KOOPS parduotuvėse?",
    excerpt: "Trumpos naujienos iš tinklo: atnaujinimai, paslaugos ir vietos pasiūlymai.",
    category: "Tinklas",
    date: "2026-08-01",
    image: "/store-slaitai.jpeg",
    tone: "muted",
    body: simpleBody([
      "KOOPS tinklas apima Ukmergės miestą ir rajoną. Čia trumpai apie tai, kas keičiasi parduotuvėse: paslaugos, darbo laikas ir vietos aktualijos.",
      "Jei turite klausimų dėl konkrečios parduotuvės, jos kortelėje rasite adresą, telefoną ir maršrutą.",
    ]),
  },
  {
    slug: "naujienos-is-krasto",
    title: "Naujienos iš Ukmergės krašto",
    excerpt: "Ką verta žinoti Ukmergės miesto ir rajono gyventojams.",
    category: "Kraštas",
    date: "2026-07-24",
    image: "/vilkmerge.jpg",
    tone: "wide",
    body: simpleBody([
      "Ukmergės kraštas — tai ne tik parduotuvės. Čia susitinka vietos žmonės, gamintojai, restorano svečiai ir kooperatyvo komanda.",
      "Šiame rubrikoje dalinamės tuo, kas aktualu miestui ir rajonui: nuo sezono skonių iki bendruomenės iniciatyvų.",
    ]),
  },
  {
    slug: "vietos-pomidorai",
    title: "Švieži vietos pomidorai – sezono pradžia",
    excerpt: "Kooperatyvo parduotuvėse – Ukmergės krašto daržovių sezono startas.",
    category: "Vietos produkcija",
    date: "2026-07-18",
    image: "/local-produce-tomatoes.jpg",
    tone: "muted",
    body: [
      {
        type: "p",
        text: "Prasidėjus daržovių sezonui, KOOPS parduotuvėse vėl atsiranda Ukmergės krašto pomidorai — švieži, aiškios kilmės ir skirti kasdieniam stalui. Tai vienas paprasčiausių būdų pajusti, kuo skiriasi vietos produkcija nuo ilgo tiekimo grandinės.",
      },
      {
        type: "p",
        text: "Šiemet sezoną pradedame anksčiau nei daugelis tikisi: šiltnamiai ir vietos ūkiai jau tiekia pirmąsias partijas. Pirkėjui tai reiškia trumpesnį kelią nuo lauko iki krepšelio ir galimybę rinktis produktą, kurio istoriją galima papasakoti keliais sakiniais.",
      },
      {
        type: "h2",
        text: "Kodėl vietos pomidorai svarbūs krepšeliui",
      },
      {
        type: "p",
        text: "Vietos produkcija padeda išlaikyti skonį, sumažinti transportavimo kelią ir palaikyti krašto ūkininkus. KOOPS tikslas — kad tokie produktai būtų ne „ypatinga prekė kartais“, o įprasta lentynos dalis.",
      },
      {
        type: "p",
        text: "Pomidorai — geras pavyzdys: jie greitai parodo skirtumą tarp šviežio derliaus ir prekės, kuri keliavo kelias dienas. Todėl sezono pradžioje ypač kviečiame ragauti ir lyginti.",
      },
      {
        type: "figure",
        src: "/local-produce-customer.jpg",
        alt: "Pirkėjas renkasi vietos daržoves KOOPS parduotuvėje",
        caption: "Vietos produkcija – arčiau kasdienio pirkėjo sprendimo.",
      },
      {
        type: "h2",
        text: "Kur rasti ir ko tikėtis",
      },
      {
        type: "p",
        text: "Asortimentas priklauso nuo savaitės derliaus ir tiekimo. Miesto ir rajono parduotuvėse pasiūla gali skirtis, todėl jei ieškote konkrečios veislės ar partijos — klauskite parduotuvės komandos.",
      },
      {
        type: "quote",
        text: "Geriausias kelias į šviežią produktą — trumpas kelias. Kai ūkis ir parduotuvė kalbasi tiesiogiai, pirkėjas tai pajunta greičiausiai.",
      },
      {
        type: "p",
        text: "Kartu su pomidorais sezono pradžioje dažnai pasirodo ir kitos vietos daržovės. Sekite naujienas ir užsukite į artimiausią KOOPS parduotuvę — adresą, darbo laiką ir maršrutą rasite parduotuvių puslapyje.",
      },
      {
        type: "cta",
        title: "Raskite artimiausią parduotuvę",
        text: "34 vietos Ukmergėje ir rajone — adresas, darbo laikas ir kelias žemėlapyje.",
        href: "/parduotuves",
        label: "Rasti parduotuvę",
      },
    ],
  },
  {
    slug: "vilkmerge-sventems",
    title: "Planuojate šventę „Vilkmergėje“?",
    excerpt: "Trys salės, iki 154 svečių ir aiškus kelias užklausai.",
    category: "Restoranas",
    date: "2026-07-10",
    image: "/vilkmerge-hall.jpg",
    tone: "muted",
    body: [
      {
        type: "p",
        text: "Restoranas „Vilkmergė“ Ukmergės centre tinka jubiliejams, vestuvėms, krikštynoms ir įmonių vakarams. Trys salės ir talpa iki 154 svečių leidžia rinktis formatą pagal renginį.",
      },
      {
        type: "figure",
        src: "/vilkmerge-table.jpg",
        alt: "Šventiškai serviruotas stalas restorane Vilkmergė",
        caption: "Šventės stalas „Vilkmergėje“.",
      },
      {
        type: "p",
        text: "Jei planuojate datą, pradėkite nuo užklausos arba skambučio — taip greičiausiai suderinsite salę, meniu ir laiką.",
      },
      {
        type: "cta",
        title: "Susisiekite dėl šventės",
        text: "Skambinkite arba skaitykite daugiau apie restoraną koncepcijos puslapyje.",
        href: "/#restoranas",
        label: "Apie restoraną",
      },
    ],
  },
  {
    slug: "pirkejai-ir-gamintojai",
    title: "Kai pirkėjas susitinka gamintoją",
    excerpt: "Kaip KOOPS suartina krašto žmones ir vietos verslą.",
    category: "Apie KOOPS",
    date: "2026-06-28",
    image: "/local-produce-customer.jpg",
    tone: "muted",
    body: simpleBody([
      "Kooperatyvas veikia ten, kur susitinka pirkėjas, gamintojas ir vietos komanda. Kai šie ryšiai aiškūs, lentyna tampa ne tik asortimentu, bet ir krašto istorija.",
      "Todėl KOOPS siekia, kad vietos produkcija būtų matoma, o kelias tiekėjui — paprastas ir suprantamas.",
    ]),
  },
  {
    slug: "parduotuve-arciau",
    title: "Parduotuvė gali būti arčiau, nei manote",
    excerpt: "34 vietos Ukmergėje ir rajone – adresai, laikas ir maršrutas.",
    category: "Parduotuvės",
    date: "2026-06-15",
    image: "/koops-bento-local-shopping.jpg",
    tone: "muted",
    body: [
      {
        type: "p",
        text: "KOOPS tinklas apima Ukmergę ir rajoną — 34 parduotuves. Dažnai artimiausia vieta yra arčiau, nei atrodo iš pirmo žvilgsnio.",
      },
      {
        type: "cta",
        title: "Atidarykite parduotuvių žemėlapį",
        text: "Filtruokite miestą ar rajoną, raskite adresą, laiką ir maršrutą.",
        href: "/parduotuves",
        label: "Visos parduotuvės",
      },
    ],
  },
  {
    slug: "ukmerges-laukai",
    title: "Iš lauko – į lentyną",
    excerpt: "Trumpas kelias nuo vietos ūkio iki KOOPS prekystalio.",
    category: "Vietos produkcija",
    date: "2026-06-02",
    image: "/ukmerge-fields-2.jpg",
    tone: "muted",
    body: simpleBody([
      "Trumpas kelias nuo lauko iki lentynos — tai ne tik logistika. Tai sprendimas, kuris keičia skonį, šviežumą ir pasitikėjimą produktu.",
      "KOOPS kviečia vietos gamintojus ir pirkėjus susitikti ten, kur prekė tampa kasdienybe, o ne išimtimi.",
    ]),
  },
  {
    slug: "stalas-vilkmerges",
    title: "Šventiškai serviruotas stalas „Vilkmergėje“",
    excerpt: "Idėjos jubiliejui, vestuvėms ir įmonės vakarienei.",
    category: "Restoranas",
    date: "2026-05-20",
    image: "/vilkmerge-table.jpg",
    tone: "muted",
    body: simpleBody([
      "Šventės stalas prasideda nuo erdvės, meniu ir aiškaus kontakto. „Vilkmergėje“ galite derinti salės formatą ir serviruotę pagal renginį.",
      "Jei ieškote idėjų jubiliejui ar įmonės vakarienei — užsukite arba susisiekite dėl užklausos.",
    ]),
  },
  {
    slug: "papartis-atnaujinimas",
    title: "„Papartis“ – pažįstama vieta, šviežesnis vaizdas",
    excerpt: "Kaip atsinaujina viena iš miesto KOOPS parduotuvių.",
    category: "Parduotuvės",
    date: "2026-05-08",
    image: "/store-papartis.jpeg",
    tone: "muted",
    body: [
      {
        type: "p",
        text: "Parduotuvė „Papartis“ — viena iš miesto vietų, kurią pirkėjai atpažįsta iš tolo. Atsinaujinimai čia skirti tam, kad apsipirkimas būtų aiškesnis ir patogesnis.",
      },
      {
        type: "cta",
        title: "Parduotuvės „Papartis“ kontaktai",
        text: "Adresas, darbo laikas ir maršrutas — parduotuvės puslapyje.",
        href: "/parduotuves/papartis",
        label: "Apie „Papartį“",
      },
    ],
  },
  {
    slug: "vilkmerge-meniu",
    title: "Sezono skoniai restorano meniu",
    excerpt: "Ką šį sezoną siūlo „Vilkmergė“ šventėms ir pietums.",
    category: "Restoranas",
    date: "2026-04-22",
    image: "/vilkmerge-menu.jpg",
    tone: "muted",
    body: simpleBody([
      "Sezono meniu „Vilkmergėje“ keičiasi kartu su produktais, kuriuos galima gauti arčiau — nuo pietų iki šventės serviruotės.",
      "Dėl konkretaus meniu ir datos geriausia susisiekti tiesiogiai su restoranu.",
    ]),
  },
];

/** Index bento – pirmos 4 pagal terra-tory-blog-grid-1. */
export const featuredNews = newsItems.slice(0, 4);

export const newsCategories = Array.from(
  new Set(newsItems.map((item) => item.category)),
).sort((a, b) => a.localeCompare(b, "lt"));

export function getNews(slug: string) {
  return newsItems.find((item) => item.slug === slug);
}

export function relatedNews(slug: string, limit = 3) {
  const current = getNews(slug);
  if (!current) return newsItems.slice(0, limit);
  const sameCategory = newsItems.filter(
    (item) => item.slug !== slug && item.category === current.category,
  );
  const others = newsItems.filter(
    (item) => item.slug !== slug && item.category !== current.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function newsHref(slug: string) {
  return `/naujienos/${slug}`;
}

export function newsDateLabel(iso: string) {
  return new Intl.DateTimeFormat("lt-LT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${iso}T12:00:00`));
}
