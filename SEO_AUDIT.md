# KOOPS svetainės SEO auditas

Audito data: 2026-09-03  
Audituota versija: https://ukmerges-koops-website.vercel.app/  
Apimtis: 51 unikalus veikiantis puslapis, vidinės nuorodos, metaduomenys, indeksavimo signalai, struktūriniai duomenys, mobilus Lighthouse ir senos svetainės URL migracija.

## Santrauka

Svetainė turi tvarkingą semantinį pagrindą: visi veikiantys puslapiai turi unikalius `title`, meta aprašymus ir po vieną H1; naudojamas `lang="lt"`, HTTPS ir HSTS; indeksuojamuose puslapiuose nerasta masinių 4xx ar antraščių hierarchijos problemų.

Tačiau dabartinė versija dar nėra paruošta indeksuoti galutiniame domene. Kritinės priežastys:

1. nėra `robots.txt`;
2. nėra `sitemap.xml`;
3. visuose 51 veikiančiame puslapyje nėra canonical nuorodos;
4. dalis JSON-LD URL vis dar nukreipia į seną `jociusj.chatgpt.site` koncepciją;
5. pagrindiniame puslapyje yra vidinė nuoroda į neegzistuojančią naujieną;
6. klientui skirtas `/strategija` puslapis yra indeksuojamas;
7. pagrindinių puslapių mobilus LCP neatitinka gero Core Web Vitals lygio.

Lighthouse SEO balas `100` šių problemų nepaneigia: Lighthouse netikrina pilnos sitemap, canonical, migracijos ir struktūrinių duomenų semantikos.

## P0 — sutvarkyti prieš domeno paleidimą

### 1. Robots ir sitemap

- `https://ukmerges-koops-website.vercel.app/robots.txt` grąžina 404.
- `https://ukmerges-koops-website.vercel.app/sitemap.xml` grąžina 404.
- Reikia generuoti abu failus iš realaus WordPress turinio.
- Sitemap turi apimti pagrindinius puslapius, 34 parduotuvių puslapius ir naujienas, bet ne `/strategija`, API ar administravimo adresus.

### 2. Canonical nėra nė viename puslapyje

Visuose 51 veikiančiame puslapyje trūksta `<link rel="canonical">`. Canonical turi būti absoliutus ir naudoti galutinį domeną `https://ukmergeskoops.lt`, ne Vercel ar koncepcijos domeną.

### 3. Neteisingi struktūrinių duomenų URL

Šiuose šablonuose JSON-LD nurodo `https://ukmerges-koops-koncepcija.jociusj.chatgpt.site`:

- parduotuvės detalės (`GroceryStore`);
- restoranas (`Restaurant`);
- „Apie mus“ (`Organization`);
- kontaktai (`Organization`).

Tai klaidingai susieja turinį su kitu domenu. Reikia vieno centrinio `SITE_URL` ir visur generuoti galutinio domeno URL.

### 4. Vidinis 404

Pagrindinio puslapio hero kortelė veda į:

`/naujienos/vietos-pomidorai` → 404.

Kortelė yra statinė, o gyvos naujienos gaunamos iš WordPress. Ji turi būti generuojama iš esamos naujienos arba nukreipta į `/naujienos`.

### 5. Strategijos puslapis indeksuojamas

`/strategija` turi `200`, title ir description, bet neturi `noindex`. Tai vidinis pristatymo puslapis, todėl jam reikia:

`robots: { index: false, follow: false }`

Jo taip pat negalima įtraukti į sitemap.

### 6. Galutinis domenas ir 301 migracija

Dabar `metadataBase` yra Vercel domenas. Prieš paleidimą jis turi būti pakeistas į `https://ukmergeskoops.lt`.

Senoje svetainėje rasti URL, kuriems būtinas tikslinis 301 planas:

| Senas URL | Rekomenduojamas naujas URL |
|---|---|
| `/restoranas-vilkmerge` | `/restoranas` |
| `/apie-mus` | `/apie` |
| `/akcijos` | `/naujienos` |
| `/rekomendacijos` | sprendimas pagal išsaugomą turinį; nenukreipti aklai į pradžią |
| `/ukmerges-duona-2` | sprendimas pagal išsaugomą turinį; nenukreipti aklai į pradžią |

Seno domeno sitemap turi ir tris vienodus `/akcijos` įrašus, todėl jo negalima kopijuoti tiesiogiai.

