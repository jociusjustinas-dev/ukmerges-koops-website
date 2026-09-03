# Ukmergės KOOPS svetainės SEO auditas

Audito data: 2026-09-03

Audituota versija: <https://ukmerges-koops-website.vercel.app/>

Domeno kandidatas: <https://ukmergeskoops.lt/> — klientas dar nepatvirtino, todėl
SEO konfigūracijoje jis nenaudojamas.

Kodo būsena audito metu: `92e2816`

## P0 įgyvendinimo būsena

Po audito sutvarkyta visa nuo galutinio domeno ir nepatvirtinto seno turinio
nepriklausanti P0 dalis:

- vienas konfigūruojamas `SITE_URL` su laikinu Vercel adresu;
- savireferenciniai canonical visuose 50 viešų URL;
- veikiantys dinaminiai `robots.txt` ir `sitemap.xml` iš WordPress turinio;
- JSON-LD bei naujienų dalinimosi URL generuojami iš `SITE_URL`;
- `/strategija` turi `noindex, nofollow` ir nėra sitemap;
- pašalinta vidinė 404 nuoroda;
- `/restoranas-vilkmerge` ir `/apie-mus` nuolat peradresuojami į patvirtintus
  naujus taikinius.

Vietinė kontrolinė patikra: 50 URL, 50 atsakymų `200`, 0 vidinių klaidų,
0 trūkstamų canonical, 0 pasikartojančių title ir meta aprašymų. Likę seni URL
neperadresuojami, kol nepatvirtinta, kur turi keliauti jų turinys.

## Apimtis ir metodika

- automatiškai nuskaityti visi iš pagrindinio puslapio pasiekiami vidiniai URL;
- patikrintas serverio HTML, HTTP būsenos, `title`, meta aprašymai, canonical,
  robots signalai, H1, Open Graph, Twitter kortelės, favicon ir JSON-LD;
- atlikti mobilūs „Lighthouse 12.8.2“ matavimai penkiems pagrindiniams
  šablonams;
- peržiūrėtas Next.js kodas, struktūrinių duomenų generavimas ir Mapbox
  inicializavimas;
- peržiūrėtas dabartinės `ukmergeskoops.lt` svetainės sitemap ir viešas
  indeksavimas, kad būtų įvertinta migracijos rizika;
- patikrintas headless WordPress indeksavimo elgesys.

Auditas neatspindi realių paieškos užklausų, pozicijų, paspaudimų ar lauko Core
Web Vitals, nes nėra GA4, Search Console ir CrUX duomenų.

## Verdiktas

Vizualinė ir semantinė bazė gera, tačiau svetainė **dar neparuošta galutinio
domeno paleidimui ir indeksavimui**. Paleidimą blokuoja šešios problemos:

1. Vercel versijoje nėra veikiančių `robots.txt` ir `sitemap.xml`;
2. visuose 50 veikiančių puslapių nėra canonical;
3. JSON-LD naudoja seną `jociusj.chatgpt.site` domeną;
4. pagrindiniame puslapyje yra vidinė nuoroda į 404;
5. vidinis `/strategija` puslapis indeksuojamas;
6. nėra parengto ir patikrinto seno domeno URL → naujo URL 301 plano.

## Nuskaitymo rezultatai

| Rodiklis | Rezultatas |
|---|---:|
| Nuskaityta vidinių URL | 51 |
| Veikiantys `200` puslapiai | 50 |
| Vidiniai `404` | 1 |
| Veikiantys puslapiai su vienu H1 | 50 / 50 |
| Veikiantys puslapiai su `lang="lt"` | 50 / 50 |
| Unikalūs title tarp veikiančių puslapių | 50 / 50 |
| Unikalūs meta aprašymai | 50 / 50 |
| Veikiantys puslapiai su canonical | 0 / 50 |
| Veikiantys puslapiai su `og:image` | 0 / 50 |
| Veikiantys puslapiai su JSON-LD | 45 / 50 |
| HTML rasti `<img>` elementai | 251 |
| `<img>` su `width` ir `height` | 0 / 251 |
| `<img>` su tuščiu `alt` | 111 / 251 |

