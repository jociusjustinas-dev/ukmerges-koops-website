"use client";

import * as React from "react";
import { useCmsOptions } from "./CmsProvider";

const CONSENT_COOKIE = "koops_consent";
const CONSENT_VERSION = 1;
const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;

type ConsentPreferences = {
  version: number;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

declare global {
  interface Window {
    __koopsConsent?: ConsentPreferences;
    gtag?: (...args: unknown[]) => void;
  }
}

const emptyPreferences = {
  analytics: false,
  marketing: false,
};

function readConsent(): ConsentPreferences | null {
  try {
    const row = document.cookie
      .split("; ")
      .find((item) => item.startsWith(`${CONSENT_COOKIE}=`));
    if (!row) return null;
    const value = JSON.parse(decodeURIComponent(row.slice(CONSENT_COOKIE.length + 1))) as ConsentPreferences;
    if (value.version !== CONSENT_VERSION || value.necessary !== true) return null;
    return value;
  } catch {
    return null;
  }
}

function announceConsent(preferences: ConsentPreferences) {
  window.__koopsConsent = preferences;
  window.gtag?.("consent", "update", {
    analytics_storage: preferences.analytics ? "granted" : "denied",
    ad_storage: preferences.marketing ? "granted" : "denied",
    ad_user_data: preferences.marketing ? "granted" : "denied",
    ad_personalization: preferences.marketing ? "granted" : "denied",
  });
  window.dispatchEvent(new CustomEvent("koops:consent-changed", { detail: preferences }));
}

function storeConsent(values: typeof emptyPreferences): ConsentPreferences {
  const preferences: ConsentPreferences = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: values.analytics,
    marketing: values.marketing,
    updatedAt: new Date().toISOString(),
  };
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(preferences))}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  announceConsent(preferences);
  return preferences;
}

export function CookieConsent() {
  const cms = useCmsOptions();
  const privacyUrl = cms.privacy_url || "/privatumo-politika";
  const [ready, setReady] = React.useState(false);
  const [consent, setConsent] = React.useState<ConsentPreferences | null>(null);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(emptyPreferences);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const openSettings = () => {
      const latest = readConsent();
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setDraft(latest ? { analytics: latest.analytics, marketing: latest.marketing } : emptyPreferences);
      setSettingsOpen(true);
    };
    window.addEventListener("koops:open-cookie-settings", openSettings);

    const initialize = window.setTimeout(() => {
      if (new URLSearchParams(window.location.search).get("koops-editor") === "1") {
        setReady(true);
        return;
      }
      const stored = readConsent();
      if (stored) {
        setConsent(stored);
        setDraft({ analytics: stored.analytics, marketing: stored.marketing });
        announceConsent(stored);
      }
      setReady(true);
    }, 0);

    return () => {
      window.clearTimeout(initialize);
      window.removeEventListener("koops:open-cookie-settings", openSettings);
    };
  }, []);

  React.useEffect(() => {
    if (!settingsOpen) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.querySelector<HTMLElement>("button, input, a")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSettingsOpen(false);
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href]'),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      returnFocusRef.current?.focus();
    };
  }, [settingsOpen]);

  const choose = (values: typeof emptyPreferences) => {
    const next = storeConsent(values);
    setConsent(next);
    setDraft(values);
    setSettingsOpen(false);
  };

  if (!ready) return null;

  return (
    <>
      {!consent && !settingsOpen ? (
        <section className="cookie-banner" aria-labelledby="cookie-banner-title" aria-describedby="cookie-banner-copy">
          <div className="cookie-banner-mark" aria-hidden="true"><span /><span /><span /></div>
          <div className="cookie-banner-copy">
            <p className="section-label light-label">JŪSŲ PASIRINKIMAS</p>
            <h2 id="cookie-banner-title">Slapukai — tik su jūsų leidimu.</h2>
            <p id="cookie-banner-copy">
              Būtinieji slapukai užtikrina svetainės veikimą. Statistikos ir rinkodaros priemones naudosime tik jums sutikus.{' '}
              <a href={privacyUrl}>Daugiau apie slapukus</a>
            </p>
          </div>
          <div className="cookie-banner-actions" aria-label="Slapukų pasirinkimai">
            <button className="cookie-action-button" type="button" onClick={() => choose(emptyPreferences)}>
              Atmesti nebūtinuosius
            </button>
            <button className="cookie-action-button" type="button" onClick={() => choose({ analytics: true, marketing: true })}>
              Priimti visus
            </button>
            <button
              className="cookie-settings-button"
              type="button"
              onClick={() => {
                returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
                setSettingsOpen(true);
              }}
            >
              Nustatymai
            </button>
          </div>
        </section>
      ) : null}

      {settingsOpen ? (
        <div className="cookie-dialog-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSettingsOpen(false);
        }}>
          <div
            className="cookie-dialog"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-dialog-title"
            aria-describedby="cookie-dialog-copy"
          >
            <div className="cookie-dialog-head">
              <div>
                <p className="section-label">SLAPUKŲ NUSTATYMAI</p>
                <h2 id="cookie-dialog-title">Pasirinkite, ką leidžiate</h2>
              </div>
              <button className="cookie-dialog-close" type="button" aria-label="Uždaryti slapukų nustatymus" onClick={() => setSettingsOpen(false)}>×</button>
            </div>
            <p id="cookie-dialog-copy" className="cookie-dialog-intro">
              Pasirinkimą galėsite bet kada pakeisti poraštėje. Nebūtinieji slapukai nėra įjungiami iš anksto.
            </p>

            <div className="cookie-category-list">
              <label className="cookie-category is-required">
                <span><strong>Būtinieji</strong><small>Svetainės veikimui ir jūsų pasirinkimui išsaugoti.</small></span>
                <span className="cookie-switch"><input type="checkbox" checked disabled aria-label="Būtinieji slapukai visada įjungti" /><i aria-hidden="true" /></span>
              </label>
              <label className="cookie-category">
                <span><strong>Statistikos</strong><small>Padeda suprasti bendrą svetainės naudojimą ir ją tobulinti.</small></span>
                <span className="cookie-switch"><input type="checkbox" aria-label="Leisti statistikos slapukus" checked={draft.analytics} onChange={(event) => setDraft((current) => ({ ...current, analytics: event.target.checked }))} /><i aria-hidden="true" /></span>
              </label>
              <label className="cookie-category">
                <span><strong>Rinkodaros</strong><small>Skirti reklamos rezultatams matuoti ir aktualumui gerinti.</small></span>
                <span className="cookie-switch"><input type="checkbox" aria-label="Leisti rinkodaros slapukus" checked={draft.marketing} onChange={(event) => setDraft((current) => ({ ...current, marketing: event.target.checked }))} /><i aria-hidden="true" /></span>
              </label>
            </div>

            <div className="cookie-dialog-actions">
              <button className="cookie-action-button" type="button" onClick={() => choose(emptyPreferences)}>Atmesti nebūtinuosius</button>
              <button className="cookie-action-button" type="button" onClick={() => choose(draft)}>Išsaugoti pasirinkimą</button>
            </div>
            <a className="cookie-policy-link" href={privacyUrl}>Privatumo ir slapukų informacija →</a>
          </div>
        </div>
      ) : null}
    </>
  );
}
