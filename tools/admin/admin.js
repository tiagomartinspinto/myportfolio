import {
  clearCanvas,
  downloadCanvasAsPng,
  drawCroppedThumbnail,
  formatObjectPosition,
  parseObjectPosition,
  parseThumbnailZoom
} from "./thumbnail-tools.js";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);
const currentSearchParams = new URLSearchParams(window.location.search);
const runtime = {
  forcePublicMode: currentSearchParams.get("admin-public") === "1",
  isLocalhost: LOCAL_HOSTS.has(window.location.hostname),
  isDevMode: currentSearchParams.get("admin-dev") === "1" || currentSearchParams.get("dev") === "1",
  isGitHubPages: window.location.hostname.endsWith("github.io")
};
runtime.canUseLocalApi = !runtime.forcePublicMode && (runtime.isLocalhost || runtime.isDevMode);

const state = {
  filters: [],
  projects: [],
  sourceProjects: [],
  site: null,
  sourceSite: null,
  selectedIndex: null,
  loadedSnapshot: "",
  savedProjectsSnapshot: "",
  savedSiteSnapshot: "",
  backupExists: false,
  previewUrl: "http://127.0.0.1:8080/",
  imageLibrary: {
    folders: [],
    flatFiles: [],
    fileMap: new Map()
  },
  selectedLibraryFolder: "",
  activeImageRowId: null,
  nextImageRowId: 1,
  cropRenderToken: 0,
  theme: "dark",
  previewWindow: null,
  runtime
};

const elements = {
  runtimeBanner: document.querySelector("#runtime-banner"),
  runtimeModeMessage: document.querySelector("#runtime-mode-message"),
  editorMode: document.querySelector("#editor-mode"),
  editorStatus: document.querySelector("#editor-status"),
  gitOutput: document.querySelector("#git-output"),
  previewLink: document.querySelector("#preview-link"),
  search: document.querySelector("#project-search"),
  reloadButton: document.querySelector("#reload-button"),
  undoSaveButton: document.querySelector("#undo-save-button"),
  restoreBackupButton: document.querySelector("#restore-backup-button"),
  saveButton: document.querySelector("#save-button"),
  savePreviewButton: document.querySelector("#save-preview-button"),
  runCheckButton: document.querySelector("#run-check-button"),
  publishButton: document.querySelector("#publish-button"),
  themeToggleButton: document.querySelector("#theme-toggle-button"),
  newProjectButton: document.querySelector("#new-project-button"),
  duplicateProjectButton: document.querySelector("#duplicate-project-button"),
  applyProjectButton: document.querySelector("#apply-project-button"),
  moveProjectUpButton: document.querySelector("#move-project-up-button"),
  moveProjectDownButton: document.querySelector("#move-project-down-button"),
  moveProjectTopButton: document.querySelector("#move-project-top-button"),
  deleteProjectButton: document.querySelector("#delete-project-button"),
  resetFormButton: document.querySelector("#reset-form-button"),
  projectCount: document.querySelector("#project-count"),
  projectList: document.querySelector("#project-list"),
  form: document.querySelector("#project-form"),
  slug: document.querySelector("#slug"),
  draft: document.querySelector("#draft"),
  title: document.querySelector("#title"),
  year: document.querySelector("#year"),
  projectType: document.querySelector("#projectType"),
  role: document.querySelector("#role"),
  thumbnailPosition: document.querySelector("#thumbnailPosition"),
  thumbnailZoom: document.querySelector("#thumbnailZoom"),
  thumbnailPanX: document.querySelector("#thumbnail-pan-x"),
  thumbnailPanY: document.querySelector("#thumbnail-pan-y"),
  thumbnailPanXOutput: document.querySelector("#thumbnail-pan-x-output"),
  thumbnailPanYOutput: document.querySelector("#thumbnail-pan-y-output"),
  thumbnailZoomRange: document.querySelector("#thumbnail-zoom-range"),
  thumbnailZoomOutput: document.querySelector("#thumbnail-zoom-output"),
  thumbnailSourceLabel: document.querySelector("#thumbnail-source-label"),
  thumbnailCropWarning: document.querySelector("#thumbnail-crop-warning"),
  largeImagePreview: document.querySelector("#large-image-preview"),
  thumbnailCropPreview: document.querySelector("#thumbnail-crop-preview"),
  thumbnailCanvasPreview: document.querySelector("#thumbnail-canvas-preview"),
  downloadCropButton: document.querySelector("#download-crop-button"),
  tags: document.querySelector("#tags"),
  shortDescription: document.querySelector("#shortDescription"),
  categoryOptions: document.querySelector("#category-options"),
  paragraphList: document.querySelector("#paragraph-list"),
  linkList: document.querySelector("#link-list"),
  imageList: document.querySelector("#image-list"),
  imageFolderSelect: document.querySelector("#image-folder-select"),
  imageLibraryGrid: document.querySelector("#image-library-grid"),
  imageLibraryTarget: document.querySelector("#image-library-target"),
  imageDiagnostics: document.querySelector("#image-diagnostics"),
  addParagraphButton: document.querySelector("#add-paragraph-button"),
  addLinkButton: document.querySelector("#add-link-button"),
  addImageButton: document.querySelector("#add-image-button"),
  addVideoButton: document.querySelector("#add-video-button"),
  addAudioButton: document.querySelector("#add-audio-button"),
  copyCurrentButton: document.querySelector("#copy-current-button"),
  downloadCurrentButton: document.querySelector("#download-current-button"),
  preview: document.querySelector("#object-preview"),
  miniProjectImage: document.querySelector("#mini-project-image"),
  miniProjectTitle: document.querySelector("#mini-project-title"),
  miniProjectDescription: document.querySelector("#mini-project-description"),
  paragraphTemplate: document.querySelector("#paragraph-template"),
  linkTemplate: document.querySelector("#link-template"),
  imageTemplate: document.querySelector("#image-template"),
  thumbnailPresetButtons: Array.from(document.querySelectorAll("[data-thumbnail-preset]")),
  tabButtons: Array.from(document.querySelectorAll("[data-tab-target]")),
  tabPanels: Array.from(document.querySelectorAll("[data-tab-panel]")),
  siteTitle: document.querySelector("#site-title"),
  siteDescription: document.querySelector("#site-description"),
  siteOgTitle: document.querySelector("#site-og-title"),
  siteOgDescription: document.querySelector("#site-og-description"),
  siteSocialImage: document.querySelector("#site-social-image"),
  siteSocialImageAlt: document.querySelector("#site-social-image-alt"),
  siteCanonicalUrl: document.querySelector("#site-canonical-url"),
  siteHeaderName: document.querySelector("#site-header-name"),
  siteHeaderMark: document.querySelector("#site-header-mark"),
  siteContactLabel: document.querySelector("#site-contact-label"),
  siteContactEmail: document.querySelector("#site-contact-email"),
  siteAboutTitle: document.querySelector("#site-about-title"),
  siteAboutLines: document.querySelector("#site-about-lines"),
  siteLocation: document.querySelector("#site-location"),
  siteSocialLinkList: document.querySelector("#site-social-link-list"),
  siteRoleLinkList: document.querySelector("#site-role-link-list"),
  addSiteSocialLinkButton: document.querySelector("#add-site-social-link-button"),
  addSiteRoleLinkButton: document.querySelector("#add-site-role-link-button")
};

const deepClone = (value) => JSON.parse(JSON.stringify(value));

const createBlankProject = () => ({
  slug: "",
  draft: false,
  title: "",
  year: "",
  projectType: "",
  role: "",
  categories: [],
  tags: [],
  shortDescription: "",
  fullDescription: [""],
  links: [{ label: "", url: "" }],
  media: [{ type: "image", src: "", alt: "", width: "", height: "" }],
  thumbnailPosition: "",
  thumbnailZoom: ""
});

const createBlankSite = () => ({
  title: "",
  description: "",
  ogTitle: "",
  ogDescription: "",
  socialImage: "",
  socialImageAlt: "",
  canonicalUrl: "",
  header: {
    name: "",
    mark: "",
    contactLabel: "",
    contactEmail: ""
  },
  footer: {
    socialLinks: [{ label: "", url: "" }],
    aboutTitle: "",
    aboutLines: [""],
    location: "",
    roleLinks: [{ label: "", url: "" }]
  }
});

const labelForCategory = (category) =>
  category
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const normalizeAssetPath = (value) => String(value || "").trim().replace(/\\/g, "/").replace(/^\/+/, "");

const isValidAssetPath = (value) => normalizeAssetPath(value).startsWith("assets/projects/");

const isRemoteUrl = (value) => /^https?:\/\//i.test(String(value || "").trim());

const mediaItemsForProject = (project = {}) => {
  if (Array.isArray(project.media) && project.media.length) {
    return project.media.map((item) => ({
      type: item.type || "image",
      provider: item.provider || "",
      src: item.src || item.source || "",
      alt: item.alt || "",
      caption: item.caption || "",
      thumbnail: item.thumbnail || "",
      width: item.width ?? "",
      height: item.height ?? ""
    }));
  }

  return (project.images || []).map((image) => ({
    type: "image",
    provider: "",
    src: image.src || "",
    alt: image.alt || "",
    caption: image.caption || "",
    thumbnail: "",
    width: image.width ?? "",
    height: image.height ?? ""
  }));
};

const imageMediaItemsForProject = (project = {}) =>
  mediaItemsForProject(project).filter((item) => item.type === "image");

const formatList = (items) => (items.length ? items.join(", ") : "none");

const setStatus = (message) => {
  elements.editorStatus.textContent = message;
};

const setGitOutput = (value) => {
  elements.gitOutput.textContent = value || "No git output yet.";
};

