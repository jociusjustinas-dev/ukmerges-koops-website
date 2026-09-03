import type { Metadata } from "next";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { getKoopsCmsData } from "../../lib/wordpress";

export const metadata: Metadata = {
  title: "Privatumas ir slapukai | KOOPS",
  description: "Informacija apie KOOPS svetainėje naudojamus slapukus, jų paskirtį ir lankytojo pasirinkimų valdymą.",
};

export default async function PrivacyPage() {
  const { options } = await getKoopsCmsData();
  const legalName = options.legal_name || "Ukmergės rajono vartotojų kooperatyvas";
  const email = options.email || "direktore@urvk.lt";
  const address = options.address || "Kauno g. 17, LT-20130 Ukmergė";

  return (
    <div className="site-shell privacy-page" id="pradzia">
      <a className="skip-link" href="#turinys">Pereiti prie turinio</a>
      <SiteHeader variant="solid" />
      <main id="turinys">
        <section className="privacy-hero" aria-labelledby="privacy-title">
          <div className="tt-container privacy-hero-inner">
            <p className="section-label light-label">PRIVATUMAS</p>
            <h1 id="privacy-title">Jūsų pasirinkimas.<br />Aiškiai ir paprastai.</h1>
            <p>Čia paaiškiname, kokias technologijas naudojame svetainėje ir kaip galite valdyti savo sutikimą.</p>
          </div>
        </section>

        <section className="privacy-content" aria-label="Privatumo ir slapukų informacija">
          <div className="tt-container privacy-layout">
            <aside className="privacy-summary">
              <p className="section-label">TRUMPAI</p>
              <p>Nebūtinieji slapukai neįjungiami, kol nepasirenkate jų leisti. Sutikimą bet kada galima pakeisti poraštėje.</p>
            </aside>
            <div className="privacy-sections">
              <article>
                <span>01</span>
                <div><h2>Kas valdo duomenis</h2><p>{legalName}, {address}. Klausimus galite siųsti adresu <a href={`mailto:${email}`}>{email}</a>.</p></div>
              </article>
              <article>
                <span>02</span>
                <div><h2>Kokius slapukus naudojame</h2><p>Būtinieji slapukai reikalingi svetainės veikimui ir jūsų pasirinkimui įsiminti. Statistikos bei rinkodaros priemonės gali veikti tik gavus atskirą sutikimą.</p></div>
              </article>
              <article>
                <span>03</span>
                <div>
                  <h2>Šiuo metu saugomas pasirinkimas</h2>
                  <div className="cookie-table-wrap">
                    <table className="cookie-table">
                      <thead><tr><th>Pavadinimas</th><th>Paskirtis</th><th>Trukmė</th><th>Kategorija</th></tr></thead>
                      <tbody><tr><td>koops_consent</td><td>Išsaugo jūsų slapukų pasirinkimą.</td><td>6 mėnesiai</td><td>Būtinasis</td></tr></tbody>
                    </table>
                  </div>
                  <p className="privacy-note">Šiuo metu svetainėje nėra įjungtų statistikos ar rinkodaros sekimo priemonių. Jas prijungus, šis sąrašas turi būti atnaujintas.</p>
                </div>
              </article>
              <article>
                <span>04</span>
                <div><h2>Kaip pakeisti pasirinkimą</h2><p>Poraštėje pasirinkite „Slapukų nustatymai“. Sutikimą atšaukti yra taip pat paprasta, kaip jį duoti. Atnaujinus sutikimų sistemą arba praėjus 6 mėnesiams pasirinkimo paprašysime iš naujo.</p></div>
              </article>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter showCta={false} />
    </div>
  );
}
