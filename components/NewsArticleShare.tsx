"use client";

import * as React from "react";
import { FaEnvelope, FaFacebookF, FaLink } from "react-icons/fa6";

type NewsArticleShareProps = {
  title: string;
  url: string;
};

export function NewsArticleShare({ title, url }: NewsArticleShareProps) {
  const [copied, setCopied] = React.useState(false);

  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const mailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="news-article-share" role="group" aria-label="Dalintis">
      <p className="news-article-share-label">Dalintis</p>
      <a
        className="news-article-share-btn"
        href={facebookHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Dalintis Facebook"
      >
        <FaFacebookF aria-hidden="true" />
      </a>
      <a className="news-article-share-btn" href={mailHref} aria-label="Dalintis el. paštu">
        <FaEnvelope aria-hidden="true" />
      </a>
      <button
        type="button"
        className="news-article-share-btn"
        onClick={copyLink}
        aria-label={copied ? "Nuoroda nukopijuota" : "Kopijuoti nuorodą"}
      >
        <FaLink aria-hidden="true" />
      </button>
      <span className={`news-article-share-status${copied ? " is-visible" : ""}`} aria-live="polite">
        {copied ? "Nukopijuota" : ""}
      </span>
    </div>
  );
}