const errorSummary = (error, fallback = "Action failed.") =>
  error?.payload?.message || error?.message || fallback;

const errorDetails = (error) =>
  error?.payload?.output || error?.payload?.errors?.join("\n") || error?.payload?.message || error?.message || "";

const reportActionError = (actionLabel, error) => {
  setStatus(`${actionLabel} failed: ${errorSummary(error)}`);
  setGitOutput(errorDetails(error));
};

const publicDisabledMessage = () => "Publishing disabled on public site.";

const updateRuntimeUi = () => {
  document.documentElement.dataset.runtime = state.runtime.canUseLocalApi ? "local" : "public";

  if (state.runtime.canUseLocalApi) {
    elements.runtimeModeMessage.textContent = state.runtime.isDevMode
      ? "Developer mode is enabled. Write actions still require a compatible local API, git access, and repository write permissions."
      : "Local mode active. Save and publish actions use this computer's local filesystem and git credentials.";
    return;
  }

  elements.runtimeModeMessage.textContent =
    "Publishing disabled on public site. Editing, previews, and project-data export are available; save, publish, and filesystem access are blocked.";
};

const assetUrlForSrc = (src) => {
  const normalized = normalizeAssetPath(src);
  if (!normalized) {
    return "";
  }

  return state.runtime.canUseLocalApi
    ? `/${encodeURI(normalized)}`
    : new URL(`../../${normalized}`, import.meta.url).href;
};

const staticSitePreviewUrl = () => new URL("../../", import.meta.url).href;

const blockLocalApiAction = (actionLabel = "Action") => {
  if (state.runtime.canUseLocalApi) {
    return false;
  }

  const message = `${actionLabel} blocked. ${publicDisabledMessage()}`;
  setStatus(message);
  setGitOutput(`${publicDisabledMessage()}\n\nOpen http://127.0.0.1:8787/ after running npm run admin to save or publish.`);
  return true;
};

const updateBackupButtons = () => {
  elements.undoSaveButton.disabled = !state.runtime.canUseLocalApi || !state.backupExists;
  elements.restoreBackupButton.disabled = !state.runtime.canUseLocalApi || !state.backupExists;
};

const updateLocalActionButtons = () => {
  const disabled = !state.runtime.canUseLocalApi;
  elements.saveButton.disabled = disabled;
  elements.savePreviewButton.disabled = disabled;
  elements.runCheckButton.disabled = disabled;
  elements.publishButton.disabled = disabled;
  elements.saveButton.title = disabled ? "Save locally is disabled on public site." : "";
  elements.savePreviewButton.title = disabled ? "Save + Preview is disabled on public site." : "";
  elements.runCheckButton.title = disabled ? "Run check is disabled on public site." : "";
  elements.publishButton.title = disabled ? "Publishing disabled on public site." : "";
  elements.imageFolderSelect.disabled = disabled;
  updateBackupButtons();
};

const parseJsonResponse = async (response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const apiRequest = async (path, options = {}) => {
  if (!state.runtime.canUseLocalApi) {
    throw new Error("Local API and filesystem access are disabled outside localhost.");
  }

  const response = await fetch(path, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.headers || {})
    }
  });

  const payload = await parseJsonResponse(response);
  if (!response.ok) {
    const message = payload?.message || payload?.error || `Request failed: ${response.status}`;
    const error = new Error(message);
    error.payload = payload;
    throw error;
  }

  return payload;
};

const copyText = async (value, message) => {
  try {
    await navigator.clipboard.writeText(value);
    setStatus(message);
  } catch {
    setStatus("Clipboard copy failed. Copy from the preview manually.");
  }
};

const downloadText = (filename, content, type = "application/json") => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const applyTheme = (theme) => {
  state.theme = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = state.theme;
  elements.themeToggleButton.textContent = state.theme === "dark" ? "Light mode" : "Dark mode";
  localStorage.setItem("portfolio-admin-theme", state.theme);
};

const initTheme = () => {
  applyTheme(localStorage.getItem("portfolio-admin-theme") || "dark");
};

const showTab = (target) => {
  elements.tabButtons.forEach((button) => {
    const active = button.dataset.tabTarget === target;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });

  elements.tabPanels.forEach((panel) => {
    const active = panel.dataset.tabPanel === target;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });
};

const parseNumber = (value) => {
  const trimmed = String(value).trim();
  if (!trimmed) {
    return undefined;
  }

  const numeric = Number(trimmed);
  return Number.isFinite(numeric) ? numeric : undefined;
};

const formatZoomOutput = (value) => `${parseThumbnailZoom(value).toFixed(2)}x`;

const getThumbnailPositionValue = () => {
  const parsed = parseObjectPosition(elements.thumbnailPosition.value);
  return formatObjectPosition(parsed);
};

const getThumbnailZoomValue = () => parseThumbnailZoom(elements.thumbnailZoom.value || 1);

const syncCropControlsFromFields = () => {
  const position = parseObjectPosition(elements.thumbnailPosition.value);
  const zoom = getThumbnailZoomValue();

  elements.thumbnailPanX.value = String(Math.round(position.x));
  elements.thumbnailPanY.value = String(Math.round(position.y));
  elements.thumbnailPanXOutput.value = `${Math.round(position.x)}%`;
  elements.thumbnailPanYOutput.value = `${Math.round(position.y)}%`;
  elements.thumbnailZoom.value = zoom === 1 ? "" : String(zoom);
  elements.thumbnailZoomRange.value = String(zoom);
  elements.thumbnailZoomOutput.value = formatZoomOutput(zoom);
};

const syncFieldsFromCropControls = () => {
  const x = Number(elements.thumbnailPanX.value);
  const y = Number(elements.thumbnailPanY.value);
  const zoom = parseThumbnailZoom(elements.thumbnailZoomRange.value);

  elements.thumbnailPosition.value = formatObjectPosition({ x, y });
  elements.thumbnailZoom.value = zoom === 1 ? "" : String(zoom);
  syncCropControlsFromFields();
};

const compactObject = (object) =>
  Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== "" && value !== undefined && value !== null)
  );

const getImageRows = () => Array.from(elements.imageList.querySelectorAll(".repeatable-item--image"));

const getImageRowById = (rowId) => getImageRows().find((row) => row.dataset.rowId === rowId) || null;

const getImageLibraryFile = (src) => state.imageLibrary.fileMap.get(normalizeAssetPath(src)) || null;

const ensureActiveImageRow = () => {
  const current = getImageRowById(state.activeImageRowId);
  if (current) {
    return current;
  }

  const firstRow = getImageRows()[0] || null;
  if (firstRow) {
    setActiveImageRow(firstRow.dataset.rowId);
  }
  return firstRow;
};

const projectForForm = (project = createBlankProject()) => ({
  slug: project.slug || "",
  draft: project.draft === true,
  title: project.title || "",
  year: project.year || "",
  projectType: project.projectType || "",
  role: project.role || "",
  categories: Array.isArray(project.categories) ? [...project.categories] : [],
  tags: Array.isArray(project.tags) ? [...project.tags] : [],
  shortDescription: project.shortDescription || "",
  fullDescription:
    Array.isArray(project.fullDescription) && project.fullDescription.length
      ? [...project.fullDescription]
      : [""],
  links:
    Array.isArray(project.links) && project.links.length
      ? project.links.map((link) => ({ label: link.label || "", url: link.url || "" }))
      : [{ label: "", url: "" }],
  media: mediaItemsForProject(project).length
    ? mediaItemsForProject(project)
    : [{ type: "image", provider: "", src: "", alt: "", caption: "", thumbnail: "", width: "", height: "" }],
  thumbnailPosition: project.thumbnailPosition || "",
  thumbnailZoom: project.thumbnailZoom ?? ""
});

const createParagraphRow = (value = "") => {
  const row = elements.paragraphTemplate.content.firstElementChild.cloneNode(true);
  row.querySelector("[data-field='paragraph']").value = value;
  row.querySelector("[data-remove-row]").addEventListener("click", () => {
    row.remove();
    if (!elements.paragraphList.children.length) {
      elements.paragraphList.append(createParagraphRow());
    }
    refreshPreview();
  });
  return row;
};

const createLinkRow = (link = {}) => {
  const row = elements.linkTemplate.content.firstElementChild.cloneNode(true);
  row.querySelector("[data-field='label']").value = link.label || "";
  row.querySelector("[data-field='url']").value = link.url || "";
  row.querySelector("[data-remove-row]").addEventListener("click", () => {
    row.remove();
    if (!elements.linkList.children.length) {
      elements.linkList.append(createLinkRow());
    }
    refreshPreview();
  });
  return row;
};

const createSiteLinkRow = (listElement, link = {}) => {
  const row = elements.linkTemplate.content.firstElementChild.cloneNode(true);
  row.querySelector("[data-field='label']").value = link.label || "";
  row.querySelector("[data-field='url']").value = link.url || "";
  row.querySelector("[data-remove-row]").addEventListener("click", () => {
    row.remove();
    if (!listElement.children.length) {
      listElement.append(createSiteLinkRow(listElement));
    }
    updateMode();
  });
  row.addEventListener("input", updateMode);
  return row;
};

const getLinksFromList = (listElement) =>
  Array.from(listElement.querySelectorAll(".repeatable-item"), (row) => {
    const label = row.querySelector("[data-field='label']").value.trim();
    const url = row.querySelector("[data-field='url']").value.trim();
    return compactObject({ label, url });
  }).filter((item) => Object.keys(item).length > 0);

