"use client";

import { useLayoutEffect } from "react";
import type { CmsPageSection } from "../lib/cms-render";

type Props = {
  page: string;
  sections?: CmsPageSection[];
};

function setText(target: Element | null, value?: string) {
  if (!target || !value?.trim()) return;
  target.textContent = value.trim();
  if (target.matches("h1, h2, .location-headline")) {
    (target as HTMLElement).style.whiteSpace = "pre-line";
  }
}

function applyContent(root: HTMLElement, section: CmsPageSection) {
  const overrides = new Set(section.overrides || []);
  if (overrides.has("eyebrow")) {
    setText(root.querySelector("[data-cms-field='eyebrow'], .section-label"), section.eyebrow);
  }
  if (overrides.has("title")) {
    setText(root.querySelector("[data-cms-field='title'], h1, h2, .location-headline"), section.title);
  }
  if (overrides.has("description")) {
    setText(
      root.querySelector(
        "[data-cms-field='description'], .body-large, .stores-directory-lead, .classifieds-directory-lead",
      ),
      section.description,
    );
  }

  const button = root.querySelector<HTMLAnchorElement>(
    "[data-cms-field='primary-link'], a.pill-button, a.text-link",
  );
  if (button && overrides.has("primaryUrl") && section.primaryUrl?.trim()) button.href = section.primaryUrl.trim();
  if (button && overrides.has("primaryLabel") && section.primaryLabel?.trim()) {
    const label = button.querySelector<HTMLElement>(".avenir-button-text") || button;
    label.textContent = section.primaryLabel.trim();
  }

  if (overrides.has("imageUrl") && section.imageUrl?.trim()) {
    applyImage(root.querySelector<HTMLImageElement>("[data-cms-field='image']"), section.imageUrl.trim());
  }

  if (overrides.has("galleryUrls") && section.galleryUrls?.length) {
    root.querySelectorAll<HTMLImageElement>("[data-cms-field='gallery-item']").forEach((image, index) => {
      if (section.galleryUrls?.[index]) applyImage(image, section.galleryUrls[index]);
    });
  }

  if (overrides.has("items") && Array.isArray(section.items)) {
    applyFaqItems(root, section.items);
  }
}

function applyFaqItems(root: HTMLElement, items: NonNullable<CmsPageSection["items"]>) {
  const list = root.querySelector(".stores-faq-list");
  if (!list) return;
  list.replaceChildren();
  items.forEach((item, index) => {
    const question = String(item.question || "").trim();
    const answer = String(item.answer || "").trim();
    if (!question && !answer) return;
    const details = document.createElement("details");
    if (index === 0) details.open = true;
    const summary = document.createElement("summary");
    const questionSpan = document.createElement("span");
    questionSpan.textContent = question;
    const toggle = document.createElement("span");
    toggle.className = "stores-faq-toggle";
    toggle.setAttribute("aria-hidden", "true");
    summary.append(questionSpan, toggle);
    const paragraph = document.createElement("p");
    paragraph.textContent = answer;
    details.append(summary, paragraph);
    list.appendChild(details);
  });
}

function applyAnchor(root: HTMLElement, section: CmsPageSection) {
  if (root.classList.contains("tt-hero-spacer")) {
    root.removeAttribute("id");
    return;
  }
  const id = (section.anchor || "").trim();
  if (id) root.id = id;
}

function applyImage(image: HTMLImageElement | null, url?: string) {
  if (!image || !url?.trim()) return;
  const next = url.trim();
  image.src = next;
  image.removeAttribute("srcset");
  image.removeAttribute("sizes");
  image.srcset = "";
}

type PreviewMessage = {
  source?: string;
  type?: string;
  sectionType?: string;
  sections?: CmsPageSection[];
  changes?: Partial<CmsPageSection>;
  scroll?: boolean;
};

function postPreviewMessage(message: PreviewMessage) {
  const topWindow = window.top;
  if (!topWindow || topWindow === window) return;
  topWindow.postMessage({ source: "koops-cms-preview", ...message }, "*");
}

