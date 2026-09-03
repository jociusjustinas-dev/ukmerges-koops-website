# KOOPS WordPress versija

Šiame kataloge yra gamybinei svetainei skirtas WordPress sprendimas. Dabartinė
`site-prototype` koncepcija lieka atskirai kaip dizaino ir elgsenos etalonas.

## Sudėtis

- `wp-content/themes/koops` – pasirinktinė KOOPS tema;
- `wp-content/plugins/koops-core` – turinio tipai, valdymo laukai, bendri
  kontaktai, formos ir pradinių duomenų importas.

Sprendimas sąmoningai nepriklauso nuo „Elementor“ ar mokamų įskiepių. Turinys
valdomas standartiniame WordPress redaktoriuje ir aiškiuose KOOPS laukeliuose.
Jei vėliau bus ACF Pro licencija, laukus galima perkelti nekeičiant duomenų
modelio ar temos šablonų.

## Diegimas

1. Įkelti abu katalogus į svetainės `wp-content`.
2. Įjungti įskiepį **KOOPS Core**.
3. Įjungti temą **KOOPS**.
4. Administracijoje atverti **KOOPS → Pradinis paruošimas** ir vieną kartą
   paspausti **Sukurti puslapius ir importuoti parduotuves**.
5. Atverti **Nustatymai → Nuolatinės nuorodos** ir paspausti **Išsaugoti**.
6. Skiltyje **KOOPS → Bendri duomenys** patikrinti kontaktus, socialines
   nuorodas ir formų gavėjo el. paštą.
7. Skiltyje **Išvaizda → Meniu** priskirti pagrindinį meniu.

Importas yra kartotinis saugiai: esami įrašai atnaujinami pagal unikalų slug,
o ne dubliuojami.

## Valdomas turinys

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