## P1 — matomumas ir našumas

### Mobilus Lighthouse

| Puslapis | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| Pradinis | 67 | 96 | 100 | 100 | 10,0 s | 60 ms | 0 |
| Parduotuvės | 36 | 100 | 96 | 100 | 13,1 s | 8 110 ms | 0 |
| Restoranas | 56 | 96 | 100 | 100 | 9,1 s | 420 ms | 0 |
| Naujienos | 84 | 100 | 100 | 100 | 3,6 s | 30 ms | 0 |
| Kontaktai | 87 | 100 | 100 | 100 | 3,8 s | 20 ms | 0 |

Tai laboratoriniai mobilūs matavimai, ne realių naudotojų CrUX duomenys. Gero LCP riba yra iki 2,5 s.

### Pagrindinis puslapis

- Perduodama apie 2,3 MB.
- Didžiausi vaizdai: 470 KB, 445 KB, 401 KB ir 361 KB.
- LCP elementas yra animuojamas H1 tekstas. Jo parodymą atideda įžanginė animacija.
- Reikia AVIF/WebP variantų, `srcset/sizes`, prioritetinio vieno hero vaizdo ir neblokuoti H1 matomumo animacija.

### Parduotuvės

- Performance 36 ir TBT 8,11 s yra kritinė problema.
- Mapbox JavaScript paketas sudaro apie 514 KB, papildomai kraunamos žemėlapio plytelės ir šriftai.
- Aptikta React hydration klaida `#418`.
- Žemėlapį reikia inicijuoti tik jam priartėjus prie viewport arba po aiškaus naudotojo veiksmo.
- Parduotuvės sąrašas turi būti pilnai veikiantis be Mapbox; žemėlapis — progresyvus priedas.

### Restoranas

- `vilkmerge.jpg` perduoda apie 1,07 MB.
- LCP 9,1 s; dalį vėlavimo sukuria animacijos ir hero vaizdas.
- Reikia modernaus formato, mobilių dydžių ir aiškaus hero prioriteto.

### Naujienos

- Pirmos kortelės vaizdas yra LCP, tačiau pažymėtas `loading="lazy"`.
- Pirmą virš matomos ribos esantį vaizdą reikia krauti `eager` / `priority`, kitus palikti `lazy`.

## P1 — struktūriniai duomenys ir AEO

### Kas jau yra

- `GroceryStore` — parduotuvių detalėse;
- `Restaurant` — restorano puslapyje;
- `NewsArticle` — naujienų detalėse;
- `JobPosting` — karjeros puslapyje;
- `FAQPage` — parduotuvių puslapyje;
- `Organization` — „Apie mus“ ir kontaktuose.

### Ko trūksta arba kas netikslu

- Visos svetainės lygiu nėra `WebSite` ir pagrindinio `Organization` grafo.
- `GroceryStore` trūksta `geo`, `openingHoursSpecification`, teisingo `url` ir ryšio su pagrindine organizacija.
- `Restaurant` trūksta `image`, `openingHoursSpecification`, `servesCuisine`, `priceRange`, `geo`; `url` neteisingas.
- `NewsArticle` trūksta `mainEntityOfPage`, `author`, `dateModified`, leidėjo URL ir logotipo.
- `JobPosting` trūksta privalomų ar praktiškai būtinų laukų: `datePosted`, `validThrough`, stabilaus `url` / `identifier`. Dabartinis žymėjimas gali neatitikti Google darbo skelbimų reikalavimų.
- Parduotuvės detalėse rodoma breadcrumb navigacija, bet nėra `BreadcrumbList` JSON-LD.
- Naujienų ir skelbimų sąrašams tinka `CollectionPage` / `ItemList`.

Šešiems unikaliems veikiantiems puslapiams nėra jokio JSON-LD: pradinis, naujienų sąrašas, skelbimai, tiekėjams, privatumo politika ir strategija. Privatumo politikai schema nėra būtina; strategija turi būti `noindex`.

## P1 — vaizdai ir dalinimasis