Tuščias `alt` nėra automatiškai klaida: dekoratyviniams vaizdams jis teisingas.
Naujienų, parduotuvių ir turinio fotografijoms reikia atskiros rankinės peržiūros.

## P0 — būtina ištaisyti prieš paleidimą

### 1. Galutinis domenas ir canonical

`app/layout.tsx` šiuo metu turi:

`metadataBase: https://ukmerges-koops-website.vercel.app`

Visiems 50 veikiantiems URL trūksta savireferencinio canonical. Prieš paleidimą
reikia vieno centrinio `SITE_URL=https://ukmergeskoops.lt` ir absoliutaus
canonical kiekvienam indeksuojamam puslapiui.

Priėmimo kriterijai:

- kiekvienas indeksuojamas URL turi vieną canonical į galutinį domeną;
- canonical, sitemap, Open Graph ir JSON-LD naudoja tą patį protokolą, hostą ir
  URL struktūrą;
- Vercel ir Hostinger techniniai domenai nėra canonical taikiniai;
- `www` arba ne `www` versija pasirinkta viena, kita nuolat peradresuojama 301.

### 2. Robots ir dinaminis sitemap

- `/robots.txt` Vercel versijoje grąžina `404`;
- `/sitemap.xml` Vercel versijoje grąžina `404`.

Sitemap turi būti generuojamas iš dabartinio WordPress turinio, o ne ranka
palaikomo sąrašo. Jame turi būti pagrindiniai puslapiai, 34 parduotuvės,
naujienos, aktyvūs skelbimai ir atskiri galiojantys darbo pasiūlymai.

Neįtraukti `/strategija`, `/api/*`, WordPress techninių URL, 404, peradresuojamų,
`noindex` arba canonical į kitą URL turinčių puslapių. `robots.txt` turi leisti
viešą frontendą ir nurodyti galutinį sitemap URL.

### 3. Vidinis 404

Pagrindiniame puslapyje tebėra nuoroda:

`/naujienos/vietos-pomidorai` → `404`

404 grąžina `noindex`, tačiau paveldi pagrindinio puslapio title ir description.
Pirmiausia reikia pašalinti vidinę nuorodą. Hero naujienos kortelė turi būti
valdoma iš WordPress ir visada rodyti realiai egzistuojantį įrašą; jei įrašų
nėra, vesti į `/naujienos`.

### 4. Neteisingi JSON-LD domenai

Senas koncepcijos domenas
`https://ukmerges-koops-koncepcija.jociusj.chatgpt.site` tebenaudojamas:

- visų 34 parduotuvių `GroceryStore.url`;
- restorano `Restaurant.url`;
- „Apie“ ir kontaktų `Organization.url`.

Naujienų dalinimosi URL atskirai užkoduotas į Vercel domeną. Visus URL reikia
generuoti iš vieno `SITE_URL`.

### 5. Strategijos puslapis indeksuojamas

`/strategija` grąžina `200`, turi title ir H1, bet neturi `noindex` ar canonical.
Reikia:

```ts
robots: { index: false, follow: false }
```

Stipresnis sprendimas — apsaugoti puslapį autentifikacija arba pašalinti iš
produkcinio build. Vien `robots.txt` nėra apsauga nuo indeksavimo.

### 6. 301 migracijos planas

Dabartinis `ukmergeskoops.lt` dar rodo seną WordPress svetainę ir yra
indeksuojamas. Naujo frontendo negalima tiesiog prijungti nepastačius 301.

| Senas URL | Naujas URL / veiksmas |
|---|---|
| `/restoranas-vilkmerge` | `/restoranas` |
| `/apie-mus` | `/apie` |
| `/kontaktai` | `/kontaktai` |
| `/parduotuves` | `/parduotuves` |
| `/naujienos` | `/naujienos` |
| `/skelbimai` | `/skelbimai` |
| `/privatumo-politika` | viena pasirinkta URL versija |
| `/akcijos` | tematiškai artimiausias naujienų / akcijos URL |
| `/rekomendacijos` | išsaugoti turinį naujame puslapyje arba grąžinti 410 |
| `/ukmerges-duona` | naujas turinys arba 301 į patvirtintą išorinį šaltinį |
| `/ukmerges-duona-2` | tas pats galutinis taikinys kaip `/ukmerges-duona` |

