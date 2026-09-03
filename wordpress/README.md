# KOOPS WordPress versija

Šiame kataloge yra KOOPS headless WordPress turinio valdymo sluoksnis. Viešą
svetainę, dizainą, šriftus, responsive logiką ir GSAP animacijas renderina
`site-prototype` Next.js aplikacija Vercel platformoje.

## Sudėtis

- `wp-content/themes/koops` – ankstesnė PHP temos kopija; ji nebenaudojama kaip
  viešo dizaino šaltinis;
- `wp-content/plugins/koops-core` – turinio tipai, valdymo laukai, bendri
  kontaktai, formos ir pradinių duomenų importas.

Sprendimas sąmoningai nepriklauso nuo „Elementor“ ar mokamų įskiepių. Puslapių
struktūra saugoma kaip pasirinktiniai Gutenberg blokai **KOOPS sekcija**, o
klientas ją tvarko per aiškų **KOOPS → Puslapių sekcijos** modulinį redaktorių.
Next.js struktūrą ir turinį skaito iš `/wp-json/koops/v1/site`. Tai suteikia ACF
Blocks tipo redagavimo patirtį be ACF PRO licencijos ir be priklausomybės nuo
WordPress temos vaizdo.

## Diegimas

1. Įkelti abu katalogus į svetainės `wp-content`.
2. Įjungti įskiepį **KOOPS Core**.
3. Skiltyje **KOOPS → Bendri duomenys** nurodyti viešos Vercel svetainės adresą.
4. Administracijoje atverti **KOOPS → Pradinis paruošimas** ir vieną kartą
   paspausti **Sukurti puslapius ir importuoti parduotuves**.
5. Skiltyje **KOOPS → Puslapių sekcijos** atverti kiekvieną puslapį ir
   patikrinti sugeneruotą sekcijų eilę.
6. Atverti **Nustatymai → Nuolatinės nuorodos** ir paspausti **Išsaugoti**.
7. Skiltyje **KOOPS → Bendri duomenys** patikrinti kontaktus, socialines
   nuorodas ir formų gavėjo el. paštą.
8. Patikrinti, kad `/wp-json/koops/v1/site` grąžina turinį, o viešas WordPress
   adresas nukreipia į Next.js svetainę.

Importas yra kartotinis saugiai: esami įrašai atnaujinami pagal unikalų slug,
o ne dubliuojami.

## Valdomas turinys

- **Puslapių sekcijos** – galima perrikiuoti, išjungti, pašalinti, vėl pridėti ir
  keisti mažąją antraštę, antraštę, aprašymą, pagrindinį mygtuką bei nuotrauką.
  Kiekvienas blokas jau užpildytas dabartiniu svetainės turiniu ir Gutenberg
  drobėje rodo tikrą tos sekcijos vaizdo miniatiūrą. Paspaudus kortelę, po ja
  atsiveria redaguojami laukai. Viešame puslapyje taikomi tik nuo numatytųjų
  reikšmių pakeisti laukai, todėl sudėtingas dizaino žymėjimas ir animacijos
  lieka nepažeisti.

- **Parduotuvės** – adresas, vietovė, darbo laikas, telefonai, koordinatės,
  žemėlapio nuoroda, nuotrauka ir rodymas pradiniame puslapyje.
- **Naujienos** – standartiniai WordPress įrašai su kategorija, santrauka ir
  viršelio nuotrauka.
- **Darbo pasiūlymai** – vieta, darbo krūvis, kandidatavimo nuoroda ir terminas.
- **Skelbimai** – tipas, būsena, vieta, plotas, kaina ir galiojimo data.
- **Restoranas** – puslapio tekstas ir globalūs patvirtinti kontaktai / talpos.
- **KOOPS bendri duomenys** – organizacijos kontaktai, socialiniai tinklai,
  privatumo nuoroda ir formų gavėjas.

## Prieš gamybinį paleidimą

- pakeisti demonstracines naujienas ir darbo pasiūlymus galutiniu turiniu;
- sukelti galutines restorano nuotraukas bei meniu;
- sukonfigūruoti SMTP ir patikrinti visas formas;
- pridėti privatumo politiką ir slapukų valdymą;
- paruošti seno puslapio URL → naujo URL 301 peradresavimus;
- prijungti GA4 / Search Console ir sutikimų režimą;
- sukurti atsarginių kopijų ir atnaujinimų tvarką.
