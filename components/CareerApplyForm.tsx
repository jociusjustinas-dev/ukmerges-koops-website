"use client";

import * as React from "react";
import { RollingLabel } from "./RollingLabel";
import { submitEnquiry } from "../lib/submit-enquiry";

type FormErrors = Partial<
  Record<"vardas" | "telefonas" | "el_pastas" | "zinute" | "priedas" | "privatumas", string>
>;

const MAX_FILE_MB = 5;
const ACCEPTED =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export function CareerApplyForm() {
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [sent, setSent] = React.useState(false);
  const [fileName, setFileName] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const clearError = (key: keyof FormErrors) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    clearError("priedas");
    if (!file) {
      setFileName("");
      return;
    }

    const okType =
      file.type === "application/pdf" ||
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      /\.(pdf|docx?)$/i.test(file.name);

    if (!okType) {
      setErrors((prev) => ({ ...prev, priedas: "Galima PDF arba DOC / DOCX." }));
      setFileName("");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, priedas: `Failas iki ${MAX_FILE_MB} MB.` }));
      setFileName("");
      event.target.value = "";
      return;
    }

    setFileName(file.name);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const next: FormErrors = {};

    const name = String(data.get("vardas") ?? "").trim();
    const phone = String(data.get("telefonas") ?? "").trim();
    const email = String(data.get("el_pastas") ?? "").trim();
    const message = String(data.get("zinute") ?? "").trim();
    const privacy = data.get("privatumas");

    if (!name) next.vardas = "Įveskite vardą.";
    if (!phone) next.telefonas = "Įveskite telefoną.";
    if (!email) next.el_pastas = "Įveskite el. paštą.";
    if (!message) next.zinute = "Trumpai parašykite, ko ieškote.";
    if (!privacy) next.privatumas = "Reikalingas privatumo sutikimas.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await submitEnquiry(form, "job");
      setSent(true);
      setFileName("");
      form.reset();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Žinutės išsiųsti nepavyko.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="restaurant-form-success" role="status">
        <h3>Žinutė priimta</h3>
        <p>Užklausą išsaugojome ir perdavėme atsakingam darbuotojui.</p>
        <button className="pill-button ghost" type="button" onClick={() => setSent(false)}>
          <RollingLabel>Siųsti dar kartą</RollingLabel>
        </button>
      </div>
    );
  }

  return (
    <form className="restaurant-form" onSubmit={onSubmit} noValidate encType="multipart/form-data">
      <input className="form-honeypot" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {submitError ? <div className="supplier-form-alert is-error" role="alert">{submitError}</div> : null}
      <div className="restaurant-form-grid">
        <label
          className={`form-field form-field-span-full${errors.vardas ? " has-error" : ""}`}
          htmlFor="career-name"
        >
          <span>VARDAS</span>
          <input
            id="career-name"
            name="vardas"
            type="text"
            autoComplete="name"
            placeholder="Pvz., Jonas Jonaitis"
            aria-invalid={Boolean(errors.vardas)}
            onChange={() => clearError("vardas")}
            required
          />
          {errors.vardas ? <small className="field-error">{errors.vardas}</small> : null}
        </label>
        <label className={`form-field${errors.telefonas ? " has-error" : ""}`} htmlFor="career-phone">
          <span>TELEFONAS</span>
          <input
            id="career-phone"
            name="telefonas"
            type="tel"
            autoComplete="tel"
            placeholder="Pvz., +370 600 00000"
            aria-invalid={Boolean(errors.telefonas)}
            onChange={() => clearError("telefonas")}
            required
          />
          {errors.telefonas ? <small className="field-error">{errors.telefonas}</small> : null}
        </label>
        <label className={`form-field${errors.el_pastas ? " has-error" : ""}`} htmlFor="career-email">
          <span>EL. PAŠTAS</span>
          <input
            id="career-email"
            name="el_pastas"
            type="email"
            autoComplete="email"
            placeholder="Pvz., jonas@pastas.lt"
            aria-invalid={Boolean(errors.el_pastas)}
            onChange={() => clearError("el_pastas")}
            required
          />
          {errors.el_pastas ? <small className="field-error">{errors.el_pastas}</small> : null}
        </label>
        <label
          className={`form-field form-field-span-full${errors.priedas ? " has-error" : ""}`}
          htmlFor="career-file"
        >
          <span>CV / PRIEDAS (NEPRIVALOMAS)</span>
          <input
            ref={fileInputRef}
            id="career-file"
            className="career-file-input"
            name="priedas"
            type="file"
            accept={ACCEPTED}
            onChange={onFileChange}
          />
          <button
            className={`career-file-trigger${fileName ? " is-filled" : ""}`}
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="career-file-trigger-label">
              {fileName || "Pasirinkite PDF arba DOC"}
            </span>
            <span className="career-file-trigger-action">{fileName ? "Keisti" : "Įkelti"}</span>
          </button>
          <small className="career-file-hint">Iki {MAX_FILE_MB} MB · PDF, DOC, DOCX</small>
          {errors.priedas ? <small className="field-error">{errors.priedas}</small> : null}
        </label>
      </div>

      <label className={`form-field${errors.zinute ? " has-error" : ""}`} htmlFor="career-message">
        <span>ŽINUTĖ</span>
        <textarea
          id="career-message"
          name="zinute"
          rows={5}
          placeholder="Kokios patirties turite, kokio darbo ieškote ir kur norėtumėte dirbti…"
          aria-invalid={Boolean(errors.zinute)}
          onChange={() => clearError("zinute")}
          required
        />
        {errors.zinute ? <small className="field-error">{errors.zinute}</small> : null}
      </label>

      <label className={`privacy-field${errors.privatumas ? " has-error" : ""}`}>
        <input
          type="checkbox"
          name="privatumas"
          value="patvirtinta"
          onChange={() => clearError("privatumas")}
          required
        />
        <span>
          Patvirtinu, kad susipažinau su{" "}
          <a href="/privatumo-politika">privatumo politika</a>.
        </span>
      </label>
      {errors.privatumas ? <small className="field-error">{errors.privatumas}</small> : null}

      <button className="pill-button dark" type="submit" disabled={isSubmitting}>
        <RollingLabel>{isSubmitting ? "Siunčiama…" : "Siųsti žinutę"}</RollingLabel>
      </button>
    </form>
  );
}