Sename sitemap papildomai yra 47 `3d-flip-book` URL, dvi kategorijos,
`/author/admin`, `/author/laurita` ir trys pasikartojantys `/akcijos` įrašai.
Kiekvienam reikia individualaus 301, turinio išsaugojimo arba `410 Gone`.
Masinis visko nukreipimas į pagrindinį puslapį laikytinas minkštu 404.

## P1 — didelė organinio matomumo ir UX įtaka

### Mobilus našumas

| Puslapis | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Dydis |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Pradinis | 69 | 96 | 100 | 100 | 1,2 s | 10,1 s | 20 ms | 0 | 2 301 KiB |
| Parduotuvės | 36 | 100 | 96 | 100 | 4,9 s | 9,3 s | 1 270 ms | 0 | 1 759 KiB |
| Restoranas | 74 | 96 | 100 | 100 | 2,0 s | 5,3 s | 20 ms | 0 | 1 871 KiB |
| Naujienos | 91 | 100 | 100 | 100 | 1,2 s | 3,4 s | 10 ms | 0 | 669 KiB |
| Kontaktai | 87 | 100 | 100 | 100 | 1,7 s | 3,7 s | 20 ms | 0 | 833 KiB |

Geras LCP yra iki 2,5 s. Visi penki matuoti šablonai šios ribos nepasiekia;
pradinis, parduotuvės ir restoranas yra blogoje zonoje.

#### Pradinis

- LCP yra animuojamas H1 žodis „parduotuvės“, ne fotografija;
- įžanginė animacija atideda pagrindinio turinio matomumą;
- galima sutaupyti apie 1,4 MiB pateikiant mobiliam ekranui tinkamus vaizdus;
- apie 1,0 MiB galima sutaupyti moderniais formatais.

H1 turi būti matomas pirmame kadre. Animacija gali judinti jau matomą elementą,
bet negali atidėti jo opacity taip, kad LCP būtų fiksuojamas po 10 sekundžių.

#### Parduotuvės

- Performance `36` ir TBT `1 270 ms` — kritinė šablono problema;
- konsolėje registruojama React hydration klaida `#418`;
- `StoresFinder` serverio būsenoje `isMobile=false`, o pirmoje kliento renderio
  būsenoje skaitomas `window.matchMedia`; tai konkretus galimas neatitikimo
  šaltinis;
- Mapbox importuojamas ir inicializuojamas iš karto;
- apie 339 KiB JavaScript matavimo metu buvo nepanaudota.

Reikia vienodos pradinės serverio ir kliento būsenos, Mapbox įkelti tik
žemėlapiui priartėjus prie viewport arba paspaudus veiksmą, o parduotuvių sąrašą
išlaikyti veikiantį be Mapbox.

#### Restoranas

- LCP `5,3 s`;
- LCP matavimo metu tapo kitos sekcijos H2, todėl hero nėra stabilus pagrindinio
  turinio kandidatas;
- apie 1,87 MiB mobiliai yra per daug;
- reikia mobilių `srcset/sizes`, AVIF/WebP ir vieno prioritetinio hero vaizdo.

#### Naujienos ir kontaktai

- naujienų pirmos kortelės LCP nuotrauka turi `loading="lazy"`; jai reikia
  `priority` / `eager`;
- naujienose galima sutaupyti apie 215 KiB pateikiant tinkamą vaizdo dydį;
- kontaktų LCP yra tekstinio lauko placeholder, todėl viršutinės dalies turinys
  nėra stabilus LCP kandidatas.

### Open Graph ir dalinimasis

- nė vienas iš 50 veikiančių puslapių neturi `og:image`;
- `og:url` nėra;
- Twitter kortelė naudoja `summary`, o reikia `summary_large_image`;
- `/icon.png` veikia ir naudojamas kaip favicon; `/favicon.ico` 404 nėra kritinis.

Reikia bendro 1200 × 630 px vaizdo ir dinaminių naujienų, parduotuvių bei
restorano OG vaizdų.

### Struktūriniai duomenys

Visos svetainės lygiu trūksta `WebSite` + `Organization` grafo su stabiliu
`@id`, galutinio domeno URL, logotipu, kontaktais ir socialiniais profiliais.

