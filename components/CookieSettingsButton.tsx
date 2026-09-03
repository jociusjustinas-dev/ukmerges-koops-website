"use client";

export function CookieSettingsButton() {
  return (
    <button
      className="footer-cookie-settings"
      type="button"
      onClick={() => window.dispatchEvent(new Event("koops:open-cookie-settings"))}
    >
      Slapukų nustatymai
    </button>
  );
}
