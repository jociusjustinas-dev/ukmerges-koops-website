"use client";

import * as React from "react";
import { contactsOrg } from "../lib/contacts";
import { RollingLabel } from "./RollingLabel";

type ContactField = "vardas" | "el_pastas" | "zinute" | "privatumas";
type ContactFormErrors = Partial<Record<ContactField, string>>;

const fieldOrder: ContactField[] = ["vardas", "el_pastas", "zinute", "privatumas"];
const idPrefix = "contact";

function validateContactForm(form: HTMLFormElement): ContactFormErrors {
  const data = new FormData(form);
  const name = String(data.get("vardas") ?? "").trim();
  const email = String(data.get("el_pastas") ?? "").trim();
  const message = String(data.get("zinute") ?? "").trim();
  const errors: ContactFormErrors = {};

  if (name.length < 2) errors.vardas = "Įrašykite savo vardą.";
  if (!email) {
    errors.el_pastas = "Įrašykite el. pašto adresą.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.el_pastas = "Patikrinkite el. pašto adreso formatą.";
  }
  if (message.length < 10) errors.zinute = "Trumpai parašykite savo klausimą ar žinutę.";
  if (data.get("privatumas") !== "patvirtinta") {
    errors.privatumas = "Patvirtinkite, kad susipažinote su privatumo politika.";
  }

  return errors;
}

type Props = {
  idSuffix?: string;
};

/** BYQ: terra-tory-contact-1 form — bendras kontaktas */
export function ContactEnquiryForm({ idSuffix = "" }: Props) {
  const [errors, setErrors] = React.useState<ContactFormErrors>({});
  const [status, setStatus] = React.useState<"idle" | "error" | "ready">("idle");
  const errorSummaryRef = React.useRef<HTMLDivElement>(null);
  const uid = idSuffix ? `${idPrefix}-${idSuffix}` : idPrefix;

  const clearError = (field: ContactField) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (status === "ready") setStatus("idle");
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors = validateContactForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    const data = new FormData(form);
    const name = String(data.get("vardas") ?? "").trim();
    const email = String(data.get("el_pastas") ?? "").trim();
    const message = String(data.get("zinute") ?? "").trim();
    const subject = encodeURIComponent(`Kontakto užklausa – ${name}`);
    const body = encodeURIComponent(`Vardas: ${name}\nEl. paštas: ${email}\n\nŽinutė:\n${message}`);
    window.setTimeout(() => {
      window.location.href = `mailto:${contactsOrg.email}?subject=${subject}&body=${body}`;
    }, 120);
    setStatus("ready");
  };

  return (
    <form
      className="supplier-form"
      onSubmit={onSubmit}
      noValidate
      aria-label="Kontaktų užklausos forma"
    >
      {status === "error" && Object.keys(errors).length > 0 ? (
        <div className="supplier-form-alert is-error" role="alert" tabIndex={-1} ref={errorSummaryRef}>
          <strong>Patikrinkite pažymėtus laukus</strong>
          <ul>
            {fieldOrder.flatMap((field) =>
              errors[field] ? [<li key={field}>{errors[field]}</li>] : [],
            )}
          </ul>
        </div>
      ) : null}
      {status === "ready" ? (
        <div className="supplier-form-alert is-success" role="status">
          <strong>Žinutė paruošta siųsti</strong>
          <p>Patikrinkite paruoštą laišką ir patvirtinkite jo siuntimą.</p>
        </div>
      ) : null}
      <div className="form-halves">
        <label className={`form-field${errors.vardas ? " has-error" : ""}`} htmlFor={`${uid}-name`}>
          <span>JŪSŲ VARDAS</span>
          <input
            id={`${uid}-name`}
            name="vardas"
            type="text"
            placeholder="Pvz., Antanas"
            autoComplete="name"
            aria-invalid={Boolean(errors.vardas)}
            aria-describedby={errors.vardas ? `${uid}-name-error` : undefined}
            onChange={() => clearError("vardas")}
            required
          />
          {errors.vardas ? (
            <small className="field-error" id={`${uid}-name-error`}>
              {errors.vardas}
            </small>
          ) : null}
        </label>
        <label className={`form-field${errors.el_pastas ? " has-error" : ""}`} htmlFor={`${uid}-email`}>
          <span>EL. PAŠTAS</span>
          <input
            id={`${uid}-email`}
            name="el_pastas"
            type="email"
            inputMode="email"
            placeholder="Pvz., antanas@pastas.lt"
            autoComplete="email"
            aria-invalid={Boolean(errors.el_pastas)}
            aria-describedby={errors.el_pastas ? `${uid}-email-error` : undefined}
            onChange={() => clearError("el_pastas")}
            required
          />
          {errors.el_pastas ? (
            <small className="field-error" id={`${uid}-email-error`}>
              {errors.el_pastas}
            </small>
          ) : null}
        </label>
      </div>
      <label className={`form-field${errors.zinute ? " has-error" : ""}`} htmlFor={`${uid}-message`}>
        <span>ŽINUTĖ</span>
        <textarea
          id={`${uid}-message`}
          name="zinute"
          rows={5}
          placeholder="Parašykite klausimą arba trumpai aprašykite, kuo galime padėti…"
          aria-invalid={Boolean(errors.zinute)}
          aria-describedby={errors.zinute ? `${uid}-message-error` : undefined}
          onChange={() => clearError("zinute")}
          required
        />
        {errors.zinute ? (
          <small className="field-error" id={`${uid}-message-error`}>
            {errors.zinute}
          </small>
        ) : null}
      </label>
      <div className={`privacy-field${errors.privatumas ? " has-error" : ""}`}>
        <span className="privacy-checkbox-control">
          <input
            className="privacy-checkbox-input"
            id={`${uid}-privacy`}
            name="privatumas"
            type="checkbox"
            value="patvirtinta"
            aria-invalid={Boolean(errors.privatumas)}
            aria-describedby={errors.privatumas ? `${uid}-privacy-error` : undefined}
            onChange={() => clearError("privatumas")}
            required
          />
          <span className="privacy-checkbox-mark" aria-hidden="true" />
        </span>
        <div className="privacy-consent-copy">
          <label htmlFor={`${uid}-privacy`}>Patvirtinu, kad susipažinau su </label>
          <a className="privacy-link" href={contactsOrg.privacyUrl}>
            privatumo politika
          </a>
          .
          {errors.privatumas ? (
            <small className="field-error" id={`${uid}-privacy-error`}>
              {errors.privatumas}
            </small>
          ) : null}
        </div>
      </div>
      <button className="pill-button dark" type="submit">
        <RollingLabel>Siųsti žinutę</RollingLabel>
      </button>
    </form>
  );
}