**Parduotuvės.** `GroceryStore` yra visuose 34 puslapiuose, bet trūksta teisingo
`url`, stabilaus `@id`, `geo`, `openingHoursSpecification`, `hasMap`, ryšio su
organizacija ir `BreadcrumbList`.

**Restoranas.** Trūksta `image`, `geo`, `openingHoursSpecification`, `hasMap`,
`servesCuisine`, `priceRange` ir ryšio su organizacija. URL klaidingas.

**Naujienos.** `NewsArticle` yra visuose šešiuose straipsniuose, bet trūksta
`mainEntityOfPage`, `author`, `dateModified`, leidėjo `@id`, URL ir logotipo.

**Darbo pasiūlymai.** Dvi `JobPosting` schemos dedamos į bendrą `/karjera`
puslapį. Trūksta `datePosted`, tikslaus `jobLocation`, stabilaus `url` /
`identifier`; nėra `validThrough`. Google rekomenduoja konkretų darbo pasiūlymą
žymėti jo atskirame puslapyje. Dabartinė schema nėra tinkama patikimai „Google
Jobs“ integracijai.

**AEO.** Parduotuvių puslapyje yra penki matomi DUK ir atitinkantis `FAQPage`.
Tai naudinga atsakymų aiškumui, bet svarbesni yra tikslūs vietų faktai,
LocalBusiness schema ir atskiri indeksuojami URL.

## P1 — prieinamumas

„Lighthouse“ nustatė:

- pagrindinio puslapio `.jobs-list` yra `div` su draudžiamu `aria-label` be
  semantinio `role`;
- restorano užklausos skiltyje du tekstai turi 4,42:1 kontrastą, kai reikia bent
  4,5:1;
- datos ir pasirinkimo placeholder kontrastas yra 3,04:1;
- parduotuvių puslapis registruoja React hydration klaidą.

## P2 — turinys ir vietinis SEO

### Kas padaryta gerai

- visi 50 veikiantys puslapiai turi unikalų title, meta description, vieną H1
  ir `lang="lt"`;
- URL trumpi, lietuviški ir logiškai grupuojami;
- 34 parduotuvės turi atskirus serverio HTML puslapius;
- kontaktai, telefonai ir žemėlapių nuorodos nuskaitomi be JavaScript;
- HTTPS, HSTS ir greitas pradinio HTML atsakas veikia;
- CLS visuose penkiuose matavimuose buvo `0`.

### Ploni parduotuvių puslapiai

Parduotuvių detalėse yra tik 43–52 pagrindinio turinio žodžiai. Reikia pridėti
tik patvirtintą informaciją: darbo laiko išimtis, konkrečias paslaugas,
privažiavimą, parkavimą, prieinamumą ir realias fotografijas. Negalima generuoti
išgalvotų paslaugų vien SEO tekstui pailginti.

### Title ir aprašymai

- viena naujienos antraštė yra 67 simbolių;
- naujienų aprašymai dažniausiai 71–89 simbolių;
- dauguma parduotuvių title trumpesni nei 30 simbolių ir neįvardija vietovės.

Rekomenduojamas šablonas:

`KOOPS parduotuvė „Pivonija“, Ukmergė | Darbo laikas`

### NAP ir duomenų nuoseklumas

Viešai indeksuojama sena svetainė dar rodo 35 parduotuves, o patvirtintame
naujos svetainės sąraše yra 34. Ji taip pat rodo restorano adresą `Kauno g. 9`,
o naujoje informacijoje naudojamas `Kauno g. 7`.

Prieš migraciją reikia patvirtinti faktus ir tą pačią informaciją atnaujinti
svetainėje, schemoje, Google Business Profile, Facebook ir kataloguose.

### Skelbimai

`/skelbimai` turi tik 38 pagrindinio turinio žodžius ir neturi aktyvių įrašų.
Kol nėra realaus skelbimo, puslapį reikia papildyti naudinga tuščia būsena arba
laikinai nustatyti `noindex`.

### Vaizdai

Visi 251 HTML vaizdai neturi aiškių `width` ir `height`. Reikia Next Image arba
`srcset`, `sizes`, matmenų ir modernių formatų.

