"use client";

import * as React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";
import { KoopsBentoSection } from "../components/sections/KoopsBentoSection";
import { KoopsValueFeaturesSection } from "../components/sections/KoopsValueFeaturesSection";
import { featuredStores } from "../lib/stores";
import { featuredNews, newsHref } from "../lib/news";
import { jobs } from "../lib/jobs";
import { AvenirButtonArrow, ByqChevron } from "./byq-icons";
import { SupplierForm } from "../components/SupplierForm";
import { revealIntroImmediately, withIntroFallback } from "../lib/motionIntro";

const heroUpdates = [
  {
    label: "NAUJIENOS",
    title: "Švieži vietos pomidorai – sezono pradžia",
    image: "/local-produce-tomatoes.jpg",
    href: "/naujienos/vietos-pomidorai",
  },
  {
    label: "RESTORANAS",
    title: "Planuojate šventę „Vilkmergėje“?",
    image: "/vilkmerge.jpg",
    href: "/restoranas",
  },
  {
    label: "KARJERA",
    title: "Nauji darbo pasiūlymai Ukmergėje",
    image: "/local-produce-customer.jpg",
    href: "/karjera",
  },
];

const restaurantSlides = [
  { src: "/vilkmerge.jpg", alt: "Restorano „Vilkmergė“ lauko erdvė" },
  { src: "/vilkmerge-hall.jpg", alt: "Šventei paruošta restorano „Vilkmergė“ pokylių salė" },
  { src: "/vilkmerge-table.jpg", alt: "Šventiškai serviruotas restorano stalas" },
  { src: "/vilkmerge-menu.jpg", alt: "Restorano „Vilkmergė“ ruošiami užkandžiai" },
];

const socialLinks = [
  { label: "Facebook", icon: FaFacebookF, href: "https://www.facebook.com/ukmergeskoops" },
  // Pakeisti, jei klientas pateiks kitą oficialų „Instagram“ paskyros adresą.
  { label: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/ukmergeskoops/" },
];

function RollingLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="avenir-button-inner">
      <span className="avenir-icon-wrap" aria-hidden="true">
        <span className="avenir-button-icon"><AvenirButtonArrow /></span>
      </span>
      <span className="avenir-button-text">{children}</span>
    </span>
  );
}

