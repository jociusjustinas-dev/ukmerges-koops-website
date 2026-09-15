"use client";

import { useLayoutEffect } from "react";
import type { CmsPageSection } from "../lib/cms-render";

type Props = {
  page: string;
  sections?: CmsPageSection[];
};

type ItemRecord = Record<string, unknown>;

function setParagraphs(target: Element | null, value?: string | null, allowEmpty = false) {
  if (!target) return;
  const raw = value == null ? "" : String(value);
  const trimmed = raw.trim();
  if (!trimmed) {
    const fallback = target.getAttribute("data-cms-default");
    if (fallback != null && fallback.trim()) {
      setParagraphs(target, fallback, true);
      return;
    }
    if (allowEmpty) target.replaceChildren();
    return;
  }
  const parts = trimmed
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
  target.replaceChildren(
    ...parts.map((paragraph, index) => {
      const p = document.createElement("p");
      if (index === parts.length - 1) p.className = "about-intro-closing";
      p.textContent = paragraph;
      return p;
    }),
  );
}

function setText(target: Element | null, value?: string | null, allowEmpty = false) {
  if (!target) return;
  if (target.getAttribute("data-cms-format") === "paragraphs") {
    setParagraphs(target, value, allowEmpty);
    return;
  }
  const raw = value == null ? "" : String(value);
  const trimmed = raw.trim();
  if (!trimmed) {
    const fallback = target.getAttribute("data-cms-default");
    if (fallback != null) {
      target.textContent = fallback;
      return;
    }
    if (allowEmpty) target.textContent = "";
    return;
  }
  target.textContent = trimmed;
  if (target.matches("h1, h2, .location-headline")) {
    (target as HTMLElement).style.whiteSpace = "pre-line";
  }
}

function captureDefaults(root: HTMLElement) {
  if (!root.hasAttribute("data-cms-default-anchor")) {
    root.setAttribute("data-cms-default-anchor", root.id || "");
  }

  root.querySelectorAll<HTMLElement>("[data-cms-field]").forEach((el) => {
    if (!el.hasAttribute("data-cms-default")) {
      if (el.getAttribute("data-cms-format") === "paragraphs") {
        const parts = Array.from(el.querySelectorAll("p"))
          .map((p) => (p.textContent || "").trim())
          .filter(Boolean);
        el.setAttribute("data-cms-default", parts.join("\n\n"));
      } else {
        el.setAttribute("data-cms-default", el.textContent || "");
      }
    }
  });

  const button = root.querySelector<HTMLAnchorElement>("[data-cms-field='primary-link'], a.pill-button, a.text-link");
  if (button) {
    if (!button.hasAttribute("data-cms-default-href")) {
      button.setAttribute("data-cms-default-href", button.getAttribute("href") || "");
    }
    const label = button.querySelector<HTMLElement>(".avenir-button-text") || button;
    if (!label.hasAttribute("data-cms-default")) {
      label.setAttribute("data-cms-default", label.textContent || "");
    }
  }

  root.querySelectorAll<HTMLElement>("[data-cms-item-field]").forEach((el) => {
    if (!el.hasAttribute("data-cms-default")) {
      el.setAttribute("data-cms-default", el.textContent || "");
    }
  });

  root.querySelectorAll<HTMLAnchorElement>("[data-cms-item][href], [data-cms-item] a[href]").forEach((el) => {
    if (!el.hasAttribute("data-cms-default-href")) {
      el.setAttribute("data-cms-default-href", el.getAttribute("href") || "");
    }
  });

  root.querySelectorAll<HTMLImageElement>("[data-cms-item-image], [data-cms-field='image'], [data-cms-field='gallery-item']").forEach((el) => {
    if (!el.hasAttribute("data-cms-default-src")) {
      el.setAttribute("data-cms-default-src", el.getAttribute("src") || "");
    }
  });
}

function applyContent(root: HTMLElement, section: CmsPageSection, changed?: Set<string>) {
  const overrides = changed || new Set(section.overrides || []);
  const allowEmpty = Boolean(changed);

  if (overrides.has("eyebrow")) {
    setText(root.querySelector("[data-cms-field='eyebrow']"), section.eyebrow, allowEmpty);
  }
  if (overrides.has("title")) {
    setText(root.querySelector("[data-cms-field='title']"), section.title, allowEmpty);
  }
  if (overrides.has("description")) {
    setText(root.querySelector("[data-cms-field='description']"), section.description, allowEmpty);
  }

  const button = root.querySelector<HTMLAnchorElement>("[data-cms-field='primary-link']");
  if (button && overrides.has("primaryUrl")) {
    const next = section.primaryUrl?.trim();
    if (next) button.href = next;
    else button.href = button.getAttribute("data-cms-default-href") || button.href;
  }
  if (button && overrides.has("primaryLabel")) {
    const label = button.querySelector<HTMLElement>(".avenir-button-text") || button;
    setText(label, section.primaryLabel, allowEmpty);
  }

  if (overrides.has("imageUrl")) {
    const image = root.querySelector<HTMLImageElement>("[data-cms-field='image']");
    const next = section.imageUrl?.trim();
    if (next) applyImage(image, next);
    else if (image) applyImage(image, image.getAttribute("data-cms-default-src") || undefined);
  }

  if (overrides.has("galleryUrls")) {
    root.querySelectorAll<HTMLImageElement>("[data-cms-field='gallery-item']").forEach((image, index) => {
      const next = section.galleryUrls?.[index]?.trim();
      if (next) applyImage(image, next);
      else applyImage(image, image.getAttribute("data-cms-default-src") || undefined);
    });
  }

  if (overrides.has("items") && Array.isArray(section.items)) {
    applySectionItems(root, section.items as ItemRecord[]);
  }
}

