import {
  clearCanvas,
  downloadCanvasAsPng,
  drawCroppedThumbnail,
  formatObjectPosition,
  parseObjectPosition,
  parseThumbnailZoom
} from "./thumbnail-tools.js";

const state = {
  filters: [],
  projects: [],
  sourceProjects: [],
  selectedIndex: null,
  loadedSnapshot: "",
  savedProjectsSnapshot: "",
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
  theme: "dark"
};

const elements = {
  editorMode: document.querySelector("#editor-mode"),
  editorStatus: document.querySelector("#editor-status"),
  gitOutput: document.querySelector("#git-output"),
  previewLink: document.querySelector("#preview-link"),
  search: document.querySelector("#project-search"),
  reloadButton: document.querySelector("#reload-button"),
  undoSaveButton: document.querySelector("#undo-save-button"),
  restoreBackupButton: document.querySelector("#restore-backup-button"),
  saveButton: document.querySelector("#save-button"),
  publishButton: document.querySelector("#publish-button"),
  themeToggleButton: document.querySelector("#theme-toggle-button"),
  newProjectButton: document.querySelector("#new-project-button"),
  duplicateProjectButton: document.querySelector("#duplicate-project-button"),
  applyProjectButton: document.querySelector("#apply-project-button"),
  deleteProjectButton: document.querySelector("#delete-project-button"),
  resetFormButton: document.querySelector("#reset-form-button"),
  projectCount: document.querySelector("#project-count"),
  projectList: document.querySelector("#project-list"),
  form: document.querySelector("#project-form"),
  slug: document.querySelector("#slug"),
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
  tabPanels: Array.from(document.querySelectorAll("[data-tab-panel]"))
};

const deepClone = (value) => JSON.parse(JSON.stringify(value));

const createBlankProject = () => ({
  slug: "",
  title: "",
  year: "",
  projectType: "",
  role: "",
  categories: [],
  tags: [],
  shortDescription: "",
  fullDescription: [""],
  links: [{ label: "", url: "" }],
  images: [{ src: "", alt: "", width: "", height: "" }],
  thumbnailPosition: "",
  thumbnailZoom: ""
});

const labelForCategory = (category) =>
  category
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const normalizeAssetPath = (value) => String(value || "").trim().replace(/\\/g, "/").replace(/^\/+/, "");

const isValidAssetPath = (value) => normalizeAssetPath(value).startsWith("assets/projects/");

const formatList = (items) => (items.length ? items.join(", ") : "none");

const setStatus = (message) => {
  elements.editorStatus.textContent = message;
};

const setGitOutput = (value) => {
  elements.gitOutput.textContent = value || "No git output yet.";
};

