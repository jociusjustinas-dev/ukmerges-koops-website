"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { primaryNav, socialLinks } from "../lib/site";
import { RollingLabel } from "./RollingLabel";
import { useCmsOptions } from "./CmsProvider";

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "").replace(/^0/, "+370")}`;
}

export function SiteHeader({ variant = "transparent" }: { variant?: "transparent" | "solid" }) {
  const pathname = usePathname();
  const cms = useCmsOptions();
  const phone = cms.phone || "0 340 53235";
  const email = cms.email || "direktore@urvk.lt";
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    if (variant === "solid") {
      return;
    }

    let cancelled = false;
    let scrollTrigger: { kill: () => void } | null = null;

    const updateScrolled = () => setScrolled(window.scrollY > 32);
    updateScrolled();

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      updateScrolled();
      scrollTrigger = ScrollTrigger.create({
        start: 32,
        end: "max",
        onEnter: () => setScrolled(true),
        onEnterBack: () => setScrolled(true),
        onLeave: () => setScrolled(true),
        onLeaveBack: () => setScrolled(false),
        onRefresh: updateScrolled,
      });
    });

    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => {
      cancelled = true;
      window.removeEventListener("scroll", updateScrolled);
      scrollTrigger?.kill();
    };
  }, [variant]);

  return (
    <header className={`floating-nav${variant === "solid" || scrolled ? " is-scrolled" : ""}`} data-byq-adaptation="terra-tory-design-system-navigation">
      <div className="nav-shell">
        <div className="nav-left">
          <a className="brand" href="/" aria-label="KOOPS – į pradžią">
            <img src="/koops-logo.png" alt="KOOPS prekybos sistema" />
          </a>
          <span className="nav-divider" aria-hidden="true" />
          <nav className="desktop-nav" aria-label="Pagrindinė navigacija">
            {primaryNav.map((item) => (
              <a
                href={item.href}
                key={item.href}
                aria-current={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) ? "page" : undefined}
              >
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
        <a className="pill-button dark nav-cta" href="/parduotuves" aria-label="Rasti parduotuvę">
          <RollingLabel>Rasti parduotuvę</RollingLabel>
        </a>
        <details className="mobile-menu">
          <summary aria-label="Atverti pagrindinį meniu"><span className="menu-hamburger" aria-hidden="true"><i /><i /></span></summary>
          <nav aria-label="Mobilioji navigacija">
            <div className="mobile-nav-links">
              {primaryNav.map((item) => (
                <a href={item.href} key={`mobile-${item.href}`}>{item.label}</a>
              ))}
            </div>
            <div className="mobile-nav-footer">
              <p className="section-label">SUSISIEKIME</p>
              <div className="mobile-nav-contact">
                <a href={phoneHref(phone)}>{phone}</a>
                <a href={`mailto:${email}`}>{email}</a>
              </div>
              <div className="mobile-nav-socials" aria-label="KOOPS socialiniai tinklai">
                {socialLinks.map((social) => {
                  const SocialIcon = social.icon;
                  return (
                    <a
                      href={social.label === "Facebook" ? cms.facebook_url || social.href : cms.instagram_url || social.href}
                      key={social.label}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                    >
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
  );
}