- Nė vienas iš 51 veikiančio puslapio neturi `og:image`.
- Twitter kortelė naudoja `summary`, nors vizualiai svetainei tinkamesnė `summary_large_image`.
- Reikia vieno bendro 1200×630 px OG vaizdo ir atskirų vaizdų naujienoms, parduotuvėms bei restoranui.
- Daugelyje kortelių ir naujienų viršelių naudojamas tuščias `alt`. Dekoratyviniams vaizdams tai teisinga, tačiau naujienų ir konkrečių parduotuvių nuotraukoms reikia prasmingo alternatyvaus teksto iš WordPress.
- HTML vaizdai neturi `width` ir `height`. CSS dabar išlaiko CLS ties 0, bet matmenys vis tiek turėtų būti pateikiami, o vaizdai generuojami pagal realų ekrano plotį.

## P2 — turinys ir vietinis SEO

- Visi veikiantys puslapiai turi title ir meta description; tarp galutinių URL realių dublikatų nerasta.
- Visi veikiantys puslapiai turi po vieną H1.
- Vienos naujienos title yra 67 simbolių ir gali būti trumpinamas paieškoje.
- Naujienų straipsnių meta aprašymai dažniausiai tik 71–89 simbolių. Juos verta rašyti kaip atskiras 120–155 simbolių santraukas.
- Parduotuvės detalės turi tik apie 50–59 matomo teksto žodžius. Vietiniam SEO verta pridėti realias paslaugas, darbo laiko pastabas, vietovės kontekstą ir unikalią informaciją; negalima generuoti išgalvoto teksto.
- Parduotuvės title turėtų nuosekliai turėti vietovę, pvz. `KOOPS parduotuvė „Pivonija“, Ukmergė`.
- Tuščias skelbimų archyvas turi tik apie 50 žodžių. Jei skelbimų nėra, reikia aiškios tuščios būsenos ir paaiškinimo; laikinas `noindex` svarstytinas tik tada, jei puslapis ilgai neturės jokio naudingo turinio.
- Vien lietuviškai svetainei `hreflang` nereikalingas.

## P2 — prieinamumas, turintis įtakos UX ir netiesiogiai SEO

- Pagrindiniame puslapyje `aria-label="Rasti artimiausią parduotuvę"` nesutampa su matomu mygtuko tekstu.
- Darbo pasiūlymų `div` turi draudžiamą `aria-label` be tinkamo vaidmens.
- Restorano mygtuko ir kontaktų nuorodų accessible pavadinimai nesutampa su matomu tekstu.
- Restorano formoje rasti 4,42:1 ir 3,04:1 kontrasto atvejai; tekstui reikia bent 4,5:1.
- 404 puslapis yra angliškas. Jis turi būti lietuviškas, su nuorodomis į pradžią, parduotuves ir kontaktus.

## Techniniai teigiami signalai

- HTTPS ir HSTS įjungti.
- Serverio atsako pradžia audituotuose puslapiuose apie 93–125 ms.
- CLS visuose penkiuose Lighthouse mėginiuose buvo 0.
- `lang="lt"` ir viewport yra.
- Pagrindinė antraščių hierarchija be praleistų lygių.
- 51 unikalus audituotas puslapis grąžino 200; rastas vienas vidinis 404.
- Dinaminės parduotuvių ir naujienų detalės pateikiamos serverio HTML, todėl nėra priklausomos vien nuo kliento JavaScript.

## Rekomenduojama darbų seka

1. Patvirtinti galutinį domeną ir centralizuoti `SITE_URL`.
2. Pašalinti vidinį 404 ir nustatyti `/strategija` kaip `noindex`.
3. Sugeneruoti canonical, `robots.txt` ir `sitemap.xml`.
4. Sutvarkyti visų JSON-LD URL ir privalomus laukus.
5. Parengti 301 migracijos lentelę ir išspręsti `/rekomendacijos` bei `/ukmerges-duona-2` likimą.
6. Optimizuoti hero vaizdus ir animacijų įtaką LCP.
7. Atidėti Mapbox inicializavimą, pašalinti hydration klaidą.
8. Įdėti OG vaizdus, sutvarkyti naujienų ir parduotuvių alt tekstus.
9. Ištaisyti kontrastą ir accessible pavadinimus.
10. Po galutinio domeno paleidimo prijungti Search Console, pateikti sitemap ir stebėti indeksavimą bei realius Core Web Vitals.

## Matavimo ribos

Auditas atliktas be GA4, Search Console ir realių CrUX lauko duomenų. Todėl jis patikimai vertina techninę būklę bei laboratorinį našumą, bet ne raktažodžių pozicijas, organinį srautą ar realių lankytojų konversijas.
