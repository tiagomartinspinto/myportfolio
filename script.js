import { PROJECTS, PROJECT_DISPLAY_FILTERS } from "./data/projects.js";
import { SITE } from "./data/site.js";

const state = {
  activeFilter: "all",
  lastTrigger: null,
  lightboxTrigger: null,
  visibleCount: 0
};

const elements = {
  filterBar: document.querySelector("#project-filters"),
  loading: document.querySelector("#project-loading"),
  projectGrid: document.querySelector("#project-grid"),
  loadMoreButton: document.querySelector("#load-more-projects"),
  dialog: document.querySelector("#project-dialog"),
  dialogClose: document.querySelector("#project-dialog-close"),
  featureMedia: document.querySelector("#project-feature-media"),
  gallery: document.querySelector("#project-gallery"),
  lightbox: document.querySelector("#image-lightbox"),
  lightboxClose: document.querySelector("#image-lightbox-close"),
  lightboxImage: document.querySelector("#image-lightbox-image"),
  lightboxCaption: document.querySelector("#image-lightbox-caption"),
  dialogKicker: document.querySelector("#project-dialog-kicker"),
  dialogTitle: document.querySelector("#project-dialog-title"),
  dialogYear: document.querySelector("#project-year"),
  dialogRole: document.querySelector("#project-role"),
  dialogType: document.querySelector("#project-type"),
  dialogTags: document.querySelector("#project-tags"),
  dialogDescription: document.querySelector("#project-description"),
  dialogLinks: document.querySelector("#project-links")
};

const shellElements = {
  brand: document.querySelector("#site-brand"),
  mark: document.querySelector("#site-mark"),
  contact: document.querySelector("#site-contact"),
  footerSocialLinks: document.querySelector("#footer-social-links"),
  footerAboutTitle: document.querySelector("#footer-about-title"),
  footerAboutText: document.querySelector("#footer-about-text"),
  footerLocation: document.querySelector("#footer-location"),
  footerRoleLinks: document.querySelector("#footer-role-links"),
  localEditorLink: document.querySelector(".footer-local-editor"),
  localEditorToast: document.querySelector("#footer-local-editor-toast")
};

let localEditorToastTimer = null;

const publishedProjects = PROJECTS.filter((project) => project.draft !== true);

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const compactGridQuery = window.matchMedia("(max-width: 1100px)");

const FILTER_LABELS = {
  all: "All",
  learning: "Learning",
  community: "Community",
  research: "Research",
  exhibitions: "Exhibitions",
  web: "Web",
  "moving image": "Moving image"
};

const labelForFilter = (filter) =>
  FILTER_LABELS[filter] || filter;

const matchesFilter = (project, filter) =>
  filter === "all" || project.categories.includes(filter);

const getVisibleProjects = () =>
  publishedProjects.filter((project) => matchesFilter(project, state.activeFilter));

const getInitialProjectCount = () => (compactGridQuery.matches ? 6 : 8);

const getProjectRevealCount = () => (compactGridQuery.matches ? 3 : 4);

const resetVisibleCount = () => {
  state.visibleCount = getInitialProjectCount();
};

const isExternalUrl = (value) => /^https?:\/\//i.test(value);

const absoluteUrl = (value) => {
  if (!value) {
    return "";
  }

  if (isExternalUrl(value)) {
    return value;
  }

  return new URL(value, SITE.canonicalUrl).href;
};

const setMetaContent = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && value) {
    element.setAttribute("content", value);
  }
};

const renderLinkList = (container, links = []) => {
  const fragment = document.createDocumentFragment();

  links.forEach((link) => {
    const item = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.textContent = link.label;
    if (!link.url.startsWith("mailto:")) {
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
    }
    item.append(anchor);
    fragment.append(item);
  });

  container.replaceChildren(fragment);
};

