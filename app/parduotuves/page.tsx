import type { Metadata } from "next";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { StoresFinder } from "../../components/StoresFinder";
import { StoresPageMotion } from "../../components/StoresPageMotion";
import { getKoopsCmsData } from "../../lib/wordpress";

export const metadata: Metadata = {
  title: "Parduotuvės | KOOPS Ukmergėje ir rajone",
  description: "Raskite artimiausią KOOPS parduotuvę: adresą, darbo laiką, telefoną ir maršrutą Ukmergėje bei rajone.",
};

const faqs = [
  {
    question: "Kur rasti artimiausią KOOPS parduotuvę?",
    answer: "Sąraše arba žemėlapyje pasirinkite vietą. Ukmergės miestą ir rajoną galima atskirti filtru.",
  },
  {
    question: "Ar visos parduotuvės dirba vienodu laiku?",
    answer: "Ne. Mieste dažniausiai dirbama iki 20 val., dalis kaimo parduotuvių sekmadieniais nedirba. Laikas nurodytas prie kiekvienos vietos.",
  },
  {
    question: "Kaip gauti kelią iki parduotuvės?",
    answer: "Kortelėje spauskite „Rodyti žemėlapyje“ — žemėlapis dešinėje priartins pasirinktą parduotuvę.",
  },
  {
    question: "Kaip paskambinti pasirinktai parduotuvei?",
    answer: "Telefonas rodomas kortelėje ir greitoje peržiūroje. Spauskite numerį — skambutis prasidės iš karto.",
  },
  {
    question: "Ar KOOPS parduotuvės yra tik Ukmergės mieste?",
    answer: "Ne. Tinklas apima Ukmergę ir rajoną — kaimus bei miestelius. Sąraše naudokite filtrą „Ukmergė“ arba „Rajonas“.",
  },
];

export default async function StoresPage() {
  const { stores } = await getKoopsCmsData();
  return (
    <div className="site-shell stores-page" id="pradzia">
      <a className="skip-link" href="#turinys">Pereiti prie turinio</a>
      <SiteHeader />
      <StoresPageMotion />

      <main id="turinys">
        <section className="stores-directory" id="sarasas" aria-labelledby="stores-list-title">
          <div className="tt-container">
            <p className="section-label light-label">PARDUOTUVĖS</p>
            <h1 className="location-headline" id="stores-list-title">
              <span>Raskite</span>
              <span>artimiausią</span>
              <i className="title-push-line" style={{ width: 0 }} aria-hidden="true" />
              <span>KOOPS</span>
              <span>parduotuvę</span>
            </h1>
            <p className="stores-directory-lead">{stores.length} parduotuvės Ukmergėje ir rajone.</p>
            <StoresFinder stores={stores} />
          </div>
        </section>

        <section className="stores-faq" aria-labelledby="stores-faq-title">
          <div className="tt-container stores-faq-layout">
            <div>
              <p className="section-label">GREITI ATSAKYMAI</p>
              <h2 id="stores-faq-title">Kur, kada ir kaip — be spėliojimo.</h2>
            </div>
            <div className="stores-faq-list">
              {faqs.map((item, index) => (
                <details key={item.question} open={index === 0 ? true : undefined}>
                  <summary>
                    <span>{item.question}</span>
                    <span className="stores-faq-toggle" aria-hidden="true" />
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => (
          {
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          }
        )),
      }) }} />
      <SiteFooter
        ctaHref="/restoranas"
        ctaLabel="Apie restoraną"
        ctaAriaLabel="Apie restoraną Vilkmergė"
        ctaTitleDesktop={["Stalui ir šventei —", "restoranas Vilkmergė"]}
        ctaTitleMobile={["Stalui ir šventei —", "restoranas", "Vilkmergė"]}
      />
    </div>
  );
}