const siteForForm = (site = createBlankSite()) => ({
  title: site.title || "",
  description: site.description || "",
  ogTitle: site.ogTitle || "",
  ogDescription: site.ogDescription || "",
  socialImage: site.socialImage || "",
  socialImageAlt: site.socialImageAlt || "",
  canonicalUrl: site.canonicalUrl || "",
  header: {
    name: site.header?.name || "",
    mark: site.header?.mark || "",
    contactLabel: site.header?.contactLabel || "",
    contactEmail: site.header?.contactEmail || ""
  },
  footer: {
    socialLinks:
      Array.isArray(site.footer?.socialLinks) && site.footer.socialLinks.length
        ? site.footer.socialLinks.map((link) => ({ label: link.label || "", url: link.url || "" }))
        : [{ label: "", url: "" }],
    aboutTitle: site.footer?.aboutTitle || "",
    aboutLines:
      Array.isArray(site.footer?.aboutLines) && site.footer.aboutLines.length
        ? [...site.footer.aboutLines]
        : [""],
    location: site.footer?.location || "",
    roleLinks:
      Array.isArray(site.footer?.roleLinks) && site.footer.roleLinks.length
        ? site.footer.roleLinks.map((link) => ({ label: link.label || "", url: link.url || "" }))
        : [{ label: "", url: "" }]
  }
});

const buildSiteFromForm = () => ({
  title: elements.siteTitle.value.trim(),
  description: elements.siteDescription.value.trim(),
  ogTitle: elements.siteOgTitle.value.trim(),
  ogDescription: elements.siteOgDescription.value.trim(),
  socialImage: elements.siteSocialImage.value.trim(),
  socialImageAlt: elements.siteSocialImageAlt.value.trim(),
  canonicalUrl: elements.siteCanonicalUrl.value.trim(),
  header: {
    name: elements.siteHeaderName.value.trim(),
    mark: elements.siteHeaderMark.value.trim(),
    contactLabel: elements.siteContactLabel.value.trim(),
    contactEmail: elements.siteContactEmail.value.trim()
  },
  footer: {
    socialLinks: getLinksFromList(elements.siteSocialLinkList),
    aboutTitle: elements.siteAboutTitle.value.trim(),
    aboutLines: elements.siteAboutLines.value.split("\n").map((line) => line.trim()).filter(Boolean),
    location: elements.siteLocation.value.trim(),
    roleLinks: getLinksFromList(elements.siteRoleLinkList)
  }
});

const populateSiteForm = (site) => {
  const safe = siteForForm(site);
  elements.siteTitle.value = safe.title;
  elements.siteDescription.value = safe.description;
  elements.siteOgTitle.value = safe.ogTitle;
  elements.siteOgDescription.value = safe.ogDescription;
  elements.siteSocialImage.value = safe.socialImage;
  elements.siteSocialImageAlt.value = safe.socialImageAlt;
  elements.siteCanonicalUrl.value = safe.canonicalUrl;
  elements.siteHeaderName.value = safe.header.name;
  elements.siteHeaderMark.value = safe.header.mark;
  elements.siteContactLabel.value = safe.header.contactLabel;
  elements.siteContactEmail.value = safe.header.contactEmail;
  elements.siteAboutTitle.value = safe.footer.aboutTitle;
  elements.siteAboutLines.value = safe.footer.aboutLines.join("\n");
  elements.siteLocation.value = safe.footer.location;
  elements.siteSocialLinkList.replaceChildren(
    ...safe.footer.socialLinks.map((link) => createSiteLinkRow(elements.siteSocialLinkList, link))
  );
  elements.siteRoleLinkList.replaceChildren(
    ...safe.footer.roleLinks.map((link) => createSiteLinkRow(elements.siteRoleLinkList, link))
  );
  state.site = safe;
  state.sourceSite = deepClone(safe);
  state.savedSiteSnapshot = JSON.stringify(safe);
};

const getImageRowValues = (row) => ({
  type: row.querySelector("[data-field='type']").value || "image",
  provider: row.querySelector("[data-field='provider']").value || "",
  src: row.querySelector("[data-field='src']").value.trim(),
  alt: row.querySelector("[data-field='alt']").value.trim(),
  caption: row.querySelector("[data-field='caption']").value.trim(),
  thumbnail: row.querySelector("[data-field='thumbnail']").value.trim(),
  width: row.querySelector("[data-field='width']").value.trim(),
  height: row.querySelector("[data-field='height']").value.trim()
});

const setActiveImageRow = (rowId) => {
  state.activeImageRowId = rowId;

  getImageRows().forEach((row) => {
    row.classList.toggle("is-active-row", row.dataset.rowId === rowId);
  });

  const activeRow = getImageRowById(rowId);
  const src = activeRow ? activeRow.querySelector("[data-field='src']").value.trim() : "";
  elements.imageLibraryTarget.textContent = activeRow ? `Target row: ${src || "new image entry"}` : "Select an image row first";
  updateCropWorkspace();
};

const moveImageRow = (row, delta) => {
  const rows = getImageRows();
  const currentIndex = rows.indexOf(row);
  const nextIndex = currentIndex + delta;

  if (currentIndex === -1 || nextIndex < 0 || nextIndex >= rows.length) {
    return;
  }

  const sibling = rows[nextIndex];
  if (delta < 0) {
    sibling.before(row);
  } else {
    sibling.after(row);
  }

  refreshPreview();
};

const setImageAsFirst = (row) => {
  elements.imageList.prepend(row);
  setActiveImageRow(row.dataset.rowId);
  setStatus("Media item moved to the first position.");
  refreshPreview();
};

const duplicateImageRow = (row) => {
  const duplicated = createImageRow(getImageRowValues(row));
  row.after(duplicated);
  setActiveImageRow(duplicated.dataset.rowId);
  refreshPreview();
};

const removeImageRow = (row) => {
  row.remove();

  if (!elements.imageList.children.length) {
    elements.imageList.append(createImageRow());
  }

  const activeRow = ensureActiveImageRow();
  if (activeRow) {
    setActiveImageRow(activeRow.dataset.rowId);
  }

  refreshPreview();
};

const openImageFromRow = (row) => {
  const type = row.querySelector("[data-field='type']").value || "image";
  const rawSource = row.querySelector("[data-field='src']").value.trim();
  const src = type === "image" ? normalizeAssetPath(rawSource) : rawSource;

  if (!src) {
    setStatus("Add a media source first.");
    return;
  }

  if (type === "image") {
    const file = getImageLibraryFile(src);
    if (!file) {
      setStatus("Image file not found.");
      return;
    }

    window.open(assetUrlForSrc(file.src), "_blank", "noopener,noreferrer");
    return;
  }

  const openUrl = isValidAssetPath(src) ? assetUrlForSrc(src) : src;
  window.open(openUrl, "_blank", "noopener,noreferrer");
};

const detectDimensionsForRow = async (row) => {
  if (blockLocalApiAction("Dimension detection")) {
    return;
  }

  if ((row.querySelector("[data-field='type']").value || "image") !== "image") {
    setStatus("Dimension detection is only available for image media.");
    return;
  }

  const src = normalizeAssetPath(row.querySelector("[data-field='src']").value);
  if (!src) {
    setStatus("Add an image path first.");
    return;
  }

  try {
    const payload = await apiRequest("/api/image-dimensions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ src })
    });

    row.querySelector("[data-field='width']").value = payload.width;
    row.querySelector("[data-field='height']").value = payload.height;
    setStatus(`Detected dimensions for ${src}: ${payload.width} x ${payload.height}.`);
    refreshPreview();
  } catch (error) {
    setStatus(error.message);
  }
};

const fillActiveImageRow = (src) => {
  const row = ensureActiveImageRow();
  if (!row) {
    setStatus("Select or create an image row first.");
    return;
  }

  row.querySelector("[data-field='type']").value = "image";
  row.querySelector("[data-field='provider']").value = "";
  row.querySelector("[data-field='src']").value = src;
  setActiveImageRow(row.dataset.rowId);
  setStatus(`Selected ${src}.`);
  refreshPreview();
};

const createImageRow = (image = {}) => {
  const row = elements.imageTemplate.content.firstElementChild.cloneNode(true);
  row.dataset.rowId = `image-row-${state.nextImageRowId++}`;

  row.querySelector("[data-field='type']").value = image.type || "image";
  row.querySelector("[data-field='provider']").value = image.provider || "";
  row.querySelector("[data-field='src']").value = image.src || image.source || "";
  row.querySelector("[data-field='alt']").value = image.alt || "";
  row.querySelector("[data-field='caption']").value = image.caption || "";
  row.querySelector("[data-field='thumbnail']").value = image.thumbnail || "";
  row.querySelector("[data-field='width']").value = image.width ?? "";
  row.querySelector("[data-field='height']").value = image.height ?? "";

  row.querySelectorAll("input, select").forEach((input) => {
    input.addEventListener("focus", () => setActiveImageRow(row.dataset.rowId));
  });

  row.addEventListener("click", () => setActiveImageRow(row.dataset.rowId));

  const browseButton = row.querySelector("[data-image-action='browse']");
  const detectButton = row.querySelector("[data-image-action='detect-dimensions']");
  const typeSelect = row.querySelector("[data-field='type']");

  const syncMediaRowControls = () => {
    const isImage = typeSelect.value === "image";
    browseButton.disabled = !state.runtime.canUseLocalApi || !isImage;
    browseButton.title = state.runtime.canUseLocalApi
      ? isImage
        ? ""
        : "The image browser is only for local image media."
      : "Image library browsing is disabled on public site.";
    detectButton.disabled = !state.runtime.canUseLocalApi || !isImage;
    detectButton.title = state.runtime.canUseLocalApi
      ? isImage
        ? ""
        : "Dimension detection is only for image media."
      : "Dimension detection is disabled on public site.";
  };

  syncMediaRowControls();
  typeSelect.addEventListener("change", () => {
    syncMediaRowControls();
    setActiveImageRow(row.dataset.rowId);
    refreshPreview();
  });

  browseButton.addEventListener("click", () => {
    if (blockLocalApiAction("Image library browsing")) {
      return;
    }
    setActiveImageRow(row.dataset.rowId);
    elements.imageFolderSelect.focus();
  });

  detectButton.addEventListener("click", () => {
    setActiveImageRow(row.dataset.rowId);
    detectDimensionsForRow(row);
  });

  row.querySelector("[data-image-action='copy-path']").addEventListener("click", () => {
    const src = row.querySelector("[data-field='src']").value.trim();
    if (!src) {
      setStatus("Add a media source first.");
      return;
    }
    copyText(src, "Media source copied.");
  });

  row.querySelector("[data-image-action='open-image']").addEventListener("click", () => {
    setActiveImageRow(row.dataset.rowId);
    openImageFromRow(row);
  });

  row.querySelector("[data-image-action='move-up']").addEventListener("click", () => moveImageRow(row, -1));
  row.querySelector("[data-image-action='move-down']").addEventListener("click", () => moveImageRow(row, 1));
  row.querySelector("[data-image-action='set-first']").addEventListener("click", () => setImageAsFirst(row));
  row.querySelector("[data-image-action='duplicate']").addEventListener("click", () => duplicateImageRow(row));
  row.querySelector("[data-image-action='remove']").addEventListener("click", () => removeImageRow(row));

  return row;
};