function applySectionItems(root: HTMLElement, items: ItemRecord[]) {
  if (root.querySelector(".stores-faq-list")) {
    applyFaqItems(root, items);
    return;
  }

  const marked = root.querySelectorAll("[data-cms-item]");
  if (!marked.length) return;

  items.forEach((item, index) => {
    const nodes = root.querySelectorAll<HTMLElement>(`[data-cms-item="${index}"]`);
    nodes.forEach((node) => {
      Object.entries(item).forEach(([key, value]) => {
        if (key === "imageUrl" || key === "imageId") return;
        if (key === "href") {
          const next = String(value || "").trim();
          const anchors =
            node instanceof HTMLAnchorElement
              ? [node]
              : Array.from(node.querySelectorAll<HTMLAnchorElement>("a[href]"));
          anchors.forEach((anchor) => {
            anchor.href = next || anchor.getAttribute("data-cms-default-href") || anchor.href;
          });
          return;
        }
        const field = node.querySelector(`[data-cms-item-field="${key}"]`);
        if (!field) return;
        setText(field, value == null ? "" : String(value), true);
      });
    });

    const image = root.querySelector<HTMLImageElement>(`[data-cms-item-image="${index}"]`);
    if (image) {
      const next = String(item.imageUrl || "").trim();
      if (next) applyImage(image, next);
      else applyImage(image, image.getAttribute("data-cms-default-src") || undefined);
    }
  });
}

function applyFaqItems(root: HTMLElement, items: ItemRecord[]) {
  const list = root.querySelector(".stores-faq-list");
  if (!list) return;
  list.replaceChildren();
  items.forEach((item, index) => {
    const question = String(item.question || "").trim();
    const answer = String(item.answer || "").trim();
    if (!question && !answer) return;
    const details = document.createElement("details");
    if (index === 0) details.open = true;
    details.setAttribute("data-cms-item", String(index));
    const summary = document.createElement("summary");
    const questionSpan = document.createElement("span");
    questionSpan.setAttribute("data-cms-item-field", "question");
    questionSpan.setAttribute("data-cms-default", question);
    questionSpan.textContent = question;
    const toggle = document.createElement("span");
    toggle.className = "stores-faq-toggle";
    toggle.setAttribute("aria-hidden", "true");
    summary.append(questionSpan, toggle);
    const paragraph = document.createElement("p");
    paragraph.setAttribute("data-cms-item-field", "answer");
    paragraph.setAttribute("data-cms-default", answer);
    paragraph.textContent = answer;
    details.append(summary, paragraph);
    list.appendChild(details);
  });
}

function applyAnchor(root: HTMLElement, section: CmsPageSection, allowEmpty = false) {
  if (root.classList.contains("tt-hero-spacer")) {
    root.removeAttribute("id");
    return;
  }
  const id = (section.anchor || "").trim();
  if (id) {
    root.id = id;
    return;
  }
  if (!allowEmpty && !("anchor" in (section as object))) return;
  const fallback = root.getAttribute("data-cms-default-anchor") || "";
  if (fallback) root.id = fallback;
  else root.removeAttribute("id");
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
    nodes.forEach((node) => captureDefaults(node));

    const applySectionState = (list: CmsPageSection[]) => {
      const byType = new Map(list.map((section, index) => [section.type, { section, index }]));
      nodes.forEach((node) => {
        const entry = byType.get(node.dataset.cmsSection || "");
        node.hidden = !entry || (!entry.section.enabled && !editorMode);
        if (!entry) return;
        node.style.order = String(entry.index);
        applyAnchor(node, entry.section, editorMode);
        applyContent(node, entry.section, editorMode ? new Set(entry.section.overrides || [
          "eyebrow",
          "title",
          "description",
          "primaryLabel",
          "primaryUrl",
          "imageUrl",
          "galleryUrls",
          "items",
        ]) : undefined);
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
      const changedFields = new Set(Object.keys(message.changes));
      targets.forEach((node) => {
        const next = {
          id: message.sectionType || "preview",
          type: message.sectionType || "",
          enabled: message.changes?.enabled !== false,
          ...message.changes,
          overrides: Array.from(changedFields),
        };
        applyAnchor(node, next, changedFields.has("anchor"));
        applyContent(node, next, changedFields);
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