Rankiniu būdu peržiūrėti 111 tuščių `alt`: dekoratyvinius palikti tuščius, o
naujienų, parduotuvių ir turinio fotografijoms įrašyti trumpą kontekstinį
aprašymą be raktažodžių prikimšimo.

## Headless WordPress indeksavimas

WordPress `/wp-json/` teisingai grąžina `X-Robots-Tag: noindex`, o šakninis URL
peradresuojamas į Vercel frontendą. Tačiau `robots.txt` nenuoseklus:

```txt
User-agent: Googlebot
Disallow: /

User-agent: *
Allow: /
```

Google blokuojamas, kiti robotai leidžiami. Techniniame WordPress domene visiems
robotams reikia blokuoti viešų kopijų crawling ir neindeksuojamiems HTML
atsakams grąžinti `X-Robots-Tag: noindex`.

## Analitika ir matavimas

Po galutinio domeno paleidimo:

1. patvirtinti Domain property Google Search Console;
2. pateikti naują sitemap ir patikrinti svarbius URL per URL Inspection;
3. stebėti senų URL 301, 404 ir indeksavimo pokytį bent 8–12 savaičių;
4. prijungti GA4 tik po analitinių slapukų sutikimo;
5. registruoti `store_cta_click`, `store_map_click`, `store_phone_click`,
   `restaurant_enquiry_start`, `restaurant_enquiry_submit`, `job_apply_click`,
   `supplier_form_submit` ir bendrų formų užbaigimą;
6. vėliau sprendimus grįsti Search Console ir realiais 75 procentilio Core Web
   Vitals, ne vien laboratoriniu Lighthouse.

## Rekomenduojama darbų seka

1. Įvesti vieną `SITE_URL` ir sutvarkyti canonical, Open Graph bei JSON-LD URL.
2. Pašalinti vidinį 404 ir nustatyti `/strategija` `noindex` arba apsaugą.
3. Sugeneruoti dinaminį `robots.txt` ir sitemap iš WordPress turinio.
4. Parengti visų seno sitemap URL 301 / 410 lentelę ir ją testuoti.
5. Pašalinti parduotuvių hydration klaidą ir atidėti Mapbox įkėlimą.
6. Optimizuoti vaizdus ir nebeatidėti H1 matomumo animacija.
7. Užbaigti visas struktūrinių duomenų schemas ir atskirus darbo puslapius.
8. Įdėti OG vaizdus, sutvarkyti prasmingus `alt` ir vaizdų matmenis.
9. Ištaisyti ARIA ir kontrasto pažeidimus.
10. Patvirtinti NAP, prijungti domeną, Search Console, sitemap ir stebėseną.

## Paleidimo SEO priėmimo kriterijai

- nėra vidinių 4xx, 5xx, React hydration ar konsolės klaidų;
- visi indeksuojami URL yra galutiniame domene ir turi canonical;
- `robots.txt` ir sitemap grąžina `200`, sitemap turi tik `200`, indeksuojamus
  ir canonical URL;
- `/strategija`, WordPress administravimas ir techninės kopijos neindeksuojami;
- visi seno sitemap URL turi patikrintą 301, 410 arba pagrįstai išsaugotą turinį;
- JSON-LD validuojamas ir faktai sutampa su matomu turiniu;
- parduotuvių TBT neviršija 200 ms laboratoriniame matavime;
- nėra rimtų WCAG A / AA automatinių pažeidimų;
- veikia OG vaizdai ir dalinimosi peržiūros;
- Search Console priima sitemap be masinių `Excluded`, `Duplicate` ar
  `Soft 404` problemų.

## Autoritetingi kriterijų šaltiniai

- Google crawling ir indeksavimas: <https://developers.google.com/search/docs/crawling-indexing>
- Sitemap: <https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap>
- Canonical: <https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls>
- Robots meta: <https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag>
- JobPosting: <https://developers.google.com/search/docs/appearance/structured-data/job-posting>
- Struktūrinių duomenų taisyklės: <https://developers.google.com/search/docs/appearance/structured-data/sd-policies>
- Vaizdų SEO: <https://developers.google.com/search/docs/appearance/google-images>
- Core Web Vitals ribos: <https://web.dev/articles/defining-core-web-vitals-thresholds>