const renderSiteShell = () => {
  document.title = SITE.title;
  setMetaContent("meta[name='description']", SITE.description);
  setMetaContent("meta[property='og:title']", SITE.ogTitle);
  setMetaContent("meta[property='og:description']", SITE.ogDescription);
  setMetaContent("meta[property='og:url']", SITE.canonicalUrl);
  setMetaContent("meta[property='og:image']", absoluteUrl(SITE.socialImage));
  setMetaContent("meta[property='og:image:alt']", SITE.socialImageAlt);
  setMetaContent("meta[name='twitter:title']", SITE.ogTitle);
  setMetaContent("meta[name='twitter:description']", SITE.ogDescription);
  setMetaContent("meta[name='twitter:image']", absoluteUrl(SITE.socialImage));
  setMetaContent("meta[name='twitter:image:alt']", SITE.socialImageAlt);
  document.querySelector("link[rel='canonical']")?.setAttribute("href", SITE.canonicalUrl);

  shellElements.brand.textContent = SITE.header.name;
  shellElements.mark.textContent = SITE.header.mark;
  shellElements.contact.textContent = SITE.header.contactLabel;
  shellElements.contact.href = `mailto:${SITE.header.contactEmail}`;
  shellElements.footerAboutTitle.textContent = SITE.footer.aboutTitle;
  shellElements.footerAboutText.replaceChildren(
    ...SITE.footer.aboutLines.flatMap((line, index) => {
      const nodes = [document.createTextNode(line)];
      if (index < SITE.footer.aboutLines.length - 1) {
        nodes.push(document.createElement("br"));
      }
      return nodes;
    })
  );
  shellElements.footerLocation.textContent = SITE.footer.location;
  renderLinkList(shellElements.footerSocialLinks, SITE.footer.socialLinks);
  renderLinkList(shellElements.footerRoleLinks, SITE.footer.roleLinks);
};

const showLocalEditorToast = () => {
  if (!shellElements.localEditorToast) {
    return;
  }

  shellElements.localEditorToast.hidden = false;
  shellElements.localEditorToast.classList.add("is-visible");

  window.clearTimeout(localEditorToastTimer);
  localEditorToastTimer = window.setTimeout(() => {
    shellElements.localEditorToast.classList.remove("is-visible");
    shellElements.localEditorToast.hidden = true;
  }, 6000);
};

const normalizeMediaItem = (item) => {
  if (!item || typeof item !== "object") {
    return null;
  }

  const type = item.type || "image";
  return {
    ...item,
    type,
    source: item.source || item.src || ""
  };
};

const getProjectMedia = (project) => {
  if (Array.isArray(project.media) && project.media.length) {
    return project.media.map(normalizeMediaItem).filter(Boolean);
  }

  return (project.images || []).map((image) => normalizeMediaItem({ type: "image", ...image })).filter(Boolean);
};

const getPrimaryVisualMedia = (project) => {
  const media = getProjectMedia(project);
  return media[0] || null;
};

const getThumbnailSource = (item) => {
  const media = normalizeMediaItem(item);
  if (!media) {
    return null;
  }

  if (media.type === "image") {
    return media.thumbnail || media.src || media.source;
  }

  if (media.thumbnail) {
    return media.thumbnail;
  }

  if (media.type === "video" && media.provider?.toLowerCase() === "youtube") {
    const id = getYouTubeId(media.source);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  }

  return null;
};

const getMediaTypeLabel = (item) => {
  const media = normalizeMediaItem(item);
  return media?.type || "media";
};

const createMediaPlaceholder = (label) => {
  const placeholder = document.createElement("span");
  placeholder.className = "media-placeholder";
  placeholder.textContent = label;
  return placeholder;
};

const getYouTubeId = (source) => {
  try {
    const url = new URL(source);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.split("/").filter(Boolean)[0] || "";
    }
    if (url.searchParams.get("v")) {
      return url.searchParams.get("v");
    }
    const parts = url.pathname.split("/").filter(Boolean);
    const embedIndex = parts.findIndex((part) => part === "embed" || part === "shorts");
    return embedIndex >= 0 ? parts[embedIndex + 1] || "" : "";
  } catch {
    return "";
  }
};

const getVimeoId = (source) => {
  try {
    const url = new URL(source);
    return url.pathname.split("/").filter(Boolean).find((part) => /^\d+$/.test(part)) || "";
  } catch {
    return "";
  }
};

