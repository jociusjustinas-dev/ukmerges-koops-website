# Ukmergės KOOPS – projekto kontekstas

Šis dokumentas skirtas kitam AI ar kūrėjui, kuris tęs KOOPS svetainės koncepciją. Prieš keičiant dizainą ar kodą perskaityk visą dokumentą ir peržiūrėk dabartinį puslapį mobiliajame bei desktop režime.

## Projektas

- Organizacija: Ukmergės rajono vartotojų kooperatyvas (KOOPS).
- Dabartinis tikslas: sukurti šiuolaikišką, klientui pristatomą svetainės koncepciją ir vėliau perkelti ją į WordPress.
- Gyva koncepcija: `https://ukmerges-koops-koncepcija.jociusj.chatgpt.site`
- Strategijos puslapis: `https://ukmerges-koops-koncepcija.jociusj.chatgpt.site/strategija`
- GitHub: `https://github.com/jociusjustinas-dev/ukmerges-koops-website` (privatus).
- Sprendimų priėmėjas / kontaktas: Laurynas.

Kliento pateikti turinio šaltiniai yra `PRADINIS PUSLAPIS.docx` ir `Pard. saras.tinklapiui.xlsx`. Pagal juos patvirtinti parduotuvių duomenys, bendrieji kontaktai ir pagrindinė restorano informacija jau perkelti į kodą. Darbo skelbimai ir naujienų įrašai tebėra demonstraciniai, kol klientas pateiks galutinį turinį.

## Verslo prioritetai

Puslapis turi padėti lankytojui:

1. Rasti artimiausią parduotuvę (pagrindinis prioritetas).
2. Rasti ir susisiekti su restoranu „Vilkmergė“.
3. Rasti darbo pasiūlymus ir kandidatuoti.
4. Pasiūlyti produkciją kaip tiekėjui.

Kiekvienas pagrindinis puslapio blokas turi vesti į vieną aiškų veiksmą. Neperkrauti navigacijos, CTA ar teksto. Vartotojas neturi spėlioti, kur rasti adresą, darbo laiką, maršrutą, kontaktą ar formą.

## Strateginė kryptis

### Pagrindinės auditorijos

- **Pirkėjas:** nori greitai rasti adresą, darbo laiką, maršrutą ir aktualias naujienas.
- **Restorano klientas:** ieško vietos renginiui, salių, talpos, kainos / užklausos kelio ir tiesioginio kontakto.
- **Kandidatas:** nori aiškiai matyti darbo pasiūlymą, vietą ir paprastą kandidatavimo veiksmą.
- **Tiekėjas:** nori suprasti, ką pateikti, kam rašyti ir kas vyks po užklausos.

### Informacinė architektūra

Numatyti pagrindiniai puslapiai:

- Pradinis
- Parduotuvės
- Naujienos ir akcijos
- Restoranas „Vilkmergė“
- Karjera
- Tiekėjams
- Apie KOOPS
- Kontaktai / privatumo politika

Paleidžiant naują struktūrą reikia paruošti seno puslapio URL → naujo URL `301` peradresavimų lentelę. Tai dar nėra padaryta, nes galutinė struktūra ir turinys dar nepatvirtinti.

### SEO, AEO ir accessibility principai

- Vienas aiškus `H1` kiekviename puslapyje; tolesnė antraščių hierarchija be šuolių.
- Parduotuvėms: atskiri indeksuojami įrašai / puslapiai su adresu, darbo laiku, telefonu, žemėlapio nuoroda ir paslaugomis.
- Schema vėlesniam WordPress etapui: `Organization`, `LocalBusiness`, `Restaurant`, `JobPosting`, `FAQPage`.
- AEO: trumpi, konkretūs atsakymai į „kur?“, „kada?“, „kam?“ ir „kaip susisiekti?“ klausimus.
- WCAG 2.2: nepasikliauti vien spalva, išlaikyti aiškius focus states, pakankamą kontrastą, klaviatūros navigaciją, semantiškus mygtukus ir prasmingus `alt` tekstus.

## Dizaino sistema

### Charakteris

Vizualinė kryptis remiasi BYQ `Terra Tory` kompozicijos nuotaika, bet nėra aklas temos kopijavimas. KOOPS turi atrodyti šiltai, vietiškai, šiuolaikiškai ir užtikrintai.