const buildProjectFromForm = () => {
  const categories = Array.from(
    elements.categoryOptions.querySelectorAll("input[type='checkbox']:checked"),
    (input) => input.value
  );

  const fullDescription = Array.from(
    elements.paragraphList.querySelectorAll("[data-field='paragraph']"),
    (input) => input.value.trim()
  ).filter(Boolean);

  const links = Array.from(elements.linkList.querySelectorAll(".repeatable-item"), (row) => {
    const label = row.querySelector("[data-field='label']").value.trim();
    const url = row.querySelector("[data-field='url']").value.trim();
    return compactObject({ label, url });
  }).filter((item) => Object.keys(item).length > 0);

  const media = getImageRows()
    .map((row) => {
      const type = row.querySelector("[data-field='type']").value || "image";
      const provider = row.querySelector("[data-field='provider']").value;
      const src = row.querySelector("[data-field='src']").value.trim();
      const alt = row.querySelector("[data-field='alt']").value.trim();
      const caption = row.querySelector("[data-field='caption']").value.trim();
      const thumbnail = row.querySelector("[data-field='thumbnail']").value.trim();
      const width = parseNumber(row.querySelector("[data-field='width']").value);
      const height = parseNumber(row.querySelector("[data-field='height']").value);
      if (type === "image") {
        return compactObject({ type, src, alt, width, height, caption });
      }
      return compactObject({ type, provider, source: src, caption, thumbnail });
    })
    .filter((item) => Object.keys(item).length > 0);

  const project = {
    slug: elements.slug.value.trim(),
    ...(elements.draft.checked ? { draft: true } : {}),
    title: elements.title.value.trim(),
    year: elements.year.value.trim(),
    projectType: elements.projectType.value.trim(),
    role: elements.role.value.trim(),
    categories,
    tags: elements.tags.value.split(",").map((tag) => tag.trim()).filter(Boolean),
    shortDescription: elements.shortDescription.value.trim(),
    fullDescription,
    links,
    media
  };

  const thumbnailPosition = elements.thumbnailPosition.value.trim();
  if (thumbnailPosition) {
    project.thumbnailPosition = thumbnailPosition;
  }

  const thumbnailZoom = getThumbnailZoomValue();
  if (thumbnailZoom > 1) {
    project.thumbnailZoom = thumbnailZoom;
  }

  return project;
};

const currentProjectPreview = () => JSON.stringify(buildProjectFromForm(), null, 2);

const hasMeaningfulData = (project) =>
  Boolean(
    project.slug ||
      project.draft ||
      project.title ||
      project.year ||
      project.projectType ||
      project.role ||
      project.shortDescription ||
      project.categories.length ||
      project.tags.length ||
      project.fullDescription.length ||
      project.links.length ||
      project.media.length ||
      project.thumbnailPosition ||
      project.thumbnailZoom
  );

const getProjectsForAnalysis = () => {
  const projects = deepClone(state.projects);
  const current = buildProjectFromForm();

  if (state.selectedIndex !== null) {
    if (hasMeaningfulData(current)) {
      projects[state.selectedIndex] = current;
    }
    return projects;
  }

  if (hasMeaningfulData(current)) {
    projects.unshift(current);
  }

  return projects;
};

const isDirty = () => JSON.stringify(buildProjectFromForm()) !== state.loadedSnapshot;

const isSiteDirty = () => JSON.stringify(buildSiteFromForm()) !== state.savedSiteSnapshot;

const isWorkingListDirty = () => JSON.stringify(state.projects) !== state.savedProjectsSnapshot;

const dirtyChangeLabels = () =>
  !state.loadedSnapshot && !state.savedProjectsSnapshot && !state.savedSiteSnapshot
    ? []
    : [
        isDirty() ? "current project form has unapplied changes" : "",
        isWorkingListDirty() ? "project list has unsaved changes" : "",
        isSiteDirty() ? "site text has unsaved changes" : ""
      ].filter(Boolean);

const hasUnsavedChanges = () => dirtyChangeLabels().length > 0;

const unsavedChangesMessage = (intro) => `${intro}\n\n${dirtyChangeLabels().join("\n")}`;

const confirmDiscardIfDirty = () => {
  if (!hasUnsavedChanges()) {
    return true;
  }

  return window.confirm(unsavedChangesMessage("You have unapplied or unsaved changes. Continue and discard the current form view?"));
};

const updateMode = () => {
  const dirty = isDirty();
  const workingListDirty = isWorkingListDirty();
  const siteDirty = isSiteDirty();
  const dirtyLabels = [
    workingListDirty ? "project list not saved" : "",
    siteDirty ? "site text not saved" : ""
  ].filter(Boolean);
  const suffix = dirtyLabels.length ? ` / ${dirtyLabels.join(", ")}` : "";

  if (state.selectedIndex === null) {
    elements.editorMode.textContent = dirty
      ? `New project draft (unsaved form${suffix})`
      : `Creating a new project${suffix}`;
    elements.deleteProjectButton.disabled = true;
  } else {
    const project = state.projects[state.selectedIndex];
    elements.editorMode.textContent = dirty
      ? `Editing: ${project.title} (unsaved form${suffix})`
      : `Editing: ${project.title}${suffix}`;
    elements.deleteProjectButton.disabled = false;
  }

  const current = buildProjectFromForm();
  elements.duplicateProjectButton.disabled = !current.slug || !current.title;
  elements.moveProjectUpButton.disabled = state.selectedIndex === null || state.selectedIndex <= 0;
  elements.moveProjectDownButton.disabled =
    state.selectedIndex === null || state.selectedIndex >= state.projects.length - 1;
  elements.moveProjectTopButton.disabled = state.selectedIndex === null || state.selectedIndex <= 0;
};

const mediaBadgeLabel = (type, provider) => {
  if (type === "image") {
    return "image";
  }

  if (type === "video") {
    if (provider === "youtube") {
      return "YouTube";
    }
    if (provider === "vimeo") {
      return "Vimeo";
    }
    if (provider === "file") {
      return "local video";
    }
    if (provider === "url") {
      return "URL";
    }
    return "video";
  }

  if (type === "audio") {
    if (provider === "soundcloud") {
      return "SoundCloud";
    }
    if (provider === "url") {
      return "URL";
    }
    return "audio";
  }

  return "URL";
};

const mediaThumbnailWarning = (type, provider, thumbnail) => {
  if (thumbnail || type === "image") {
    return "";
  }

  if (type === "video" && provider === "youtube") {
    return "No explicit thumbnail: public site uses a YouTube-derived thumbnail.";
  }

  if (type === "video") {
    return "No explicit thumbnail: public site shows a neutral video placeholder.";
  }

  if (type === "audio") {
    return "No explicit thumbnail: public site shows a neutral audio placeholder.";
  }

  return "";
};

const mediaRowWarnings = (row, type, provider, thumbnail) => {
  const warnings = [];
  if (getImageRows()[0] === row) {
    warnings.push("First media item = main thumbnail.");
  }

  const thumbnailWarning = mediaThumbnailWarning(type, provider, thumbnail);
  if (thumbnailWarning) {
    warnings.push(thumbnailWarning);
  }

  return warnings;
};