const createMediaFigureContent = (item, projectTitle) => {
  const media = normalizeMediaItem(item);
  const source = media?.source || "";

  if (!media || !source) {
    const empty = document.createElement("div");
    empty.className = "media-placeholder";
    empty.textContent = "Media unavailable";
    return empty;
  }

  if (media.type === "image") {
    const image = document.createElement("img");
    image.src = source;
    image.alt = media.alt || `${projectTitle} image`;
    if (media.width) {
      image.width = media.width;
    }
    if (media.height) {
      image.height = media.height;
    }
    image.loading = "eager";
    image.decoding = "async";
    return image;
  }

  if (media.type === "video") {
    if (media.provider === "youtube") {
      const id = getYouTubeId(source);
      if (id) {
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube-nocookie.com/embed/${id}`;
        iframe.title = media.caption || `${projectTitle} video`;
        iframe.loading = "lazy";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        return iframe;
      }
    }

    if (media.provider === "vimeo") {
      const id = getVimeoId(source);
      if (id) {
        const iframe = document.createElement("iframe");
        iframe.src = `https://player.vimeo.com/video/${id}`;
        iframe.title = media.caption || `${projectTitle} video`;
        iframe.loading = "lazy";
        iframe.allow = "autoplay; fullscreen; picture-in-picture";
        iframe.allowFullscreen = true;
        return iframe;
      }
    }

    const video = document.createElement("video");
    video.controls = true;
    video.preload = "metadata";
    video.src = source;
    if (media.thumbnail) {
      video.poster = media.thumbnail;
    }
    return video;
  }

  if (media.type === "audio") {
    if (media.provider === "soundcloud") {
      const iframe = document.createElement("iframe");
      iframe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(source)}`;
      iframe.title = media.caption || `${projectTitle} audio`;
      iframe.loading = "lazy";
      iframe.allow = "autoplay";
      return iframe;
    }

    const audio = document.createElement("audio");
    audio.controls = true;
    audio.preload = "metadata";
    audio.src = source;
    return audio;
  }

  const link = document.createElement("a");
  link.href = source;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = media.caption || "Open media";
  return link;
};

const createMediaCaption = (item) => {
  if (!item?.caption) {
    return null;
  }

  const caption = document.createElement("figcaption");
  caption.className = "project-dialog__caption";
  caption.textContent = item.caption;
  return caption;
};

const createFilterButton = (filter) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "filter-pill";
  button.dataset.filter = filter;
  button.textContent = labelForFilter(filter);
  button.setAttribute("aria-pressed", String(filter === state.activeFilter));

  button.addEventListener("click", () => {
    setFilter(filter);
  });

  return button;
};

const renderFilters = () => {
  elements.filterBar.replaceChildren(...PROJECT_DISPLAY_FILTERS.map(createFilterButton));
};

const markImageLoaded = (image) => {
  const setLoaded = () => image.classList.add("is-loaded");

  if (image.complete && image.naturalWidth > 0) {
    setLoaded();
    return;
  }

  image.addEventListener("load", setLoaded, { once: true });
  image.addEventListener("error", setLoaded, { once: true });
};

const isFullyExpanded = (totalProjects) => state.visibleCount >= totalProjects;

const updateLoadMoreButton = (totalProjects) => {
  const initialCount = getInitialProjectCount();
  const hasExpandableProjects = totalProjects > initialCount;
  const hasMore = state.visibleCount < totalProjects;
  const expanded = hasExpandableProjects && isFullyExpanded(totalProjects);

  elements.loadMoreButton.hidden = !hasExpandableProjects;
  elements.loadMoreButton.textContent = expanded ? "−" : "+";
  elements.loadMoreButton.setAttribute("aria-label", expanded ? "Show fewer projects" : "Load more projects");
  elements.loadMoreButton.title = expanded ? "Show fewer projects" : "Load more projects";
};

const closeImageLightbox = ({ restoreFocus = true } = {}) => {
  if (!restoreFocus) {
    state.lightboxTrigger = null;
  }

  if (elements.lightbox.open) {
    elements.lightbox.close();
  }
};

const openImageLightbox = (media, projectTitle, trigger) => {
  const source = media?.source || media?.src;
  if (!source) {
    return;
  }

  state.lightboxTrigger = trigger || document.activeElement;
  elements.lightboxImage.src = source;
  elements.lightboxImage.alt = media.alt || `${projectTitle} image`;
  if (media.width) {
    elements.lightboxImage.width = media.width;
  } else {
    elements.lightboxImage.removeAttribute("width");
  }
  if (media.height) {
    elements.lightboxImage.height = media.height;
  } else {
    elements.lightboxImage.removeAttribute("height");
  }
  elements.lightboxCaption.textContent = media.caption || "";
  elements.lightboxCaption.hidden = !media.caption;
  elements.lightbox.showModal();
  elements.lightboxClose.focus();
};

const createImageOpenButton = (media, projectTitle, image) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "project-dialog__image-open";
  button.setAttribute("aria-label", "View image larger");
  button.title = "View image larger";

  const label = document.createElement("span");
  label.className = "project-dialog__larger-label";
  label.textContent = "⤢";

  button.append(image, label);
  button.addEventListener("click", () => openImageLightbox(media, projectTitle, button));
  return button;
};

const renderProjects = () => {
  const visibleProjects = getVisibleProjects();
  const projectsToRender = visibleProjects.slice(0, state.visibleCount);
  const fragment = document.createDocumentFragment();

  projectsToRender.forEach((project, index) => {
    const card = document.createElement("article");
    card.className = "project-card";
    card.style.setProperty("--card-index", String(index));

    const button = document.createElement("button");
    button.type = "button";
    button.className = "project-card__button";
    button.setAttribute("aria-label", `Open project: ${project.title}`);
    button.addEventListener("click", () => openProject(project, button));

    const media = getPrimaryVisualMedia(project);
    const thumbnailSource = getThumbnailSource(media);
    const imageWrap = document.createElement("div");
    imageWrap.className = "project-card__image";
    imageWrap.style.setProperty("--thumb-position", project.thumbnailPosition || "center center");
    imageWrap.style.setProperty("--thumb-zoom", String(project.thumbnailZoom || 1));
    if (thumbnailSource) {
      const image = document.createElement("img");
      image.src = thumbnailSource;
      image.alt = media?.alt || `${project.title} thumbnail`;
      if (media?.width) {
        image.width = media.width;
      }
      if (media?.height) {
        image.height = media.height;
      }
      image.loading = "lazy";
      image.decoding = "async";
      image.sizes = "(max-width: 520px) 100vw, (max-width: 860px) 50vw, (max-width: 1100px) 33vw, 25vw";
      markImageLoaded(image);
      imageWrap.append(image);
    } else {
      const placeholderLabel = media?.type && media.type !== "image" ? getMediaTypeLabel(media) : project.title;
      imageWrap.append(createMediaPlaceholder(placeholderLabel));
    }

    const body = document.createElement("div");
    body.className = "project-card__body";
    const title = document.createElement("h3");
    title.textContent = project.title;
    const line = document.createElement("p");
    line.className = "project-card__line";
    line.textContent = project.shortDescription;
    body.append(title, line);

    button.append(imageWrap, body);
    card.append(button);
    fragment.append(card);
  });

  elements.projectGrid.replaceChildren(fragment);
  elements.loading.hidden = true;
  updateLoadMoreButton(visibleProjects.length);
};

const updateFeatureMedia = (item, projectTitle) => {
  const media = normalizeMediaItem(item);
  const content = createMediaFigureContent(media, projectTitle);
  const caption = createMediaCaption(media);
  const frame = document.createElement("div");
  frame.className = "project-dialog__media-frame";
  frame.dataset.mediaType = media?.type || "unknown";
  if (media?.type === "image" && content instanceof HTMLImageElement) {
    frame.append(createImageOpenButton(media, projectTitle, content));
  } else {
    frame.append(content);
  }
  elements.featureMedia.replaceChildren(...[frame, caption].filter(Boolean));
};

const renderGallery = (project) => {
  const mediaItems = getProjectMedia(project);

  if (mediaItems.length <= 1) {
    elements.gallery.replaceChildren();
    elements.gallery.hidden = true;
    return;
  }

  elements.gallery.hidden = false;
  const fragment = document.createDocumentFragment();

  mediaItems.forEach((item, index) => {
    const thumbnailSource = getThumbnailSource(item);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-thumb";
    button.dataset.mediaType = item.type || "media";
    button.setAttribute("aria-label", `Show ${item.type || "media"} ${index + 1} for ${project.title}`);
    button.setAttribute("aria-pressed", String(index === 0));

    if (thumbnailSource) {
      const image = document.createElement("img");
      image.src = thumbnailSource;
      image.alt = item.alt || item.caption || `${project.title} media ${index + 1}`;
      if (item.width) {
        image.width = item.width;
      }
      if (item.height) {
        image.height = item.height;
      }
      image.loading = "lazy";
      image.decoding = "async";
      image.sizes = "160px";
      button.append(image);
    } else {
      const label = document.createElement("span");
      label.className = "gallery-thumb__label";
      label.textContent = getMediaTypeLabel(item);
      button.append(label);
    }

    button.addEventListener("click", () => {
      updateFeatureMedia(item, project.title);
      elements.gallery.querySelectorAll(".gallery-thumb").forEach((thumb) => {
        thumb.setAttribute("aria-pressed", String(thumb === button));
      });
    });

    fragment.append(button);
  });

  elements.gallery.replaceChildren(fragment);
};

const renderProjectDetail = (project) => {
  updateFeatureMedia(getProjectMedia(project)[0], project.title);
  renderGallery(project);

  elements.dialogKicker.textContent = `${project.projectType} / ${project.year}`;
  elements.dialogTitle.textContent = project.title;
  elements.dialogYear.textContent = project.year;
  elements.dialogRole.textContent = project.role;
  elements.dialogType.textContent = project.projectType;

  elements.dialogTags.replaceChildren(
    ...project.categories.map((tag) => {
      const item = document.createElement("li");
      item.textContent = labelForFilter(tag);
      return item;
    })
  );

  elements.dialogDescription.replaceChildren(
    ...project.fullDescription.map((paragraph) => {
      const element = document.createElement("p");
      element.textContent = paragraph;
      return element;
    })
  );

  const linksFragment = document.createDocumentFragment();
  project.links.forEach((link) => {
    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.textContent = link.label;
    if (link.url.startsWith("mailto:")) {
      anchor.target = "_self";
    } else {
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
    }
    linksFragment.append(anchor);
  });
  elements.dialogLinks.replaceChildren(linksFragment);
  elements.dialogLinks.hidden = project.links.length === 0;
};

const getDialogFocusable = () =>
  Array.from(
    elements.dialog.querySelectorAll(
      "button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    )
  );

const trapDialogFocus = (event) => {
  if (event.key !== "Tab") {
    return;
  }

  const focusable = getDialogFocusable();
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (!first || !last) {
    return;
  }

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

const openProject = (project, trigger) => {
  state.lastTrigger = trigger || document.activeElement;
  renderProjectDetail(project);
  elements.dialog.showModal();
  elements.dialog.scrollTop = 0;
  elements.dialogClose.focus();
};

const closeProject = () => {
  closeImageLightbox({ restoreFocus: false });
  if (elements.dialog.open) {
    elements.dialog.close();
  }
};

const handleDialogKeydown = (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeProject();
    return;
  }

  trapDialogFocus(event);
};

const setFilter = (filter) => {
  state.activeFilter = filter;
  resetVisibleCount();

  elements.filterBar.querySelectorAll(".filter-pill").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === filter);
    button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
  });

  renderProjects();
};

const toggleProjectCount = () => {
  const visibleProjects = getVisibleProjects();
  const shouldCollapse = isFullyExpanded(visibleProjects.length);

  state.visibleCount = shouldCollapse
    ? getInitialProjectCount()
    : Math.min(visibleProjects.length, state.visibleCount + getProjectRevealCount());

  renderProjects();

  if (shouldCollapse) {
    document.querySelector("#work")?.scrollIntoView({
      behavior: reducedMotionQuery.matches ? "auto" : "smooth",
      block: "start"
    });
  }
};

elements.loadMoreButton.addEventListener("click", toggleProjectCount);

elements.dialogClose.addEventListener("click", closeProject);

elements.dialog.addEventListener("click", (event) => {
  if (event.target === elements.dialog) {
    closeProject();
  }
});

elements.dialog.addEventListener("keydown", handleDialogKeydown);

elements.dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeProject();
});

elements.dialog.addEventListener("close", () => {
  const trigger = state.lastTrigger;
  state.lastTrigger = null;
  if (trigger instanceof HTMLElement) {
    trigger.focus();
  }
});

elements.lightboxClose.addEventListener("click", () => closeImageLightbox());

elements.lightbox.addEventListener("click", (event) => {
  if (event.target === elements.lightbox || event.target.classList.contains("image-lightbox__figure")) {
    closeImageLightbox();
  }
});

elements.lightbox.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeImageLightbox();
});

elements.lightbox.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeImageLightbox();
  }
});

elements.lightbox.addEventListener("close", () => {
  elements.lightboxImage.removeAttribute("src");
  elements.lightboxCaption.textContent = "";
  const trigger = state.lightboxTrigger;
  state.lightboxTrigger = null;
  if (trigger instanceof HTMLElement) {
    trigger.focus();
  }
});

shellElements.localEditorLink?.addEventListener("click", showLocalEditorToast);

renderSiteShell();
renderFilters();
resetVisibleCount();
setFilter("all");

const markPageReady = () => {
  document.body.classList.remove("is-building");
  document.body.classList.add("is-ready");
};

if (reducedMotionQuery.matches) {
  markPageReady();
} else {
  window.requestAnimationFrame(markPageReady);
}