const updateBackupButtons = () => {
  elements.undoSaveButton.disabled = !state.backupExists;
  elements.restoreBackupButton.disabled = !state.backupExists;
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
  images:
    Array.isArray(project.images) && project.images.length
      ? project.images.map((image) => ({
          src: image.src || "",
          alt: image.alt || "",
          width: image.width ?? "",
          height: image.height ?? ""
        }))
      : [{ src: "", alt: "", width: "", height: "" }],
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

const getImageRowValues = (row) => ({
  src: row.querySelector("[data-field='src']").value.trim(),
  alt: row.querySelector("[data-field='alt']").value.trim(),
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
  setStatus("Image set as the project thumbnail source.");
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
  const src = normalizeAssetPath(row.querySelector("[data-field='src']").value);
  const file = getImageLibraryFile(src);
  if (!file) {
    setStatus("Image file not found.");
    return;
  }

  window.open(`/${encodeURI(file.src)}`, "_blank", "noopener,noreferrer");
};

const detectDimensionsForRow = async (row) => {
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

  row.querySelector("[data-field='src']").value = src;
  setActiveImageRow(row.dataset.rowId);
  setStatus(`Selected ${src}.`);
  refreshPreview();
};

const createImageRow = (image = {}) => {
  const row = elements.imageTemplate.content.firstElementChild.cloneNode(true);
  row.dataset.rowId = `image-row-${state.nextImageRowId++}`;

  row.querySelector("[data-field='src']").value = image.src || "";
  row.querySelector("[data-field='alt']").value = image.alt || "";
  row.querySelector("[data-field='width']").value = image.width ?? "";
  row.querySelector("[data-field='height']").value = image.height ?? "";

  row.querySelectorAll("input").forEach((input) => {
    input.addEventListener("focus", () => setActiveImageRow(row.dataset.rowId));
  });

  row.addEventListener("click", () => setActiveImageRow(row.dataset.rowId));

  row.querySelector("[data-image-action='browse']").addEventListener("click", () => {
    setActiveImageRow(row.dataset.rowId);
    elements.imageFolderSelect.focus();
  });

  row.querySelector("[data-image-action='detect-dimensions']").addEventListener("click", () => {
    setActiveImageRow(row.dataset.rowId);
    detectDimensionsForRow(row);
  });

  row.querySelector("[data-image-action='copy-path']").addEventListener("click", () => {
    const src = row.querySelector("[data-field='src']").value.trim();
    if (!src) {
      setStatus("Add an image path first.");
      return;
    }
    copyText(src, "Image path copied.");
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

  const images = getImageRows()
    .map((row) => {
      const src = row.querySelector("[data-field='src']").value.trim();
      const alt = row.querySelector("[data-field='alt']").value.trim();
      const width = parseNumber(row.querySelector("[data-field='width']").value);
      const height = parseNumber(row.querySelector("[data-field='height']").value);
      return compactObject({ src, alt, width, height });
    })
    .filter((item) => Object.keys(item).length > 0);

  const project = {
    slug: elements.slug.value.trim(),
    title: elements.title.value.trim(),
    year: elements.year.value.trim(),
    projectType: elements.projectType.value.trim(),
    role: elements.role.value.trim(),
    categories,
    tags: elements.tags.value.split(",").map((tag) => tag.trim()).filter(Boolean),
    shortDescription: elements.shortDescription.value.trim(),
    fullDescription,
    links,
    images
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
      project.title ||
      project.year ||
      project.projectType ||
      project.role ||
      project.shortDescription ||
      project.categories.length ||
      project.tags.length ||
      project.fullDescription.length ||
      project.links.length ||
      project.images.length ||
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

const confirmDiscardIfDirty = () => {
  if (!isDirty()) {
    return true;
  }

  return window.confirm("Discard unsaved form changes?");
};

const updateMode = () => {
  const dirty = isDirty();
  const workingListDirty = JSON.stringify(state.projects) !== state.savedProjectsSnapshot;
  const suffix = workingListDirty ? " / local file not saved" : "";

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
};

const updateImageRowPreview = (row) => {
  const srcInput = row.querySelector("[data-field='src']");
  const widthInput = row.querySelector("[data-field='width']");
  const heightInput = row.querySelector("[data-field='height']");
  const altInput = row.querySelector("[data-field='alt']");
  const previewImage = row.querySelector("[data-image-preview]");
  const cropPreviewImage = row.querySelector("[data-image-crop-preview]");
  const warning = row.querySelector("[data-image-warning]");
  const meta = row.querySelector("[data-image-detected-meta]");
  const openButton = row.querySelector("[data-image-action='open-image']");
  const thumbnailPosition = getThumbnailPositionValue();
  const thumbnailZoom = getThumbnailZoomValue();
  const src = normalizeAssetPath(srcInput.value);
  const file = getImageLibraryFile(src);
  const metadataWidth = widthInput.value.trim();
  const metadataHeight = heightInput.value.trim();
  const metadataText = metadataWidth && metadataHeight ? `${metadataWidth} x ${metadataHeight}` : "missing metadata";
  const fileText = file?.width && file?.height ? `${file.width} x ${file.height}` : "unknown file size";

  previewImage.style.objectPosition = thumbnailPosition;
  cropPreviewImage.style.setProperty("--thumb-position", thumbnailPosition);
  cropPreviewImage.style.setProperty("--thumb-zoom", String(thumbnailZoom));
  previewImage.alt = altInput.value.trim() || "Image preview";
  cropPreviewImage.alt = altInput.value.trim() || "Thumbnail crop preview";

  if (!src) {
    previewImage.removeAttribute("src");
    cropPreviewImage.removeAttribute("src");
    warning.textContent = "No image selected";
    meta.textContent = `Path: -\nMetadata: ${metadataText}`;
    openButton.disabled = true;
    return;
  }

  if (!isValidAssetPath(src)) {
    previewImage.removeAttribute("src");
    cropPreviewImage.removeAttribute("src");
    warning.textContent = "Invalid path. Use assets/projects/...";
    meta.textContent = `Path: ${src}\nMetadata: ${metadataText}`;
    openButton.disabled = true;
    return;
  }

  if (!file) {
    previewImage.removeAttribute("src");
    cropPreviewImage.removeAttribute("src");
    warning.textContent = "Missing file. Check the path or add the image under assets/projects/[slug]/.";
    meta.textContent = `Path: ${src}\nMetadata: ${metadataText}`;
    openButton.disabled = true;
    return;
  }

  previewImage.src = `/${encodeURI(file.src)}`;
  cropPreviewImage.src = `/${encodeURI(file.src)}`;
  warning.textContent = "";
  meta.textContent = `Path: ${src}\nMetadata: ${metadataText}\nFile: ${fileText}\nCrop: ${thumbnailPosition}, ${thumbnailZoom.toFixed(2)}x`;
  openButton.disabled = false;
};

const clearImagePreview = (image) => {
  image.removeAttribute("src");
  image.alt = "";
};

const getActiveImageInfo = () => {
  const row = getImageRowById(state.activeImageRowId) || getImageRows()[0] || null;
  const src = row ? normalizeAssetPath(row.querySelector("[data-field='src']").value) : "";
  const alt = row ? row.querySelector("[data-field='alt']").value.trim() : "";
  const file = getImageLibraryFile(src);

  return { row, src, alt, file };
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
  const { row, src, alt, file } = getActiveImageInfo();

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

  const imageUrl = `/${encodeURI(file.src)}`;
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
  const image = project.images[0];
  const position = project.thumbnailPosition || getThumbnailPositionValue();
  const zoom = parseThumbnailZoom(project.thumbnailZoom);

  elements.miniProjectTitle.textContent = project.title || "Untitled";
  elements.miniProjectDescription.textContent = project.shortDescription || "";
  setThumbnailPreviewStyle(elements.miniProjectImage, position, zoom);

  if (!image?.src || !isValidAssetPath(image.src) || !getImageLibraryFile(image.src)) {
    clearImagePreview(elements.miniProjectImage);
    return;
  }

  elements.miniProjectImage.src = `/${encodeURI(normalizeAssetPath(image.src))}`;
  elements.miniProjectImage.alt = image.alt || `${project.title || "Project"} thumbnail preview`;
};

const downloadCroppedThumbnail = async () => {
  const position = getThumbnailPositionValue();
  const zoom = getThumbnailZoomValue();
  const { src, file } = getActiveImageInfo();

  if (!src || !file) {
    setStatus("Choose an existing local image before downloading a cropped thumbnail.");
    return;
  }

  const slug = elements.slug.value.trim() || file.folder || "project";
  const filename = `${slug}-thumbnail-crop.png`;

  try {
    await drawCroppedThumbnail(elements.thumbnailCanvasPreview, `/${encodeURI(file.src)}`, position, zoom);
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
    (project.images || []).forEach((image, index) => {
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
  elements.imageList.replaceChildren(...safe.images.map((image) => createImageRow(image)));

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
    selectButton.innerHTML = `
      <div class="project-item__title">${project.title}</div>
      <div class="project-item__meta">${project.year}</div>
    `;
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
      <span class="image-library-item__thumb"><img src="/${encodeURI(file.src)}" alt=""></span>
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
  const payload = await apiRequest("/api/projects");
  state.filters = payload.filters.filter((category) => category !== "all");
  state.projects = deepClone(payload.projects);
  state.sourceProjects = deepClone(payload.projects);
  state.savedProjectsSnapshot = JSON.stringify(state.projects);
  state.backupExists = Boolean(payload.backupExists);
  state.previewUrl = payload.previewUrl || state.previewUrl;

  elements.previewLink.href = state.previewUrl;
  renderCategoryOptions();
  await loadImageLibrary();
  renderProjectList();
  setGitOutput(payload.gitStatus?.join("\n") || "Working tree clean for data/projects.js and PROJECT_STATUS.md.");
  updateBackupButtons();

  if (state.projects.length) {
    populateForm(state.projects[0], 0);
  } else {
    populateForm(createBlankProject(), null);
  }
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
  if (!persistCurrentFormIfNeeded()) {
    return false;
  }

  if (!skipConfirm) {
    const confirmed = window.confirm(
      "Save locally?\n\nThis rewrites:\n- data/projects.js\n\nBefore saving, the editor refreshes:\n- data/projects.backup.js"
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
    const payload = await apiRequest("/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        projects: state.projects,
        emptyPortfolioConfirmation: emptyConfirmation || ""
      })
    });

    state.savedProjectsSnapshot = JSON.stringify(state.projects);
    state.backupExists = Boolean(payload.backupExists);
    updateBackupButtons();
    setStatus(payload.message);
    setGitOutput(payload.gitStatus?.join("\n") || "Saved locally.");
    updateMode();
    return true;
  } catch (error) {
    const details = error.payload?.errors?.join("\n") || error.payload?.message || error.message;
    setStatus(error.message);
    setGitOutput(details);
    return false;
  } finally {
    elements.saveButton.disabled = false;
  }
};

const restoreBackup = async (mode) => {
  if (!state.backupExists) {
    setStatus("No backup file exists yet.");
    return;
  }

  const confirmed = window.confirm(
    `${mode === "undo" ? "Undo last save" : "Restore backup"}?\n\nThis replaces data/projects.js with data/projects.backup.js.`
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
    setStatus(error.message);
    setGitOutput(error.payload?.message || error.message);
  }
};

const publishChanges = async () => {
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
    "Publish changes to GitHub?\n\nThis will run:\n- git add data/projects.js PROJECT_STATUS.md\n- git commit -m \"Update portfolio projects\"\n- git push"
  );
  if (!finalConfirmed) {
    return;
  }

  if (JSON.stringify(state.projects) !== state.savedProjectsSnapshot) {
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
    setStatus(payload.message);
    setGitOutput(payload.output);
    updateMode();
  } catch (error) {
    setStatus(error.message);
    setGitOutput(error.payload?.output || error.payload?.message || error.message);
  } finally {
    elements.publishButton.disabled = false;
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
  elements.publishButton.addEventListener("click", publishChanges);
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
  elements.addImageButton.addEventListener("click", () => {
    const row = createImageRow();
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
};

const init = async () => {
  initTheme();
  bindEvents();
  updateBackupButtons();

  try {
    await loadProjects();
    setStatus("Projects loaded from data/projects.js.");
  } catch (error) {
    setStatus(error.message);
    setGitOutput("Make sure the local admin server is running with `npm run admin`.");
  }
};

init();