const updateImageRowPreview = (row) => {
  const typeInput = row.querySelector("[data-field='type']");
  const providerInput = row.querySelector("[data-field='provider']");
  const srcInput = row.querySelector("[data-field='src']");
  const widthInput = row.querySelector("[data-field='width']");
  const heightInput = row.querySelector("[data-field='height']");
  const altInput = row.querySelector("[data-field='alt']");
  const captionInput = row.querySelector("[data-field='caption']");
  const thumbnailInput = row.querySelector("[data-field='thumbnail']");
  const previewImage = row.querySelector("[data-image-preview]");
  const cropPreviewImage = row.querySelector("[data-image-crop-preview]");
  const badge = row.querySelector("[data-media-badge]");
  const warning = row.querySelector("[data-image-warning]");
  const meta = row.querySelector("[data-image-detected-meta]");
  const openButton = row.querySelector("[data-image-action='open-image']");
  const thumbnailPosition = getThumbnailPositionValue();
  const thumbnailZoom = getThumbnailZoomValue();
  const type = typeInput.value || "image";
  const provider = providerInput.value || "";
  const rawSource = srcInput.value.trim();
  const src = type === "image" ? normalizeAssetPath(rawSource) : rawSource;
  const thumbnail = normalizeAssetPath(thumbnailInput.value);
  const warnings = mediaRowWarnings(row, type, provider, thumbnail);
  const file = getImageLibraryFile(src);
  const thumbnailIsRemote = isRemoteUrl(thumbnail);
  const thumbnailFile = thumbnailIsRemote ? null : getImageLibraryFile(thumbnail);
  const metadataWidth = widthInput.value.trim();
  const metadataHeight = heightInput.value.trim();
  const metadataText = metadataWidth && metadataHeight ? `${metadataWidth} x ${metadataHeight}` : "missing metadata";
  const fileText = file?.width && file?.height ? `${file.width} x ${file.height}` : "unknown file size";

  previewImage.style.objectPosition = thumbnailPosition;
  cropPreviewImage.style.setProperty("--thumb-position", thumbnailPosition);
  cropPreviewImage.style.setProperty("--thumb-zoom", String(thumbnailZoom));
  previewImage.alt = altInput.value.trim() || "Image preview";
  cropPreviewImage.alt = altInput.value.trim() || "Thumbnail crop preview";
  badge.textContent = mediaBadgeLabel(type, provider);

  if (!src) {
    previewImage.removeAttribute("src");
    cropPreviewImage.removeAttribute("src");
    warning.textContent = [...warnings, "No media source selected"].join("\n");
    meta.textContent = `Type: ${type}\nSource: -\nMetadata: ${metadataText}`;
    openButton.disabled = true;
    return;
  }

  if (type !== "image") {
    const previewSource = thumbnailIsRemote ? thumbnail : thumbnailFile ? assetUrlForSrc(thumbnailFile.src) : "";
    if (previewSource) {
      previewImage.src = previewSource;
      cropPreviewImage.src = previewSource;
    } else {
      previewImage.removeAttribute("src");
      cropPreviewImage.removeAttribute("src");
    }
    if (thumbnail && !thumbnailFile && !thumbnailIsRemote) {
      warnings.push("Thumbnail file not found. Check the path or leave it blank.");
    }
    warning.textContent = warnings.join("\n");
    meta.textContent = [
      `Type: ${type}`,
      `Provider: ${provider || "-"}`,
      `Source: ${src}`,
      `Caption: ${captionInput.value.trim() || "-"}`,
      `Thumbnail: ${thumbnail || "-"}`
    ].join("\n");
    openButton.disabled = false;
    return;
  }

  if (!isValidAssetPath(src)) {
    previewImage.removeAttribute("src");
    cropPreviewImage.removeAttribute("src");
    warning.textContent = [...warnings, "Invalid path. Use assets/projects/..."].join("\n");
    meta.textContent = `Type: image\nPath: ${src}\nMetadata: ${metadataText}`;
    openButton.disabled = true;
    return;
  }

  if (!file) {
    previewImage.removeAttribute("src");
    cropPreviewImage.removeAttribute("src");
    warning.textContent = [...warnings, "Missing file. Check the path or add the image under assets/projects/[slug]/."].join("\n");
    meta.textContent = `Type: image\nPath: ${src}\nMetadata: ${metadataText}`;
    openButton.disabled = true;
    return;
  }

  previewImage.src = assetUrlForSrc(file.src);
  cropPreviewImage.src = assetUrlForSrc(file.src);
  warning.textContent = warnings.join("\n");
  meta.textContent = `Type: image\nPath: ${src}\nMetadata: ${metadataText}\nFile: ${fileText}\nCrop: ${thumbnailPosition}, ${thumbnailZoom.toFixed(2)}x`;
  openButton.disabled = false;
};

const clearImagePreview = (image) => {
  image.removeAttribute("src");
  image.alt = "";
};

const getActiveImageInfo = () => {
  const row = getImageRowById(state.activeImageRowId) || getImageRows()[0] || null;
  const type = row ? row.querySelector("[data-field='type']").value || "image" : "image";
  const src = row ? normalizeAssetPath(row.querySelector("[data-field='src']").value) : "";
  const alt = row ? row.querySelector("[data-field='alt']").value.trim() : "";
  const file = getImageLibraryFile(src);

  return { row, type, src, alt, file };
};

const setThumbnailPreviewStyle = (image, position, zoom) => {
  image.style.setProperty("--thumb-position", position);
  image.style.setProperty("--thumb-zoom", String(zoom));
};

const updateCropWorkspace = () => {
  if (!elements.thumbnailCanvasPreview) {
    return;
  }

  const position = getThumbnailPositionValue();
  const zoom = getThumbnailZoomValue();
  const { row, type, src, alt, file } = getActiveImageInfo();

  setThumbnailPreviewStyle(elements.thumbnailCropPreview, position, zoom);
  elements.thumbnailSourceLabel.textContent = src || "Select an image row";
  elements.downloadCropButton.disabled = true;
  state.cropRenderToken += 1;

  if (!row) {
    clearImagePreview(elements.largeImagePreview);
    clearImagePreview(elements.thumbnailCropPreview);
    clearCanvas(elements.thumbnailCanvasPreview);
    elements.thumbnailCropWarning.textContent = "Add an image row to edit thumbnail cropping.";
    return;
  }

  if (type !== "image") {
    clearImagePreview(elements.largeImagePreview);
    clearImagePreview(elements.thumbnailCropPreview);
    clearCanvas(elements.thumbnailCanvasPreview);
    elements.thumbnailCropWarning.textContent = "Select an image media row to edit thumbnail cropping.";
    return;
  }

  if (!src) {
    clearImagePreview(elements.largeImagePreview);
    clearImagePreview(elements.thumbnailCropPreview);
    clearCanvas(elements.thumbnailCanvasPreview);
    elements.thumbnailCropWarning.textContent = "The active image row does not have a path yet.";
    return;
  }

  if (!isValidAssetPath(src)) {
    clearImagePreview(elements.largeImagePreview);
    clearImagePreview(elements.thumbnailCropPreview);
    clearCanvas(elements.thumbnailCanvasPreview);
    elements.thumbnailCropWarning.textContent = "The active image path must start with assets/projects/.";
    return;
  }

  if (!file) {
    clearImagePreview(elements.largeImagePreview);
    clearImagePreview(elements.thumbnailCropPreview);
    clearCanvas(elements.thumbnailCanvasPreview);
    elements.thumbnailCropWarning.textContent = "Missing file. Add it under assets/projects/[slug]/ or choose another image.";
    return;
  }

  const imageUrl = assetUrlForSrc(file.src);
  const token = state.cropRenderToken;

  elements.largeImagePreview.src = imageUrl;
  elements.largeImagePreview.alt = alt || "Large image preview";
  elements.thumbnailCropPreview.src = imageUrl;
  elements.thumbnailCropPreview.alt = alt || "Thumbnail crop preview";
  elements.thumbnailCropWarning.textContent = "";
  elements.downloadCropButton.disabled = false;

  drawCroppedThumbnail(elements.thumbnailCanvasPreview, imageUrl, position, zoom).catch((error) => {
    if (token === state.cropRenderToken) {
      clearCanvas(elements.thumbnailCanvasPreview);
      elements.thumbnailCropWarning.textContent = error.message;
    }
  });
};

const updateMiniProjectPreview = () => {
  const project = buildProjectFromForm();
  const image = imageMediaItemsForProject(project)[0];
  const position = project.thumbnailPosition || getThumbnailPositionValue();
  const zoom = parseThumbnailZoom(project.thumbnailZoom);

  elements.miniProjectTitle.textContent = project.title || "Untitled";
  elements.miniProjectDescription.textContent = project.shortDescription || "";
  setThumbnailPreviewStyle(elements.miniProjectImage, position, zoom);

  if (!image?.src || !isValidAssetPath(image.src) || !getImageLibraryFile(image.src)) {
    clearImagePreview(elements.miniProjectImage);
    return;
  }

  elements.miniProjectImage.src = assetUrlForSrc(image.src);
  elements.miniProjectImage.alt = image.alt || `${project.title || "Project"} thumbnail preview`;
};

const downloadCroppedThumbnail = async () => {
  const position = getThumbnailPositionValue();
  const zoom = getThumbnailZoomValue();
  const { type, src, file } = getActiveImageInfo();

  if (type !== "image" || !src || !file) {
    setStatus("Choose an existing local image before downloading a cropped thumbnail.");
    return;
  }

  const slug = elements.slug.value.trim() || file.folder || "project";
  const filename = `${slug}-thumbnail-crop.png`;

  try {
    await drawCroppedThumbnail(elements.thumbnailCanvasPreview, assetUrlForSrc(file.src), position, zoom);
    downloadCanvasAsPng(elements.thumbnailCanvasPreview, filename);
    setStatus(`Downloaded ${filename}. Original image was not changed.`);
  } catch (error) {
    setStatus(error.message);
  }
};

const buildImageDiagnostics = (projects) => {
  const missingImages = [];
  const unusedImages = [];
  const invalidPaths = [];
  const missingAlt = [];
  const missingWidth = [];
  const missingHeight = [];
  const referencedPaths = new Set();

  projects.forEach((project) => {
    imageMediaItemsForProject(project).forEach((image, index) => {
      const imageLabel = `${project.title || project.slug || "Untitled"} / image ${index + 1}`;
      const src = normalizeAssetPath(image.src);
      const file = getImageLibraryFile(src);

      if (src) {
        referencedPaths.add(src);
      }

      if (!src || !isValidAssetPath(src)) {
        invalidPaths.push(`${imageLabel}: ${src || "missing src"}`);
      } else if (!file) {
        missingImages.push(`${imageLabel}: ${src}`);
      }

      if (!String(image.alt || "").trim()) {
        missingAlt.push(imageLabel);
      }

      if (!image.width) {
        missingWidth.push(imageLabel);
      }

      if (!image.height) {
        missingHeight.push(imageLabel);
      }
    });
  });

  state.imageLibrary.flatFiles.forEach((file) => {
    if (!referencedPaths.has(file.src)) {
      unusedImages.push(file.src);
    }
  });

  return {
    missingImages,
    unusedImages,
    invalidPaths,
    missingAlt,
    missingWidth,
    missingHeight
  };
};