- Daug balto / šviesaus oro, didelė tipografija, organiškai apvalinti kampai.
- Tamsi samanų žalia naudojama stipriems fonams ir CTA sekcijoms.
- Medaus geltona yra pagrindinis akcentas ir primary CTA spalva.
- Švelni žalia naudojama antriniams blokams.
- Nepaversti visų sekcijų iliustruotomis ar pilnomis fotografijų: nuotraukos turi būti tik ten, kur jos padeda suprasti pasiūlymą.
- CTA mygtukai yra pilnai apvalinti ir turi vieningą sklandų „rolling label“ hover veikimą. Paprasti tekstiniai CTA neturi turėti pabraukimo; rodyklė hover metu juda į dešinę.

### Tokenai (`app/globals.css`)

- `--color-midnight-moss: #15190d`
- `--color-honey-pollen: #f6d987`
- `--color-sprout-green: #aedcb9`
- `--color-bone-canvas: #eaece4`
- `--color-linen-white: #ffffff`
- `--radius-card: 16px`
- `--radius-button: 32px`
- Pagrindinis šriftas: `LT Superior` su `Inter Variable` fallback.

Nekeisti spalvų ar šriftų fragmentiškai. Jei reikia naujos būsenos, pirmiausia pridėk tokeną.

### Responsive taisyklės

- Mobilus dizainas nėra sumažintas desktop. Hero, navigacija, CTA ir kortelės turi atskirą mobilią hierarchiją.
- Mobile header turi lygiuotis su turinio `padding`, būti aiškus ir neturi šokinėti tarp default / sticky / menu būsenų.
- Mobile menu atsidaro nuo header apačios per visą plotį, su dideliais paspaudžiamais elementais, kontaktais ir socialiniais kanalais apačioje.
- Pagrindiniai mobile `H2` turi turėti pakankamą line-height ir neturi overflowinti į dešinę.
- Formose naudoti aiškius placeholder pavyzdžius; privacy checkbox turi būti mažas, vertikaliai sulygiuotas su tekstu, o privatumo politika – nuoroda tame pačiame sakinyje.

## Pradinio puslapio struktūra

1. **Hero** – pagrindinė pažado žinutė ir CTA „Rasti parduotuvę“; naujienos / aktualumo kortelė dešinėje desktop ir žemiau hero turinio mobile.
2. **Bento keliai** – parduotuvės, karjera, tiekėjai ir restoranas; trumpas kelias į svarbiausius veiksmus.
3. **Parduotuvių sekcija** – antraštė su animuojama linija, slenkamos parduotuvių kortelės, navigacijos taškai ir „Visos parduotuvės“ CTA.
4. **Naujienos** – tik pirmoji kortelė turi cover nuotrauką; kitos yra tekstinės.
5. **Restoranas** – turinys ir nuotraukų slideris; CTA „Apie restoraną“ yra primary, „Skambinti“ – secondary.
6. **Karjera** – minimalus pristatymas ir sticky darbo skelbimų sąrašas desktop.
7. **Apie KOOPS / vietos žmonėms, vietos verslui** – informacinis blokas su ikoninėmis kortelėmis, ne su atsitiktinėmis fotografijomis.
8. **Kontaktų / tiekėjų forma** – aiški, prieinama, su privatumo sutikimu.
9. **Footer CTA + footer** – tamsus CTA, trumpas footer, logotipas, navigacija, kontaktai ir Facebook / Instagram.

## Animacijos

- Naudojami `GSAP` ir `Lenis`; jų neišimti neįvertinus poveikio bendrai sąveikai.
- Hero antraštės linija po nedidelio delay išsiskleidžia ir subtiliai pastumia tekstą. Ta pati logika naudojama ten, kur antraštėje yra brūkšnys.
- Scroll įspūdis turi būti santūrus, ne „showreel“. Animacijos negali trikdyti skaitymo ar fokuso.
- Visada palaikyti `prefers-reduced-motion` elgseną naujoms animacijoms.

## Svarbi neišspręsta vieta: parduotuvių karuselė

Vartotojas aiškiai reikalauja, kad **parduotuvės karuselė išlaikytų `tt-container` kairį padding, bet neturėtų jokio dešinio padding iki viewport krašto**. Trečia / paskutinė matoma kortelė turi eiti iki pat dešinio ekrano krašto ir neturi būti nukirsta.

Aktualios taisyklės yra `app/globals.css` prie `.location-carousel`, `.location-grid`, `.location-card` ir jų `max-width: 767px` / `max-width: 479px` override'ų. Ši sritis kelis kartus taisyta ir ją būtina tikrinti realiame browseryje skirtinguose viewportuose, o ne vien pagal CSS skaičiavimą.

