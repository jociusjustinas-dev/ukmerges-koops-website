"use client";

import * as React from "react";
import { RollingLabel } from "./RollingLabel";
import { submitEnquiry } from "../lib/submit-enquiry";

type SupplierField = "vardas" | "el_pastas" | "pasiulymas" | "privatumas";
type SupplierFormErrors = Partial<Record<SupplierField, string>>;

const fieldOrder: SupplierField[] = ["vardas", "el_pastas", "pasiulymas", "privatumas"];

const idPrefix = "supplier";

function validateSupplierForm(form: HTMLFormElement): SupplierFormErrors {
  const data = new FormData(form);
  const name = String(data.get("vardas") ?? "").trim();
  const email = String(data.get("el_pastas") ?? "").trim();
  const proposal = String(data.get("pasiulymas") ?? "").trim();
  const errors: SupplierFormErrors = {};

  if (name.length < 2) errors.vardas = "Įrašykite savo vardą.";
  if (!email) {
    errors.el_pastas = "Įrašykite el. pašto adresą.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.el_pastas = "Patikrinkite el. pašto adreso formatą.";
  }
  if (proposal.length < 10) errors.pasiulymas = "Trumpai aprašykite savo pasiūlymą.";
  if (data.get("privatumas") !== "patvirtinta") {
    errors.privatumas = "Patvirtinkite, kad susipažinote su privatumo politika.";
  }

  return errors;
}

type Props = {
  /** Unikalus id prefix, kai forma būna keliose vietose tame pačiame dokumente. */
  idSuffix?: string;
};

/** Index / Tiekėjams — ta pati terra-tory-contact formos logika */
export function SupplierForm({ idSuffix = "" }: Props) {
  const [errors, setErrors] = React.useState<SupplierFormErrors>({});
  const [status, setStatus] = React.useState<"idle" | "error" | "ready">("idle");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const errorSummaryRef = React.useRef<HTMLDivElement>(null);
  const uid = idSuffix ? `${idPrefix}-${idSuffix}` : idPrefix;

  const clearError = (field: SupplierField) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setSubmitError("");
    if (status === "ready") setStatus("idle");
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors = validateSupplierForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await submitEnquiry(form, "supplier");
      setStatus("ready");
      form.reset();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Pasiūlymo išsiųsti nepavyko.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="supplier-form"
      onSubmit={onSubmit}
      noValidate
      aria-label="Tiekėjo pasiūlymo forma"
    >
      <input className="form-honeypot" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {submitError ? <div className="supplier-form-alert is-error" role="alert">{submitError}</div> : null}
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
          <strong>Pasiūlymas priimtas</strong>
          <p>Užklausą išsaugojome ir perduosime atsakingam darbuotojui.</p>
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
            placeholder="Pvz., antanas@ukis.lt"
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
      <label className={`form-field${errors.pasiulymas ? " has-error" : ""}`} htmlFor={`${uid}-proposal`}>
        <span>PASIŪLYMAS</span>
        <textarea
          id={`${uid}-proposal`}
          name="pasiulymas"
          rows={5}
          placeholder="Nurodykite produktą, jo kilmę ir kaip galėtume su jumis susisiekti…"
          aria-invalid={Boolean(errors.pasiulymas)}
          aria-describedby={errors.pasiulymas ? `${uid}-proposal-error` : undefined}
          onChange={() => clearError("pasiulymas")}
          required
        />
        {errors.pasiulymas ? (
          <small className="field-error" id={`${uid}-proposal-error`}>
            {errors.pasiulymas}
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
          <a className="privacy-link" href="https://ukmergeskoops.lt/privatumo-politika/">
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
      <button className="pill-button dark" type="submit" disabled={isSubmitting}>
        <RollingLabel>{isSubmitting ? "Siunčiama…" : "Siųsti pasiūlymą"}</RollingLabel>
      </button>
    </form>
  );
}