const renderDiagnosticGroup = (title, items, emptyText) => {
  const group = document.createElement("section");
  group.className = "diagnostic-group";

  const heading = document.createElement("h3");
  heading.textContent = `${title} (${items.length})`;
  group.append(heading);

  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "diagnostic-empty";
    empty.textContent = emptyText;
    group.append(empty);
    return group;
  }

  const list = document.createElement("ul");
  list.className = "diagnostic-list";
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    list.append(listItem);
  });
  group.append(list);
  return group;
};

const renderImageDiagnostics = () => {
  const diagnostics = buildImageDiagnostics(getProjectsForAnalysis());
  const groups = [
    renderDiagnosticGroup("Missing images", diagnostics.missingImages, "No missing files."),
    renderDiagnosticGroup("Unused images", diagnostics.unusedImages, "No unused files."),
    renderDiagnosticGroup("Invalid paths", diagnostics.invalidPaths, "All paths stay inside assets/projects/."),
    renderDiagnosticGroup("Missing alt text", diagnostics.missingAlt, "All images have alt text."),
    renderDiagnosticGroup("Missing width", diagnostics.missingWidth, "All images have width metadata."),
    renderDiagnosticGroup("Missing height", diagnostics.missingHeight, "All images have height metadata.")
  ];

  elements.imageDiagnostics.replaceChildren(...groups);
};

const refreshPreview = () => {
  syncCropControlsFromFields();
  elements.preview.textContent = currentProjectPreview();
  getImageRows().forEach(updateImageRowPreview);
  updateCropWorkspace();
  updateMiniProjectPreview();
  renderImageDiagnostics();
  updateMode();
};

const populateForm = (project, index = null) => {
  const safe = projectForForm(project);
  state.selectedIndex = index;
  state.activeImageRowId = null;

  elements.slug.value = safe.slug;
  elements.draft.checked = safe.draft;
  elements.title.value = safe.title;
  elements.year.value = safe.year;
  elements.projectType.value = safe.projectType;
  elements.role.value = safe.role;
  elements.thumbnailPosition.value = safe.thumbnailPosition;
  elements.thumbnailZoom.value = safe.thumbnailZoom;
  elements.tags.value = safe.tags.join(", ");
  elements.shortDescription.value = safe.shortDescription;

  elements.categoryOptions.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.checked = safe.categories.includes(input.value);
  });

  elements.paragraphList.replaceChildren(...safe.fullDescription.map((paragraph) => createParagraphRow(paragraph)));
  elements.linkList.replaceChildren(...safe.links.map((link) => createLinkRow(link)));
  elements.imageList.replaceChildren(...safe.media.map((item) => createImageRow(item)));

  const firstImageRow = ensureActiveImageRow();
  if (firstImageRow) {
    setActiveImageRow(firstImageRow.dataset.rowId);
  }

  state.loadedSnapshot = JSON.stringify(buildProjectFromForm());
  syncLibraryFolderWithSlug();
  renderProjectList();
  refreshPreview();
};

const renderProjectList = () => {
  const query = elements.search.value.trim().toLowerCase();
  const fragment = document.createDocumentFragment();

  state.projects.forEach((project, index) => {
    const haystack = [project.title, project.year, project.slug, project.projectType].filter(Boolean).join(" ").toLowerCase();
    if (query && !haystack.includes(query)) {
      return;
    }

    const item = document.createElement("div");
    item.className = "project-item";
    if (state.selectedIndex === index) {
      item.classList.add("is-active");
    }

    const selectButton = document.createElement("button");
    selectButton.type = "button";
    selectButton.className = "project-item__select";
    const title = document.createElement("div");
    title.className = "project-item__title";
    title.textContent = project.title || "Untitled";
    const meta = document.createElement("div");
    meta.className = "project-item__meta";
    meta.textContent = [project.year, project.draft ? "Draft" : ""].filter(Boolean).join(" / ");
    selectButton.append(title, meta);
    selectButton.addEventListener("click", () => {
      if (!confirmDiscardIfDirty()) {
        return;
      }
      populateForm(project, index);
      setStatus(`Loaded ${project.title}.`);
    });

    const controls = document.createElement("div");
    controls.className = "project-item__controls";

    const upButton = document.createElement("button");
    upButton.type = "button";
    upButton.textContent = "Up";
    upButton.disabled = index === 0;
    upButton.addEventListener("click", () => moveProject(index, -1));

    const downButton = document.createElement("button");
    downButton.type = "button";
    downButton.textContent = "Down";
    downButton.disabled = index === state.projects.length - 1;
    downButton.addEventListener("click", () => moveProject(index, 1));

    controls.append(upButton, downButton);
    item.append(selectButton, controls);
    fragment.append(item);
  });

  elements.projectList.replaceChildren(fragment);
  elements.projectCount.textContent = `${state.projects.length} projects`;
};

const ensureUniqueSlug = (project, currentIndex = null) =>
  !state.projects.some((item, index) => index !== currentIndex && item.slug === project.slug);