Tikslinis principas:

- `.tt-container` paliekamas su bendru `padding-inline` visoms kitoms sekcijos dalims.
- tik `.location-carousel` gali „bleed“ per **dešinį** container padding;
- kairysis kortelių kraštas lieka sulygiuotas su antrašte;
- horizontalus overflow yra sąmoningas ir turi veikti touch / drag būdu;
- nekurti papildomo dešinio `padding-right` slinkimo gale.

Prieš sakant, kad pataisyta, padaryk screenshot arba inspect realias `getBoundingClientRect()` reikšmes ir patikrink: `carousel.right === viewport width`.

## Failų žemėlapis

- `app/page.tsx` – serverinis pradinio puslapio duomenų sluoksnis.
- `components/HomePage.tsx` – pradinio puslapio UI, state ir animacijų logika.
- `app/globals.css` – didžioji dizaino sistema ir responsive stiliai.
- `app/strategija/page.tsx` – klientui skirtas strategijos pristatymo puslapis.
- `components/SmoothScroll.tsx` – Lenis scroll inicializacija.
- `components/sections/` – išskirtos bento / feature sekcijos.
- `public/` – logo ir nuotraukos. Hero nekeisti be aiškaus vartotojo prašymo.
- `.openai/hosting.json` – Sites projekto identifikatorius. Nekeisti ir nekurti naujo Sites projekto.
- `wordpress/` – headless WordPress turinio valdymo sluoksnis. Įskiepis
  `wp-content/plugins/koops-core` teikia duomenis Next.js svetainei.

## WordPress architektūra

- Vienintelis viešo frontendo, dizaino, responsive elgsenos ir animacijų
  šaltinis yra Next.js aplikacija, publikuojama Vercel. Nekurti antros dizaino
  kopijos PHP temoje.
- WordPress naudojamas headless režimu tik turiniui valdyti. Viešas WordPress
  adresas peradresuoja į `frontend_url`, o `/wp-admin/` ir `/wp-json/` lieka
  pasiekiami.
- Next.js turinį gauna iš `/wp-json/koops/v1/site`; integracijos ir atsarginiai
  statiniai duomenys yra `lib/wordpress.ts`.
- Puslapių struktūra valdoma Gutenberg bloku `koops/section`. Administracijoje
  ji pasiekiama per **KOOPS → Puslapių sekcijos**. Bloko seka valdo sekcijų
  eiliškumą, `enabled` – matomumą. Visi blokai iš anksto užpildyti dabartiniu
  viešos svetainės turiniu ir Gutenberg drobėje turi tikrą sekcijos vaizdo
  miniatiūrą. Laukas laikomas turinio pakeitimu tik tada, kai jo reikšmė skiriasi
  nuo numatytosios; REST atsakyme tokie laukai grąžinami `overrides` masyve.
  Taip numatytasis WordPress turinys matomas redaktoriuje, bet nepažeidžia
  sudėtingo React žymėjimo ir animacijų.
- ACF PRO serveryje neįdiegtas. Dabartinis pasirinktinio Gutenberg bloko
  sprendimas suteikia tą pačią sekcijų ir laukų redagavimo logiką be mokamos
  priklausomybės; nekeisti jo į ACF be licencijos ir migracijos plano.
- `koops_store`, `koops_classified` ir `koops_job` yra atskiri vieši turinio
  tipai su REST API palaikymu. Naujienoms naudojami standartiniai WordPress
  įrašai.
- Bendri kontaktai, socialinės nuorodos ir patvirtinti restorano duomenys
  saugomi vienoje `koops_options` parinktyje ir redaguojami per
  **KOOPS → Bendri duomenys**. Nedubliuoti šių reikšmių šablonuose.
- Patvirtintos 34 parduotuvės saugomos `koops-core/data/stores.json`. Pradinis
  importas paleidžiamas administracijoje per **KOOPS → Pradinis paruošimas**;
  jis gali būti kartojamas, nes įrašus atnaujina pagal slug.
- Turinys redaguojamas Gutenberg redaktoriuje ir native KOOPS laukeliuose.
  Tema neturi mokamos ACF Pro priklausomybės. Jei ACF Pro bus naudojamas
  vėliau, laukų raktus ir esamą duomenų modelį išlaikyti.
- Sekcijų miniatiūros saugomos
  `wp-content/plugins/koops-core/assets/previews/`; kiekvienas registruotas
  sekcijos tipas privalo turėti tokio paties slug pavadinimo `.jpg` failą.