export default function Home() {
  const [heroUpdateIndex, setHeroUpdateIndex] = React.useState(0);
  const [heroUpdatesPaused, setHeroUpdatesPaused] = React.useState(false);
  const [restaurantSlide, setRestaurantSlide] = React.useState(0);
  const [locationSlide, setLocationSlide] = React.useState(0);
  const pageRef = React.useRef<HTMLDivElement>(null);
  const heroLineRef = React.useRef<HTMLElement>(null);
  const locationCarouselRef = React.useRef<HTMLDivElement>(null);

  const showLocationSlide = (index: number) => {
    const track = locationCarouselRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(`[data-location-index="${index}"]`);
    if (!card) return;
    const left = card.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    track.scrollTo({ left, behavior: "smooth" });
    setLocationSlide(index);
  };

  const handleLocationScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const track = event.currentTarget;
    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-location-index]"));
    const nearest = cards.reduce((closest, card, index) => {
      const left = card.getBoundingClientRect().left - track.getBoundingClientRect().left;
      const closestLeft = cards[closest].getBoundingClientRect().left - track.getBoundingClientRect().left;
      return Math.abs(left) < Math.abs(closestLeft) ? index : closest;
    }, 0);
    setLocationSlide(nearest);
  };

  React.useEffect(() => {
    const root = pageRef.current;
    const line = heroLineRef.current;
    if (!root || !line) return;

    let cancelled = false;
    let revertAnimation = () => {};

    void Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const media = gsap.matchMedia();

      media.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, isMobile, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduceMotion: boolean;
          };
          const titlePushLines = root.querySelectorAll<HTMLElement>(".title-push-line");
          const floatingNav = root.querySelector<HTMLElement>(".floating-nav");

          if (floatingNav) {
            const showNavFill = () => floatingNav.classList.add("is-scrolled");
            const hideNavFill = () => floatingNav.classList.remove("is-scrolled");

            ScrollTrigger.create({
              start: 32,
              end: "max",
              onEnter: showNavFill,
              onEnterBack: showNavFill,
              onLeave: showNavFill,
              onLeaveBack: hideNavFill,
              onRefresh: () => floatingNav.classList.toggle("is-scrolled", window.scrollY > 32),
            });
          }

          if (isDesktop) {
            const footer = root.querySelector<HTMLElement>(".tt-footer");
            const footerCta = root.querySelector<HTMLElement>(".footer-cta");
            const footerReveal = root.querySelector<HTMLElement>(".footer-reveal");

            if (footer && footerCta && footerReveal) {
              const showFooterReveal = () => footerReveal.classList.add("is-revealed");
              const hideFooterReveal = () => footerReveal.classList.remove("is-revealed");

              ScrollTrigger.create({
                trigger: footerCta,
                start: "bottom bottom",
                end: "max",
                onEnter: showFooterReveal,
                onEnterBack: showFooterReveal,
                onLeave: showFooterReveal,
                onLeaveBack: hideFooterReveal,
                onRefresh: (self) => {
                  footerReveal.classList.toggle("is-revealed", window.scrollY >= self.start);
                },
              });
            }
          }

          if (reduceMotion) {
            titlePushLines.forEach((pushLine) => pushLine.style.removeProperty("width"));
            const hero = root.querySelector<HTMLElement>(".tt-hero");
            if (hero) revealIntroImmediately(hero);
            return;
          }

          const hero = root.querySelector<HTMLElement>(".tt-hero");
          const clearHeroFallback = hero ? withIntroFallback(hero) : () => {};
          clearHeroFallback();

          const heroLabel = root.querySelector<HTMLElement>(".tt-hero-top > .section-label");
          const heroWords = root.querySelectorAll<HTMLElement>(".tt-hero-top h1 > span:not(.hero-title-break)");
          const heroBody = root.querySelector<HTMLElement>(".tt-hero-top > .body-large");
          const heroCta = root.querySelector<HTMLElement>(".tt-hero-top > .pill-button");
          const heroCard = root.querySelector<HTMLElement>(".hero-update-card");
          const line = heroLineRef.current;

          if (line) {
            line.style.removeProperty("width");
          }
          const targetWidth = line?.getBoundingClientRect().width ?? 0;
          if (line) line.style.width = "0px";

          const heroTimeline = gsap.timeline({
            defaults: { duration: 0.8, ease: "power3.out" },
          });

          if (heroLabel) {
            heroTimeline.fromTo(heroLabel, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.08);
          }

          heroTimeline.fromTo(
            heroWords,
            { y: isMobile ? 24 : 42, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.07 },
            0.16,
          );

          if (line && isDesktop && window.innerWidth > 1100 && targetWidth) {
            heroTimeline.to(
              line,
              {
                width: targetWidth,
                duration: 0.82,
                ease: "power3.inOut",
                clearProps: "width",
              },
              0.68,
            );
          } else if (line) {
            line.style.removeProperty("width");
          }

          if (heroBody) {
            heroTimeline.fromTo(heroBody, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.5);
          }

          if (heroCta) {
            heroTimeline.fromTo(heroCta, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.6);
          }

          if (heroCard) {
            heroTimeline.fromTo(
              heroCard,
              { x: isDesktop ? 28 : 0, y: isMobile ? 18 : 0, autoAlpha: 0 },
              { x: 0, y: 0, autoAlpha: 1 },
              0.72,
            );
          }

          const revealSections = [
            {
              trigger: ".koops-bento-section",
              divider: ".koops-bento-header > .dashed-divider",
              headings: ".koops-bento-header > :not(.dashed-divider)",
              items: ".koops-bento-grid > *",
            },
            {
              trigger: ".tt-locations",
              headings: ".location-headline > :not(.title-push-line)",
              pushLine: ".location-headline > .title-push-line",
              items: ".location-grid > *, .section-cta",
            },
            {
              trigger: ".tt-news",
              divider: ".tt-section-header > .dashed-divider",
              headings: ".tt-section-header > :not(.dashed-divider)",
              items: ".news-bento > *",
            },
            {
              trigger: ".tt-story",
              headings: ".story-headline > *",
              items: ".story-grid > *",
            },
            {
              trigger: ".tt-jobs",
              headings: ".jobs-intro > *",
              items: ".job-row",
            },
            {
              trigger: ".tt-about",
              headings: ".about-marquee-header > *",
              items: ".about-marquee",
            },
            {
              trigger: ".tt-contact",
              headings: ".contact-heading > *",
              items: ".contact-details, .supplier-form, .contact-image",
            },
            {
              trigger: ".footer-cta",
              headings: ".footer-cta > :not(.orbit)",
              items: "",
            },
            {
              trigger: ".footer-content",
              headings: ".footer-grid > *",
              items: ".footer-bottom",
            },
          ];

          revealSections.forEach(({ trigger, divider, headings, pushLine, items }) => {
            const section = root.querySelector<HTMLElement>(trigger);
            if (!section) return;

            const dividerElements = divider ? section.querySelectorAll<HTMLElement>(divider) : [];
            const headingElements = section.querySelectorAll<HTMLElement>(headings);
            const pushLineElements = pushLine
              ? Array.from(section.querySelectorAll<HTMLElement>(pushLine))
              : [];
            const pushLineTargets = pushLineElements.map((pushLineElement) => {
              pushLineElement.style.removeProperty("width");
              const width = pushLineElement.getBoundingClientRect().width;
              pushLineElement.style.width = "0px";
              return { element: pushLineElement, width };
            });
            const itemElements = items ? section.querySelectorAll<HTMLElement>(items) : [];
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: isMobile ? "top 88%" : "top 82%",
                once: true,
              },
              defaults: { ease: "power3.out" },
            });

            if (dividerElements.length) {
              timeline.fromTo(
                dividerElements,
                { scaleX: 0, transformOrigin: "left center" },
                { scaleX: 1, duration: 0.72, ease: "power3.inOut" },
                0,
              );
            }

            if (headingElements.length) {
              timeline.fromTo(
                headingElements,
                { y: isMobile ? 20 : 28, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.08 },
                dividerElements.length ? 0.18 : 0,
              );
            }

            pushLineTargets.forEach(({ element, width }) => {
              timeline.to(
                element,
                {
                  width,
                  duration: 0.82,
                  ease: "power3.inOut",
                  clearProps: "width",
                },
                0.55,
              );
            });

            if (itemElements.length) {
              const isLocationItems = trigger === ".tt-locations";
              timeline.fromTo(
                itemElements,
                { y: isMobile ? 24 : 40, autoAlpha: 0, ...(isLocationItems ? {} : { scale: 0.985 }) },
                {
                  y: 0,
                  autoAlpha: 1,
                  duration: 0.88,
                  stagger: 0.1,
                  ...(isLocationItems ? { clearProps: "transform" } : { scale: 1 }),
                },
                pushLineTargets.length ? 0.58 : headingElements.length ? 0.34 : 0,
              );
            }
          });

          if (isDesktop) {
            const parallaxImages = root.querySelectorAll<HTMLElement>(
              ".koops-bento-media img, .news-card-large > img, .contact-image img",
            );

            gsap.set(parallaxImages, { willChange: "transform" });

            parallaxImages.forEach((image) => {
              gsap.fromTo(
                image,
                { yPercent: -4, scale: 1.07 },
                {
                  yPercent: 4,
                  scale: 1.07,
                  ease: "none",
                  scrollTrigger: {
                    trigger: image.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                  },
                },
              );
            });
          }

          window.requestAnimationFrame(() => ScrollTrigger.refresh());
        },
        root,
      );

      revertAnimation = () => media.revert();
    });

    return () => {
      cancelled = true;
      revertAnimation();
    };
  }, []);

  React.useEffect(() => {
    if (heroUpdatesPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setHeroUpdateIndex((current) => (current + 1) % heroUpdates.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [heroUpdatesPaused]);

  const activeHeroUpdate = heroUpdates[heroUpdateIndex];

  return (
    <div className="site-shell" ref={pageRef}>
      <a className="skip-link" href="#turinys">Pereiti prie turinio</a>

      <header className="floating-nav" data-byq-adaptation="terra-tory-design-system-navigation">
        <div className="nav-shell">
          <div className="nav-left">
            <a className="brand" href="#pradzia" aria-label="KOOPS – į pradžią">
              <img src="/koops-logo.png" alt="KOOPS prekybos sistema" />
            </a>
            <span className="nav-divider" aria-hidden="true" />
            <nav className="desktop-nav" aria-label="Pagrindinė navigacija">
              <a href="/parduotuves"><span>Parduotuvės</span></a>
              <a href="/naujienos"><span>Naujienos</span></a>
              <a href="#restoranas"><span>Restoranas</span></a>
              <a href="/karjera"><span>Karjera</span></a>
              <a href="/tiekejams"><span>Tiekėjams</span></a>
              <a href="/apie"><span>Apie mus</span></a>
              <a href="/kontaktai"><span>Kontaktai</span></a>
            </nav>
          </div>
          <a className="pill-button dark nav-cta" href="/parduotuves" aria-label="Rasti parduotuvę">
            <RollingLabel>Rasti parduotuvę</RollingLabel>
          </a>
          <details className="mobile-menu">
            <summary aria-label="Atverti pagrindinį meniu"><span className="menu-hamburger" aria-hidden="true"><i /><i /></span></summary>
            <nav aria-label="Mobilioji navigacija">
              <div className="mobile-nav-links">
                <a href="/parduotuves">Parduotuvės</a>
                <a href="/naujienos">Naujienos ir akcijos</a>
                <a href="#restoranas">Restoranas</a>
                <a href="/karjera">Karjera</a>
                <a href="/apie">Apie KOOPS</a>
                <a href="/tiekejams">Tiekėjams</a>
                <a href="/kontaktai">Kontaktai</a>
              </div>
              <div className="mobile-nav-footer">
                <p className="section-label">SUSISIEKIME</p>
                <div className="mobile-nav-contact">
                  <a href="tel:+37034053235">0 340 53235</a>
                  <a href="mailto:direktore@urvk.lt">direktore@urvk.lt</a>
                </div>
                <div className="mobile-nav-socials" aria-label="KOOPS socialiniai tinklai">
                  {socialLinks.map((social) => {
                    const SocialIcon = social.icon;
                    return (
                      <a href={social.href} key={social.label} target="_blank" rel="noreferrer" aria-label={social.label}>
                        <SocialIcon aria-hidden="true" />
                        <span>{social.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </nav>
          </details>
        </div>
      </header>

      <main id="turinys">
        {/* BYQ: terra-tory-hero-1 adapted to KOOPS */}
        <section className="tt-hero" id="pradzia" data-byq-component="terra-tory-hero-1">
          <div className="tt-hero-background" aria-hidden="true">
            <img src="/koops-hero-market.jpg" alt="" />
          </div>
          <div className="tt-hero-overlay" aria-hidden="true" />
          <div className="tt-container tt-hero-stage">
            <div className="tt-hero-content">
              <div className="tt-hero-top">
                <p className="section-label light-label">UKMERGĖJE IR RAJONE</p>
                <h1>
                  <span>KOOPS</span>
                  <span>parduotuvės</span>
                  <span className="hero-title-break" aria-hidden="true" />
                  <i ref={heroLineRef} className="hero-headline-line title-push-line" style={{ width: 0 }} aria-hidden="true" />
                  <span>arčiau</span>
                  <span>jūsų.</span>
                </h1>
                <p className="body-large">Raskite artimiausią parduotuvę, jos darbo laiką ir maršrutą.</p>
                <a className="pill-button accent" href="/parduotuves" aria-label="Rasti artimiausią parduotuvę">
                  <RollingLabel>Rasti parduotuvę</RollingLabel>
                </a>
              </div>
            </div>
          </div>

          <aside
            className="hero-update-card"
            aria-label="Aktualios KOOPS naujienos"
            onMouseEnter={() => setHeroUpdatesPaused(true)}
            onMouseLeave={() => setHeroUpdatesPaused(false)}
            onFocusCapture={() => setHeroUpdatesPaused(true)}
            onBlurCapture={() => setHeroUpdatesPaused(false)}
          >
            <a className="hero-update-link" href={activeHeroUpdate.href} key={activeHeroUpdate.title}>
              <span className="hero-update-media">
                <img src={activeHeroUpdate.image} alt="" />
                <span className="hero-update-kicker">Aktualu</span>
              </span>
              <span className="hero-update-copy">
                <span className="section-label light-label">{activeHeroUpdate.label}</span>
                <strong>{activeHeroUpdate.title}</strong>
                <span className="hero-update-more text-link">Plačiau <span aria-hidden="true">→</span></span>
              </span>
            </a>
            <div className="hero-update-dots" aria-label="Pasirinkti aktualiją">
              {heroUpdates.map((item, index) => (
                <button
                  type="button"
                  className={index === heroUpdateIndex ? "is-active" : ""}
                  onClick={() => setHeroUpdateIndex(index)}
                  aria-label={`Rodyti: ${item.title}`}
                  aria-pressed={index === heroUpdateIndex}
                  key={item.title}
                />
              ))}
            </div>
          </aside>
        </section>

        <div className="tt-hero-spacer" aria-hidden="true" />

        <KoopsBentoSection />

        {/* BYQ: terra-tory-team-1 adapted to location cards */}
        <section className="tt-locations" id="parduotuves" aria-labelledby="parduotuviu-antraste" data-byq-component="terra-tory-team-1">
          <div className="tt-container">
            <div className="location-headline" id="parduotuviu-antraste">
              <span>Raskite</span><span>artimiausią</span><i className="title-push-line" style={{ width: 0 }} aria-hidden="true" /><span>KOOPS</span><span>parduotuvę</span>
            </div>
            <div className="location-carousel" role="region" aria-roledescription="karuselė" aria-label="KOOPS parduotuvės">
              <div className="location-grid" ref={locationCarouselRef} onScroll={handleLocationScroll}>
              {featuredStores.map((store, index) => (
                <article className="location-card" data-location-index={index} key={store.slug}>
                  <a
                    className={`location-image${store.image ? "" : " is-placeholder"}`}
                    href={`/parduotuves/${store.slug}`}
                    aria-label={`Parduotuvė „${store.name}“ – atverti puslapį`}
                  >
                    {store.image ? (
                      <img src={store.image} alt={`Parduotuvė „${store.name}“`} />
                    ) : (
                      <img className="store-cover-logo" src="/koops-logo.png" alt="" />
                    )}
                  </a>
                  <div className="location-info">
                    <div><h3>{store.name}</h3><p>{store.address}</p></div>
                    <dl>
                      <div><dt>Darbo laikas</dt><dd>{store.hours}</dd></div>
                      <div>
                        <dt>Telefonas</dt>
                        <dd>
                          <a href={`tel:${store.phoneHref}`}>{store.phone}</a>
                          {store.extraPhone && store.extraPhoneHref ? (
                            <>
                              {" · "}
                              <a href={`tel:${store.extraPhoneHref}`}>{store.extraPhone}</a>
                            </>
                          ) : null}
                        </dd>
                      </div>
                    </dl>
                    <a className="text-link" href={store.map} target="_blank" rel="noreferrer">
                      Rodyti žemėlapyje <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </article>
              ))}
              </div>
              <div className="location-carousel-controls">
                <div className="location-carousel-dots" aria-label="Pasirinkti parduotuvę">
                  {featuredStores.map((store, index) => (
                    <button
                      type="button"
                      className={index === locationSlide ? "is-active" : ""}
                      onClick={() => showLocationSlide(index)}
                      aria-label={`Rodyti parduotuvę „${store.name}“`}
                      aria-pressed={index === locationSlide}
                      key={store.slug}
                    />
                  ))}
                </div>
                <div className="location-carousel-arrows">
                  <button type="button" onClick={() => showLocationSlide(locationSlide - 1)} disabled={locationSlide === 0} aria-label="Ankstesnė parduotuvė">
                    <span className="control-arrow is-left"><ByqChevron /></span>
                  </button>
                  <button type="button" onClick={() => showLocationSlide(locationSlide + 1)} disabled={locationSlide === featuredStores.length - 1} aria-label="Kita parduotuvė">
                    <span className="control-arrow"><ByqChevron /></span>
                  </button>
                </div>
              </div>
              <p className="sr-only" aria-live="polite">Parduotuvė {locationSlide + 1} iš {featuredStores.length}</p>
            </div>
            <a className="pill-button accent section-cta" href="/parduotuves">
              <RollingLabel>Visos parduotuvės</RollingLabel>
            </a>
          </div>
        </section>

        {/* BYQ: terra-tory-blog-grid-1 */}
        <section className="tt-news" id="naujienos" aria-labelledby="naujienu-antraste" data-byq-component="terra-tory-blog-grid-1">
          <div className="tt-container">
            <div className="tt-section-header">
              <div className="dashed-divider" />
              <p className="section-label">AKTUALU</p>
              <h2 id="naujienu-antraste">Naujienos ir akcijos</h2>
            </div>
            <div className="news-bento">
              {featuredNews.map((item) => {
                if (item.tone === "featured") {
                  return (
                    <a className="news-card news-card-large" href={newsHref(item.slug)} key={item.slug}>
                      {item.image ? <img loading="lazy" src={item.image} alt="" /> : null}
                      <div>
                        <span className="section-label light-label">{item.category.toUpperCase()}</span>
                        <h3>{item.title}</h3>
                        {item.excerpt ? <p>{item.excerpt}</p> : null}
                        <span className="text-link">Skaityti <span aria-hidden="true">→</span></span>
                      </div>
                    </a>
                  );
                }

                const cardClass =
                  item.tone === "accent"
                    ? "news-card news-card-accent"
                    : item.tone === "wide"
                      ? "news-card news-card-wide"
                      : "news-card news-card-muted";
                const cta = item.tone === "accent" ? "Peržiūrėti" : item.tone === "muted" && item.slug === "kas-naujo-parduotuvese" ? "Sužinoti" : "Skaityti";

                return (
                  <a className={cardClass} href={newsHref(item.slug)} key={item.slug}>
                    <div className="news-card-copy">
                      <h3>{item.title}</h3>
                      <span className="text-link">{cta} <span aria-hidden="true">→</span></span>
                    </div>
                  </a>
                );
              })}
            </div>
            <a className="pill-button dark section-cta" href="/naujienos">
              <RollingLabel>Visos naujienos</RollingLabel>
            </a>
          </div>
        </section>

        {/* BYQ: terra-tory-combo-6 */}
        <section className="tt-story" id="restoranas" aria-labelledby="restorano-antraste" data-byq-component="terra-tory-combo-6">
          <div className="tt-container">
            <div className="story-headline">
              <p className="section-label light-label">RESTORANAS „VILKMERGĖ“ · NUO 1965 METŲ</p>
              <h2 id="restorano-antraste"><span className="story-title-desktop">Vieta jūsų šventėms, renginiams ir jaukiems susitikimams.</span><span className="story-title-mobile"><span>Vieta jūsų šventėms</span><span>renginiams ir jaukiems&nbsp;susitikimams.</span></span></h2>
            </div>
            <div className="story-grid">
              <div className="story-image" role="region" aria-roledescription="karuselė" aria-label="Restorano „Vilkmergė“ nuotraukų galerija">
                <img
                  key={restaurantSlides[restaurantSlide].src}
                  src={restaurantSlides[restaurantSlide].src}
                  alt={restaurantSlides[restaurantSlide].alt}
                />
                <div className="story-gallery-controls">
                  <div className="story-gallery-dots" aria-label="Pasirinkti galerijos nuotrauką">
                    {restaurantSlides.map((slide, index) => (
                      <button
                        type="button"
                        className={index === restaurantSlide ? "is-active" : ""}
                        onClick={() => setRestaurantSlide(index)}
                        aria-label={`Rodyti ${index + 1} nuotrauką: ${slide.alt}`}
                        aria-pressed={index === restaurantSlide}
                        key={slide.src}
                      />
                    ))}
                  </div>
                  <div className="story-gallery-arrows">
                    <button
                      type="button"
                      onClick={() => setRestaurantSlide((slide) => (slide - 1 + restaurantSlides.length) % restaurantSlides.length)}
                      aria-label="Ankstesnė restorano nuotrauka"
                    >
                      <span className="control-arrow is-left"><ByqChevron /></span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRestaurantSlide((slide) => (slide + 1) % restaurantSlides.length)}
                      aria-label="Kita restorano nuotrauka"
                    >
                      <span className="control-arrow"><ByqChevron /></span>
                    </button>
                  </div>
                </div>
                <p className="sr-only" aria-live="polite">Nuotrauka {restaurantSlide + 1} iš {restaurantSlides.length}</p>
              </div>
              <div className="story-copy">
                <p>Pačiame Ukmergės centre įsikūręs restoranas tinka jubiliejams, vestuvėms, krikštynoms, oficialiems renginiams ir vakarienėms.</p>
                <dl><div><dt>Pokylių salės</dt><dd>3 salės</dd></div><div><dt>Talpa</dt><dd>Iki 154 svečių</dd></div></dl>
                <div className="story-actions">
                  <a className="pill-button accent" href="/restoranas">
                    <RollingLabel>Apie restoraną</RollingLabel>
                  </a>
                  <a className="pill-button outline-light" href="tel:+37034053235" aria-label="Skambinti restoranui telefonu 0 340 53235">
                    <RollingLabel>Skambinti 0 340 53235</RollingLabel>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BYQ Supply: structured-data-2 careers list, adapted to KOOPS */}
        <section className="tt-jobs" id="karjera" aria-labelledby="karjeros-antraste" data-byq-component="structured-data-2-careers">
          <div className="tt-container jobs-layout">
            <div className="jobs-intro">
              <p className="section-label light-label">KARJERA</p>
              <h2 id="karjeros-antraste">Darbas arti namų</h2>
              <p>Prisijunkite prie KOOPS komandos Ukmergėje ir rajone. Susipažinkite su šiuo metu siūlomomis darbo vietomis.</p>
              <a className="pill-button accent" href="/karjera">
                <RollingLabel>Visi darbo pasiūlymai</RollingLabel>
              </a>
            </div>
            <div className="jobs-list" aria-label="Naujausi darbo pasiūlymai">
              {jobs.slice(0, 3).map((job) => (
                <a
                  className="job-row"
                  href={job.applyUrl}
                  key={job.title}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${job.title} — kandidatuoti naujame lange`}
                >
                  <div className="job-row-copy">
                    <h3>{job.title}</h3>
                    <div className="job-row-meta">
                      <span>{job.type}</span><span aria-hidden="true">•</span><span>{job.location}</span>
                    </div>
                  </div>
                  <span className="job-row-arrow" aria-hidden="true"><AvenirButtonArrow /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <KoopsValueFeaturesSection />

        {/* BYQ: terra-tory-contact-1 */}
        <section className="tt-contact" id="tiekejams" aria-labelledby="tiekeju-antraste" data-byq-component="terra-tory-contact-1">
          <div className="tt-container contact-grid">
            <div className="contact-content">
              <div className="contact-heading"><p className="section-label">TIEKĖJAMS</p><h2 id="tiekeju-antraste">Auginkime vietos pasiūlą kartu</h2><p>Ieškome patikimų gamintojų ir tiekėjų, norinčių pasiūlyti savo produkciją KOOPS pirkėjams.</p></div>
              <div className="contact-details">
                <div><strong>Adresas</strong><p>Vasario 16-osios g. 30<br />LT-20130 Ukmergė</p></div>
                <div><strong>El. paštas</strong><p><a href="mailto:direktore@urvk.lt">direktore@urvk.lt</a></p></div>
              </div>
              <SupplierForm />
            </div>
            <div className="contact-image">
              <img className="contact-image-main" loading="lazy" src="/ukmerge-fields-2.jpg" alt="Lietuvos laukai ir kaimo sodybos" />
            </div>
          </div>
        </section>
      </main>

        {/* BYQ: terra-tory-footer-1 */}
      <footer className="tt-footer" id="kontaktai" data-byq-component="terra-tory-footer-1">
        <section className="footer-cta" aria-labelledby="footer-cta-title">
          <div className="orbit footer-orbit-one" aria-hidden="true" /><div className="orbit footer-orbit-two" aria-hidden="true" />
          <p className="section-label light-label">KOOPS</p>
          <h2 id="footer-cta-title"><span className="footer-title-desktop"><span>Parduotuvė gali būti</span><span>arčiau, nei manote</span></span><span className="footer-title-mobile"><span>Parduotuvė gali</span><span>būti arčiau,</span><span>nei manote</span></span></h2>
          <a className="pill-button accent" href="/parduotuves" aria-label="Rasti KOOPS parduotuvę"><RollingLabel>Rasti parduotuvę</RollingLabel></a>
        </section>
        <div className="footer-reveal">
          <div className="tt-container footer-content">
            <div className="footer-grid">
              <div className="footer-brand">
                <img src="/koops-logo.png" alt="KOOPS prekybos sistema" />
                <p>Arti miesto ir rajono žmonių kasdien.</p>
                <div className="footer-socials" aria-label="KOOPS socialiniai tinklai">
                  {socialLinks.map((social) => {
                    const SocialIcon = social.icon;
                    return (
                      <a
                        className="footer-social-link"
                        href={social.href}
                        key={social.label}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${social.label} – atidaroma naujame lange`}
                      >
                        <span className="footer-social-mark" aria-hidden="true"><SocialIcon /></span>
                        <span>{social.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
              <nav aria-label="Poraštės navigacija">
                <div><p className="section-label">PAGRINDINIAI</p><a href="/parduotuves">Parduotuvės</a><a href="/naujienos">Naujienos</a><a href="/restoranas">Restoranas</a><a href="/karjera">Karjera</a></div>
                <div><p className="section-label">KOOPERATYVAS</p><a href="/apie">Apie KOOPS</a><a href="/tiekejams">Tiekėjams</a><a href="/kontaktai">Kontaktai</a></div>
                <div><p className="section-label">KONTAKTAI</p><a href="tel:+37034053235">0 340 53235</a><a href="mailto:direktore@urvk.lt">direktore@urvk.lt</a><a href="https://ukmergeskoops.lt/privatumo-politika/">Privatumo politika</a></div>
              </nav>
            </div>
            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} Ukmergės rajono vartotojų kooperatyvas</p>
              <a className="footer-back-to-top" href="#pradzia" aria-label="Grįžti į puslapio viršų">
                <span>Į puslapio viršų</span>
                <span className="footer-back-to-top-icon" aria-hidden="true">↑</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