const uniqueCopySlug = (slug) => {
  const base = `${slug || "project"}-copy`;
  let candidate = base;
  let suffix = 2;

  while (state.projects.some((project) => project.slug === candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
};

const applyCurrentProject = () => {
  const project = buildProjectFromForm();
  if (!project.slug || !project.title) {
    setStatus("Slug and title are required before applying a project to the list.");
    return false;
  }

  if (!ensureUniqueSlug(project, state.selectedIndex)) {
    setStatus("Slug must stay unique across projects.");
    return false;
  }

  if (state.selectedIndex === null) {
    state.projects.unshift(project);
    state.selectedIndex = 0;
    setStatus("New project added to the working list.");
  } else {
    state.projects[state.selectedIndex] = project;
    setStatus("Current project updated in the working list.");
  }

  state.loadedSnapshot = JSON.stringify(project);
  renderProjectList();
  updateMode();
  renderImageDiagnostics();
  return true;
};

const duplicateCurrentProject = () => {
  const source = buildProjectFromForm();
  if (!source.slug || !source.title) {
    setStatus("Add a slug and title before duplicating a project.");
    return;
  }

  const copy = deepClone(source);
  copy.slug = uniqueCopySlug(source.slug);
  copy.title = `${source.title} copy`;

  const insertIndex = state.selectedIndex === null ? 0 : state.selectedIndex + 1;
  state.projects.splice(insertIndex, 0, copy);
  populateForm(copy, insertIndex);
  setStatus(`Duplicated project as ${copy.title}.`);
};

const moveProject = (index, delta) => {
  const nextIndex = index + delta;
  if (nextIndex < 0 || nextIndex >= state.projects.length) {
    return;
  }

  const [project] = state.projects.splice(index, 1);
  state.projects.splice(nextIndex, 0, project);

  if (state.selectedIndex === index) {
    state.selectedIndex = nextIndex;
  } else if (state.selectedIndex === nextIndex) {
    state.selectedIndex = index;
  }

  renderProjectList();
  renderImageDiagnostics();
  updateMode();
  setStatus("Project order updated locally.");
};

const moveProjectToTop = (index) => {
  if (index <= 0 || index >= state.projects.length) {
    return;
  }

  const [project] = state.projects.splice(index, 1);
  state.projects.unshift(project);

  if (state.selectedIndex === index) {
    state.selectedIndex = 0;
  } else if (state.selectedIndex !== null && state.selectedIndex < index) {
    state.selectedIndex += 1;
  }

  renderProjectList();
  renderImageDiagnostics();
  updateMode();
  setStatus("Project moved to the top locally.");
};

const moveSelectedProject = (delta) => {
  if (state.selectedIndex === null) {
    setStatus("Load an existing project first.");
    return;
  }

  if (!persistCurrentFormIfNeeded()) {
    return;
  }

  moveProject(state.selectedIndex, delta);
};

const moveSelectedProjectToTop = () => {
  if (state.selectedIndex === null) {
    setStatus("Load an existing project first.");
    return;
  }

  if (!persistCurrentFormIfNeeded()) {
    return;
  }

  moveProjectToTop(state.selectedIndex);
};

const deleteCurrentProject = () => {
  if (state.selectedIndex === null) {
    setStatus("Load an existing project first.");
    return;
  }

  const project = state.projects[state.selectedIndex];
  const confirmed = window.confirm(`Delete:\n"${project.title}"\n\nAre you sure?`);
  if (!confirmed) {
    return;
  }

  state.projects.splice(state.selectedIndex, 1);

  if (state.projects.length === 0) {
    populateForm(createBlankProject(), null);
  } else {
    const nextIndex = Math.min(state.selectedIndex, state.projects.length - 1);
    populateForm(state.projects[nextIndex], nextIndex);
  }

  renderImageDiagnostics();
  setStatus(`Removed ${project.title} from the working list.`);
};

const resetForm = () => {
  if (state.selectedIndex === null) {
    populateForm(createBlankProject(), null);
    setStatus("Form reset to a blank project.");
    return;
  }

  populateForm(state.projects[state.selectedIndex], state.selectedIndex);
  setStatus("Form reset to the current working-list version.");
};

const copyCurrentObject = () => {
  copyText(currentProjectPreview(), "Current project object copied.");
};

const downloadCurrentObject = () => {
  const project = buildProjectFromForm();
  const filename = `${project.slug || "project"}.json`;
  downloadText(filename, JSON.stringify(project, null, 2));
  setStatus(`Downloaded ${filename}.`);
};

const persistCurrentFormIfNeeded = () => {
  if (state.selectedIndex !== null && isDirty()) {
    return applyCurrentProject();
  }

  if (state.selectedIndex === null && hasMeaningfulData(buildProjectFromForm())) {
    setStatus("Apply the new project to the list before saving or publishing.");
    return false;
  }

  return true;
};

const buildProjectDiffSummary = (projects) => {
  const sourceMap = new Map(state.sourceProjects.map((project) => [project.slug, project]));
  const currentMap = new Map(projects.map((project) => [project.slug, project]));
  const added = [];
  const modified = [];
  const deleted = [];

  currentMap.forEach((project, slug) => {
    if (!sourceMap.has(slug)) {
      added.push(project.title);
      return;
    }

    if (JSON.stringify(project) !== JSON.stringify(sourceMap.get(slug))) {
      modified.push(project.title);
    }
  });

  sourceMap.forEach((project, slug) => {
    if (!currentMap.has(slug)) {
      deleted.push(project.title);
    }
  });

  return { added, modified, deleted };
};

const buildPublishSummaryText = (projects, summary) =>
  [
    `Projects total: ${projects.length}`,
    `Added: ${summary.added.length} (${formatList(summary.added)})`,
    `Modified: ${summary.modified.length} (${formatList(summary.modified)})`,
    `Deleted: ${summary.deleted.length} (${formatList(summary.deleted)})`
  ].join("\n");

const requestEmptyPortfolioConfirmation = (phrase, actionLabel) => {
  const response = window.prompt(
    `${actionLabel} would leave the portfolio empty.\n\nType exactly:\n${phrase}`,
    ""
  );

  if (response !== phrase) {
    setStatus(`${actionLabel} cancelled.`);
    return null;
  }

  return response;
};

const loadImageLibrary = async () => {
  const payload = await apiRequest("/api/images");
  state.imageLibrary.folders = payload.folders || [];
  state.imageLibrary.flatFiles = payload.flatFiles || [];
  state.imageLibrary.fileMap = new Map(state.imageLibrary.flatFiles.map((file) => [file.src, file]));

  syncLibraryFolderWithSlug();
  renderImageLibrary();
};

const buildReadOnlyImageLibrary = (projects) => {
  const filesBySrc = new Map();
  const foldersByName = new Map();

  projects.forEach((project) => {
    imageMediaItemsForProject(project).forEach((image) => {
      const src = normalizeAssetPath(image.src);
      if (!isValidAssetPath(src) || filesBySrc.has(src)) {
        return;
      }

      const parts = src.split("/");
      const folder = parts[2] || project.slug || "project";
      const file = {
        folder,
        name: parts[parts.length - 1] || src,
        src,
        width: image.width ?? null,
        height: image.height ?? null
      };

      filesBySrc.set(src, file);
      if (!foldersByName.has(folder)) {
        foldersByName.set(folder, []);
      }
      foldersByName.get(folder).push(file);
    });
  });

  state.imageLibrary.flatFiles = Array.from(filesBySrc.values()).sort((a, b) => a.src.localeCompare(b.src));
  state.imageLibrary.folders = Array.from(foldersByName, ([name, files]) => ({
    name,
    files: files.sort((a, b) => a.name.localeCompare(b.name))
  })).sort((a, b) => a.name.localeCompare(b.name));
  state.imageLibrary.fileMap = new Map(state.imageLibrary.flatFiles.map((file) => [file.src, file]));

  syncLibraryFolderWithSlug();
  renderImageLibrary();
};

const syncLibraryFolderWithSlug = () => {
  const slugFolder = elements.slug.value.trim();
  const availableFolders = state.imageLibrary.folders.map((folder) => folder.name);

  if (availableFolders.includes(slugFolder)) {
    state.selectedLibraryFolder = slugFolder;
  } else if (!availableFolders.includes(state.selectedLibraryFolder)) {
    state.selectedLibraryFolder = availableFolders[0] || "";
  }
};

const renderImageLibrary = () => {
  const folders = state.imageLibrary.folders;

  if (!state.runtime.canUseLocalApi) {
    elements.imageFolderSelect.replaceChildren();
    elements.imageFolderSelect.disabled = true;
    elements.imageLibraryGrid.replaceChildren(
      document.createTextNode(
        "Image library scanning and dimension detection are disabled on public site. Existing project image paths can still be edited manually and previewed."
      )
    );
    return;
  }

  const folderOptions = folders.map((folder) => {
    const option = document.createElement("option");
    option.value = folder.name;
    option.textContent = `${folder.name} (${folder.files.length})`;
    return option;
  });

  elements.imageFolderSelect.replaceChildren(...folderOptions);
  elements.imageFolderSelect.value = state.selectedLibraryFolder;

  const selectedFolder = folders.find((folder) => folder.name === state.selectedLibraryFolder);

  if (!selectedFolder) {
    elements.imageLibraryGrid.replaceChildren(document.createTextNode("No images found in assets/projects/."));
    return;
  }

  const items = selectedFolder.files.map((file) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "image-library-item";
    button.innerHTML = `
      <span class="image-library-item__thumb"><img src="${assetUrlForSrc(file.src)}" alt=""></span>
      <span>
        <span class="image-library-item__name">${file.name}</span>
        <span class="image-library-item__meta">${file.width && file.height ? `${file.width} x ${file.height}` : "size unknown"}</span>
      </span>
    `;
    button.addEventListener("click", () => fillActiveImageRow(file.src));
    return button;
  });

  elements.imageLibraryGrid.replaceChildren(...items);
};

const loadProjects = async () => {
  const payload = state.runtime.canUseLocalApi ? await apiRequest("/api/projects") : await loadStaticProjects();
  state.filters = payload.filters.filter((category) => category !== "all");
  state.projects = deepClone(payload.projects);
  state.sourceProjects = deepClone(payload.projects);
  state.savedProjectsSnapshot = JSON.stringify(state.projects);
  populateSiteForm(payload.site || createBlankSite());
  state.backupExists = Boolean(payload.backupExists);
  state.previewUrl = state.runtime.canUseLocalApi ? payload.previewUrl || state.previewUrl : staticSitePreviewUrl();

  elements.previewLink.href = state.previewUrl;
  renderCategoryOptions();
  if (state.runtime.canUseLocalApi) {
    await loadImageLibrary();
  } else {
    buildReadOnlyImageLibrary(state.projects);
  }
  renderProjectList();
  setGitOutput(
    state.runtime.canUseLocalApi
      ? payload.gitStatus?.join("\n") || "Working tree clean for approved portfolio files."
      : `${publicDisabledMessage()}\n\nEditing, previews, and JSON export are available. Save, publish, backup restore, image scanning, and dimension detection are blocked.`
  );
  updateBackupButtons();
  updateLocalActionButtons();

  if (state.projects.length) {
    populateForm(state.projects[0], 0);
  } else {
    populateForm(createBlankProject(), null);
  }
};

const loadStaticProjects = async () => {
  const moduleUrl = new URL(`../../data/projects.js?admin-cache=${Date.now()}`, import.meta.url).href;
  const siteModuleUrl = new URL(`../../data/site.js?admin-cache=${Date.now()}`, import.meta.url).href;
  const [module, siteModule] = await Promise.all([import(moduleUrl), import(siteModuleUrl)]);

  return {
    filters: module.PROJECT_DISPLAY_FILTERS || [],
    projects: module.PROJECTS || [],
    site: siteModule.SITE || createBlankSite(),
    gitStatus: [publicDisabledMessage()],
    previewUrl: staticSitePreviewUrl(),
    backupExists: false
  };
};

const renderCategoryOptions = () => {
  const nodes = state.filters.map((category) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = category;
    label.append(input, document.createTextNode(labelForCategory(category)));
    return label;
  });

  elements.categoryOptions.replaceChildren(...nodes);
};

const saveLocally = async ({ skipConfirm = false, emptyConfirmationOverride = null } = {}) => {
  if (blockLocalApiAction("Save locally")) {
    updateLocalActionButtons();
    return false;
  }

  if (!persistCurrentFormIfNeeded()) {
    return false;
  }

  if (!skipConfirm) {
    const confirmed = window.confirm(
      "Save locally?\n\nThis rewrites:\n- data/projects.js\n- data/site.js\n\nBefore saving, the editor refreshes local backups."
    );
    if (!confirmed) {
      return false;
    }
  }

  let emptyConfirmation = emptyConfirmationOverride;
  if (state.projects.length === 0 && !emptyConfirmation) {
    emptyConfirmation = requestEmptyPortfolioConfirmation("DELETE ALL PROJECTS", "Save locally");
    if (!emptyConfirmation) {
      return false;
    }
  }

  try {
    elements.saveButton.disabled = true;
    elements.savePreviewButton.disabled = true;
    const payload = await apiRequest("/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        projects: state.projects,
        site: buildSiteFromForm(),
        emptyPortfolioConfirmation: emptyConfirmation || ""
      })
    });

    state.savedProjectsSnapshot = JSON.stringify(state.projects);
    state.savedSiteSnapshot = JSON.stringify(buildSiteFromForm());
    state.backupExists = Boolean(payload.backupExists);
    updateBackupButtons();
    setStatus(payload.message);
    setGitOutput(payload.gitStatus?.join("\n") || "Saved locally.");
    updateMode();
    return true;
  } catch (error) {
    reportActionError("Save locally", error);
    return false;
  } finally {
    elements.saveButton.disabled = false;
    elements.savePreviewButton.disabled = false;
    updateLocalActionButtons();
  }
};