export function CmsPageController({ page, sections }: Props) {
  useLayoutEffect(() => {
    if (!sections?.length) return;
    const shell = document.querySelector<HTMLElement>(`[data-cms-page="${page}"]`);
    if (!shell) return;

    const editorMode = new URLSearchParams(window.location.search).get("koops-editor") === "1";

    const nodes = Array.from(shell.querySelectorAll<HTMLElement>("[data-cms-section]"));

    const applySectionState = (list: CmsPageSection[]) => {
      const byType = new Map(list.map((section, index) => [section.type, { section, index }]));
      nodes.forEach((node) => {
        const entry = byType.get(node.dataset.cmsSection || "");
        node.hidden = !entry || (!entry.section.enabled && !editorMode);
        if (!entry) return;
        node.style.order = String(entry.index);
        applyAnchor(node, entry.section);
        applyContent(node, entry.section);
        if (editorMode && !node.classList.contains("tt-hero-spacer")) {
          node.classList.add("koops-cms-editable-section");
          node.classList.toggle("is-cms-disabled", !entry.section.enabled);
          node.dataset.cmsEditorLabel = entry.section.type;
        }
      });

      const parents = new Set(nodes.map((node) => node.parentElement).filter(Boolean));
      parents.forEach((parent) => {
        if (!parent) return;
        const direct = Array.from(parent.children).filter(
          (child): child is HTMLElement => child instanceof HTMLElement && child.hasAttribute("data-cms-section"),
        );
        if (direct.length < 2) return;
        direct
          .sort((a, b) => Number(a.style.order || 999) - Number(b.style.order || 999))
          .forEach((node) => parent.appendChild(node));
      });

      if (!editorMode) return;

      const main = shell.querySelector("main") || shell;
      const nativeInMain = nodes.filter(
        (node) => main.contains(node) && !node.classList.contains("tt-hero-spacer"),
      );

      shell.querySelectorAll<HTMLElement>(".koops-cms-missing-section").forEach((card) => {
        const type = card.dataset.cmsSection || "";
        const hasNative = nativeInMain.some((node) => node.dataset.cmsSection === type);
        if (!type || hasNative || !list.some((section) => section.type === type)) card.remove();
      });

      list.forEach((section, index) => {
        const hasNative = nodes.some(
          (node) => node.dataset.cmsSection === section.type && !node.classList.contains("tt-hero-spacer"),
        );
        if (hasNative) return;

        let card = shell.querySelector<HTMLElement>(
          `.koops-cms-missing-section[data-cms-section="${section.type}"]`,
        );
        if (!card) {
          card = document.createElement("article");
          card.className = "koops-cms-missing-section koops-cms-editable-section";
          card.dataset.cmsSection = section.type;
          const kicker = document.createElement("p");
          kicker.className = "koops-cms-missing-section__kicker";
          const title = document.createElement("h2");
          title.className = "koops-cms-missing-section__title";
          title.setAttribute("data-cms-field", "title");
          const hint = document.createElement("p");
          hint.className = "koops-cms-missing-section__hint";
          hint.textContent = "Ši sekcija dar neturi svetainės komponento. Pašalinkite bloką arba pasirinkite kitą tipą.";
          card.append(kicker, title, hint);
        }

        const kicker = card.querySelector(".koops-cms-missing-section__kicker");
        if (kicker) kicker.textContent = section.label || section.type;
        const title = card.querySelector(".koops-cms-missing-section__title");
        if (title) {
          title.textContent = section.title?.trim() || "Šiame puslapyje ši sekcija nevaizduojama";
        }
        card.classList.toggle("is-cms-disabled", section.enabled === false);
        card.dataset.cmsEditorLabel = section.type;

        let before: HTMLElement | null = null;
        for (let i = index + 1; i < list.length; i += 1) {
          const next = nativeInMain.find((node) => node.dataset.cmsSection === list[i].type);
          if (next) {
            before = next;
            break;
          }
        }
        main.insertBefore(card, before);
      });
    };

    applySectionState(sections);

    if (!editorMode) return;

    document.documentElement.classList.add("koops-cms-preview");
    document.body.classList.add("koops-cms-preview");

    const editableNodes = () =>
      Array.from(shell.querySelectorAll<HTMLElement>(".koops-cms-editable-section"));
    let selectedType = "";

    const selectType = (sectionType: string, scroll = false) => {
      if (!sectionType) return;
      selectedType = sectionType;
      const current = editableNodes();
      current.forEach((node) => {
        node.classList.toggle("is-cms-selected", node.dataset.cmsSection === sectionType);
      });
      const target = current.find((node) => node.dataset.cmsSection === sectionType);
      if (scroll && target) target.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const onDocumentClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const section = event.target.closest<HTMLElement>(".koops-cms-editable-section");
      const interactive = event.target.closest("a, button, input, textarea, select, form");
      if (!section && !interactive) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const sectionType = section?.dataset.cmsSection || "";
      if (!sectionType) return;
      selectType(sectionType);
      postPreviewMessage({ type: "select-section", sectionType });
    };

    const onMessage = (event: MessageEvent<PreviewMessage>) => {
      const message = event.data;
      if (!message || message.source !== "koops-gutenberg-editor") return;

      if (message.type === "select-section" && message.sectionType) {
        selectType(message.sectionType, Boolean(message.scroll));
        return;
      }

      if (message.type === "sync-sections" && Array.isArray(message.sections)) {
        applySectionState(message.sections);
        if (message.sectionType) selectType(message.sectionType, Boolean(message.scroll));
        return;
      }

      if (message.type !== "update-section" || !message.sectionType || !message.changes) return;
      const targets = editableNodes().filter((node) => node.dataset.cmsSection === message.sectionType);
      const changedFields = Object.keys(message.changes);
      targets.forEach((node) => {
        const next = {
          id: message.sectionType || "preview",
          type: message.sectionType || "",
          enabled: message.changes?.enabled !== false,
          ...message.changes,
          overrides: changedFields,
        };
        applyAnchor(node, next);
        applyContent(node, next);
        if (Object.prototype.hasOwnProperty.call(message.changes, "enabled")) {
          node.classList.toggle("is-cms-disabled", message.changes?.enabled === false);
        }
      });
      if (selectedType === message.sectionType) selectType(selectedType);
    };

    document.addEventListener("click", onDocumentClick, true);
    window.addEventListener("message", onMessage);
    postPreviewMessage({ type: "ready", sectionType: selectedType });

    return () => {
      document.removeEventListener("click", onDocumentClick, true);
      window.removeEventListener("message", onMessage);
      document.documentElement.classList.remove("koops-cms-preview");
      document.body.classList.remove("koops-cms-preview");
      shell.querySelectorAll(".koops-cms-missing-section").forEach((node) => node.remove());
      editableNodes().forEach((node) => {
        node.classList.remove("koops-cms-editable-section", "is-cms-selected", "is-cms-disabled");
        delete node.dataset.cmsEditorLabel;
      });
    };
  }, [page, sections]);

  return null;
}