- Formos siunčiamos per `wp_mail`; prieš gamybinį paleidimą būtina prijungti
  SMTP, patikrinti pristatymą ir privatumo sutikimą.
- WordPress paketo diegimo bei paleidimo eiga aprašyta `wordpress/README.md`.

## Turinio būsena ir patvirtinti duomenys

Patvirtinta pagal kliento failus:

- 34 parduotuvės; adresai, telefonai ir darbo laikas saugomi `lib/stores.ts`;
- bendras telefonas `0 340 53235`, administracija `0 340 51049`, el. paštas `direktore@urvk.lt`;
- bendras adresas `Vasario 16-osios g. 30, LT-20130 Ukmergė` papildomai patikrintas senoje oficialioje svetainėje;
- restoranas „Vilkmergė“: `Kauno g. 7, Ukmergė`, `0 340 52079`, `+370 618 72548`, `restoranas@urvk.lt`;
- restoranas veikia nuo 1965 m., turi 3 erdves ir priima iki 154 svečių; Didžioji salė — iki 90, baras — iki 40, mažoji salė — iki 8;
- parduotuvė „Pušelė“ priskirta miesto grupei;
- parduotuvių specifinės paslaugos kliento sąraše nepateiktos, todėl jų negalima rodyti kaip patvirtinto fakto.

Dar neturime:

- galutinių darbo pasiūlymų;
- galutinių naujienų įrašų;
- galutinio restorano meniu ir visų nuotraukų;
- GA4 / Search Console prieigų ir istorinių duomenų;
- vartotojų interviu / apklausų;
- galutinės redirect'ų lentelės;
- formaliai patvirtintos brand tono ir spalvų sistemos.

Tai nėra priežastis stabdyti UX/UI struktūrą. Naudoti aiškius demonstracinius duomenis, bet neklaidinti, kad jie patvirtinti.

## Matuojamas augimas

Kai GA4 bus prijungtas, pirmi eventai turi būti:

- `store_cta_click`, `store_map_click`, `store_phone_click`;
- `restaurant_enquiry_start`, `restaurant_phone_click`;
- `job_apply_click`;
- `supplier_form_start`, `supplier_form_submit`;
- `footer_cta_click`.

Pirmos testavimo hipotezės:

- aiškesnis „Rasti parduotuvę“ CTA didina CTA CTR ir žemėlapio paspaudimus;
- darbo pasiūlymų skaičius / vieta šalia karjeros CTA didina kandidatavimo pradžią;
- tiekėjo formos trumpinimas mažina formos abandono rodiklį;
- restoranui skambučio CTA šalia užklausos didina kontaktų skaičių.

Kol analitikos nėra, tikrinama pagal veikiančias nuorodas, formos užbaigimą, responsive kokybę, accessibility bazę ir Lauryno / komandos peržiūrą.

## Darbo ir publikavimo eiga

1. Prieš pakeitimą perskaityk susijusį komponentą ir CSS; nekurk atsitiktinių override'ų.
2. Redagavimui naudok `apply_patch`.
3. Patikrink: `npm run build`; jei vietinis vinext runtime sugadintas, naudok
   Vercel produkcinį build ir jo klaidų išvestį kaip galutinę patikrą.
4. Lokalius pakeitimus committink su trumpa, aiškia žinute.
5. GitHub `origin` yra `jociusjustinas-dev/ukmerges-koops-website`.
6. Produkcinis frontendas publikuojamas į esamą Vercel projektą `ukmerges-koops-website`; nekurk naujo Vercel projekto.
7. WordPress įskiepio pakeitimams paleisk `wordpress/package.sh`, įkelk
   `wordpress/dist/koops-core.zip` ir patikrink REST atsakymą.
8. Kiekvieną publikavimą patikrink, kol deployment status yra `succeeded`.

## Bendravimas su naudotoju

- Rašyti lietuviškai, trumpai ir konkrečiai.
- Nekalbėti apie atliktą pakeitimą, jei jis nepatikrintas.
- Jeigu vartotojas pakartotinai sako, kad pakeitimo nemato, nebandyti aklai didinti skaičių. Pirmiausia patikrinti browseryje tikrą layout ir nustatyti šaltinį.
- Nekurti naujų sekcijų ar fotografijų, jei vartotojas prašo tik korekcijos.
- Naudoti vieną stipriausią rekomendaciją, ne kelis lygiaverčius variantus.