const saveAndPreview = async () => {
  if (blockLocalApiAction("Save + Preview")) {
    updateLocalActionButtons();
    return;
  }

  const previewWindow = window.open("about:blank", "portfolio-preview");
  const saved = await saveLocally({ skipConfirm: true });
  if (!saved) {
    if (previewWindow && !previewWindow.closed) {
      previewWindow.close();
    }
    return;
  }

  const previewUrl = "http://127.0.0.1:8080/";
  if (previewWindow) {
    previewWindow.location.href = previewUrl;
    previewWindow.focus();
    state.previewWindow = previewWindow;
  } else if (state.previewWindow && !state.previewWindow.closed) {
    state.previewWindow.location.href = previewUrl;
    state.previewWindow.focus();
  } else {
    state.previewWindow = window.open(previewUrl, "portfolio-preview");
  }

  setStatus("Saved locally and opened preview.");
};

const runPortfolioCheck = async () => {
  if (blockLocalApiAction("Run check")) {
    updateLocalActionButtons();
    return;
  }

  try {
    elements.runCheckButton.disabled = true;
    setStatus("Running npm run check...");
    setGitOutput("Running npm run check...");
    const payload = await apiRequest("/api/check", { method: "POST" });
    setStatus(payload.message || "Portfolio check passed.");
    setGitOutput(payload.output);
  } catch (error) {
    reportActionError("Run check", error);
  } finally {
    elements.runCheckButton.disabled = false;
    updateLocalActionButtons();
  }
};

const restoreBackup = async (mode) => {
  if (blockLocalApiAction(mode === "undo" ? "Undo save" : "Restore backup")) {
    updateLocalActionButtons();
    return;
  }

  if (!state.backupExists) {
    setStatus("No backup file exists yet.");
    return;
  }

  const confirmed = window.confirm(
    `${mode === "undo" ? "Undo last save" : "Restore backup"}?\n\nThis restores available project and site data backups.`
  );
  if (!confirmed) {
    return;
  }

  try {
    const payload = await apiRequest("/api/restore-backup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ mode })
    });

    await loadProjects();
    setStatus(payload.message);
    setGitOutput(payload.gitStatus?.join("\n") || "Backup restored.");
  } catch (error) {
    reportActionError(mode === "undo" ? "Undo save" : "Restore backup", error);
  }
};

const publishChanges = async () => {
  if (blockLocalApiAction("Publish")) {
    updateLocalActionButtons();
    return;
  }

  if (
    hasUnsavedChanges() &&
    !window.confirm(
      unsavedChangesMessage("Publish with these unapplied or unsaved changes? The editor will apply and save them before publishing.")
    )
  ) {
    setStatus("Publish cancelled.");
    return;
  }

  if (!persistCurrentFormIfNeeded()) {
    return;
  }

  const summary = buildProjectDiffSummary(state.projects);
  const summaryText = buildPublishSummaryText(state.projects, summary);
  let emptyConfirmation = null;

  if (state.projects.length === 0) {
    emptyConfirmation = requestEmptyPortfolioConfirmation("PUBLISH EMPTY PORTFOLIO", "Publish");
    if (!emptyConfirmation) {
      return;
    }
  }

  const summaryConfirmed = window.confirm(`${summaryText}\n\nContinue to publish review?`);
  if (!summaryConfirmed) {
    return;
  }

  const finalConfirmed = window.confirm(
    "Publish changes to GitHub?\n\nThis will run:\n- npm run check\n- git add approved portfolio files\n- git commit -m \"Update portfolio\"\n- git push"
  );
  if (!finalConfirmed) {
    return;
  }

  if (isWorkingListDirty() || isSiteDirty()) {
    const saved = await saveLocally({ skipConfirm: true, emptyConfirmationOverride: emptyConfirmation });
    if (!saved) {
      return;
    }
  }

  try {
    elements.publishButton.disabled = true;
    const payload = await apiRequest("/api/publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        emptyPortfolioConfirmation: emptyConfirmation || ""
      })
    });

    state.sourceProjects = deepClone(state.projects);
    state.savedProjectsSnapshot = JSON.stringify(state.projects);
    state.sourceSite = deepClone(buildSiteFromForm());
    state.savedSiteSnapshot = JSON.stringify(buildSiteFromForm());
    setStatus(payload.message);
    setGitOutput(payload.output);
    updateMode();
  } catch (error) {
    reportActionError("Publish", error);
  } finally {
    elements.publishButton.disabled = false;
    updateLocalActionButtons();
  }
};

const bindEvents = () => {
  elements.tabButtons.forEach((button) => {
    button.addEventListener("click", () => showTab(button.dataset.tabTarget));
  });

  elements.themeToggleButton.addEventListener("click", () => {
    applyTheme(state.theme === "dark" ? "light" : "dark");
  });

  elements.reloadButton.addEventListener("click", async () => {
    if (!confirmDiscardIfDirty()) {
      return;
    }

    try {
      await loadProjects();
      setStatus("Reloaded from data/projects.js.");
    } catch (error) {
      setStatus(error.message);
    }
  });

  elements.undoSaveButton.addEventListener("click", () => restoreBackup("undo"));
  elements.restoreBackupButton.addEventListener("click", () => restoreBackup("restore"));
  elements.search.addEventListener("input", renderProjectList);
  elements.newProjectButton.addEventListener("click", () => {
    if (!confirmDiscardIfDirty()) {
      return;
    }

    populateForm(createBlankProject(), null);
    setStatus("New project form ready.");
  });
  elements.duplicateProjectButton.addEventListener("click", duplicateCurrentProject);
  elements.applyProjectButton.addEventListener("click", applyCurrentProject);
  elements.deleteProjectButton.addEventListener("click", deleteCurrentProject);
  elements.resetFormButton.addEventListener("click", resetForm);
  elements.saveButton.addEventListener("click", () => saveLocally());
  elements.savePreviewButton.addEventListener("click", saveAndPreview);
  elements.runCheckButton.addEventListener("click", runPortfolioCheck);
  elements.publishButton.addEventListener("click", publishChanges);
  elements.moveProjectUpButton.addEventListener("click", () => moveSelectedProject(-1));
  elements.moveProjectDownButton.addEventListener("click", () => moveSelectedProject(1));
  elements.moveProjectTopButton.addEventListener("click", moveSelectedProjectToTop);
  elements.copyCurrentButton.addEventListener("click", copyCurrentObject);
  elements.downloadCurrentButton.addEventListener("click", downloadCurrentObject);
  [elements.thumbnailPanX, elements.thumbnailPanY, elements.thumbnailZoomRange].forEach((input) => {
    input.addEventListener("input", (event) => {
      event.stopPropagation();
      syncFieldsFromCropControls();
      refreshPreview();
    });
  });
  elements.downloadCropButton.addEventListener("click", downloadCroppedThumbnail);
  elements.form.addEventListener("input", () => {
    syncLibraryFolderWithSlug();
    renderImageLibrary();
    refreshPreview();
  });
  elements.form.addEventListener("change", refreshPreview);
  elements.imageFolderSelect.addEventListener("change", () => {
    state.selectedLibraryFolder = elements.imageFolderSelect.value;
    renderImageLibrary();
  });
  elements.addParagraphButton.addEventListener("click", () => {
    elements.paragraphList.append(createParagraphRow());
    refreshPreview();
  });
  elements.addLinkButton.addEventListener("click", () => {
    elements.linkList.append(createLinkRow());
    refreshPreview();
  });
  elements.addSiteSocialLinkButton.addEventListener("click", () => {
    elements.siteSocialLinkList.append(createSiteLinkRow(elements.siteSocialLinkList));
    updateMode();
  });
  elements.addSiteRoleLinkButton.addEventListener("click", () => {
    elements.siteRoleLinkList.append(createSiteLinkRow(elements.siteRoleLinkList));
    updateMode();
  });
  elements.addImageButton.addEventListener("click", () => {
    const row = createImageRow({ type: "image" });
    elements.imageList.append(row);
    setActiveImageRow(row.dataset.rowId);
    refreshPreview();
  });
  elements.addVideoButton.addEventListener("click", () => {
    const row = createImageRow({ type: "video", provider: "youtube" });
    elements.imageList.append(row);
    setActiveImageRow(row.dataset.rowId);
    refreshPreview();
  });
  elements.addAudioButton.addEventListener("click", () => {
    const row = createImageRow({ type: "audio", provider: "file" });
    elements.imageList.append(row);
    setActiveImageRow(row.dataset.rowId);
    refreshPreview();
  });
  elements.thumbnailPresetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      elements.thumbnailPosition.value = button.dataset.thumbnailPreset;
      elements.thumbnailZoom.value = button.dataset.thumbnailZoom === "1" ? "" : button.dataset.thumbnailZoom;
      refreshPreview();
    });
  });

  window.addEventListener("beforeunload", (event) => {
    if (!hasUnsavedChanges()) {
      return;
    }

    event.preventDefault();
    event.returnValue = "";
  });
};

const init = async () => {
  initTheme();
  updateRuntimeUi();
  bindEvents();
  updateBackupButtons();
  updateLocalActionButtons();

  try {
    await loadProjects();
    setStatus(
      state.runtime.canUseLocalApi
        ? "Projects loaded from data/projects.js."
        : "Projects loaded in public read-only mode. Publishing disabled on public site."
    );
  } catch (error) {
    setStatus(error.message);
    setGitOutput(
      state.runtime.canUseLocalApi
        ? "Make sure the local admin server is running with `npm run admin`."
        : `${publicDisabledMessage()}\n\nThe static project data could not be loaded.`
    );
    updateLocalActionButtons();
  }
};

init();
