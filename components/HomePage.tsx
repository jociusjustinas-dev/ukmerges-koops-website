"use client";

import * as React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";
import { AvenirButtonArrow } from "../app/byq-icons";
import type { CmsPageSection, CmsRenderContext } from "../lib/cms-render";
import { revealIntroImmediately, withIntroFallback } from "../lib/motionIntro";
import { CmsPageController } from "./CmsPageController";
import { CmsPageSections } from "./CmsPageSections";

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

type HomePageProps = {
  context: CmsRenderContext;
  sections: CmsPageSection[];
};

export function HomePage({ context, sections }: HomePageProps) {
  const pageRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

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
            titlePushLines.forEach((pushLine) => {
              pushLine.style.removeProperty("width");
              pushLine.style.removeProperty("transform");
              pushLine.style.removeProperty("transform-origin");
            });
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
          const line = root.querySelector<HTMLElement>(".tt-hero .hero-headline-line");

          if (line) {
            line.style.removeProperty("width");
            line.style.removeProperty("transform");
            line.style.removeProperty("transform-origin");
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
            { y: isMobile ? 18 : 28 },
            { y: 0, stagger: 0.07 },
            0.16,
          );

          if (line && targetWidth) {
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
              headings: ".location-headline > :not(.title-push-line):not(.title-push-break)",
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
              pushLineElement.style.removeProperty("transform");
              pushLineElement.style.removeProperty("transform-origin");
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

  return (
    <div className="site-shell" ref={pageRef} data-cms-page="pradinis">
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
              <a href="/leidiniai"><span>Leidiniai</span></a>
              <a href="/naujienos"><span>Naujienos</span></a>
              <a href="/skelbimai"><span>Skelbimai</span></a>
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
                <a href="/leidiniai">Leidiniai</a>
                <a href="/naujienos">Naujienos ir akcijos</a>
                <a href="/skelbimai">Skelbimai</a>
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
        <CmsPageSections sections={sections} context={context} skipFooterCta />
      </main>
      <CmsPageController page="pradinis" sections={sections} />

        {/* BYQ: terra-tory-footer-1 */}
      <footer className="tt-footer" id="kontaktai" data-byq-component="terra-tory-footer-1">
        <section className="footer-cta" id="footer-cta" aria-labelledby="footer-cta-title" data-cms-section="footer-cta">
          <div className="orbit footer-orbit-one" aria-hidden="true" /><div className="orbit footer-orbit-two" aria-hidden="true" />
          <p className="section-label light-label">KOOPS</p>
          <h2 id="footer-cta-title"><span className="footer-title-desktop"><span>Parduotuvė gali būti</span><span>arčiau, nei manote</span></span><span className="footer-title-mobile"><span>Parduotuvė gali</span><span>būti arčiau,</span><span>nei manote</span></span></h2>
          <a className="pill-button accent" href="/parduotuves" aria-label="Rasti KOOPS parduotuvę"><RollingLabel>Rasti parduotuvę</RollingLabel></a>
        </section>
        <div className="footer-reveal">
          <div className="tt-container footer-content">
            <div className="footer-grid">
              <div className="footer-brand">
                <img loading="lazy" src="/koops-logo.png" alt="KOOPS prekybos sistema" />
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
                <div><p className="section-label">PAGRINDINIAI</p><a href="/parduotuves">Parduotuvės</a><a href="/leidiniai">Leidiniai</a><a href="/naujienos">Naujienos</a><a href="/skelbimai">Skelbimai</a><a href="/restoranas">Restoranas</a><a href="/karjera">Karjera</a></div>
                <div><p className="section-label">KOOPERATYVAS</p><a href="/apie">Apie KOOPS</a><a href="/tiekejams">Tiekėjams</a><a href="/kontaktai">Kontaktai</a></div>
                <div><p className="section-label">KONTAKTAI</p><a href="tel:+37034053235">0 340 53235</a><a href="mailto:direktore@urvk.lt">direktore@urvk.lt</a><a href="/privatumo-politika">Privatumo politika</a></div>
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
