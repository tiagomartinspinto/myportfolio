const state = {
  filters: [],
  projects: [],
  selectedIndex: null,
  loadedSnapshot: "",
  savedProjectsSnapshot: ""
};

const elements = {
  editorMode: document.querySelector("#editor-mode"),
  editorStatus: document.querySelector("#editor-status"),
  gitOutput: document.querySelector("#git-output"),
  search: document.querySelector("#project-search"),
  reloadButton: document.querySelector("#reload-button"),
  saveButton: document.querySelector("#save-button"),
  publishButton: document.querySelector("#publish-button"),
  newProjectButton: document.querySelector("#new-project-button"),
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
  tags: document.querySelector("#tags"),
  shortDescription: document.querySelector("#shortDescription"),
  categoryOptions: document.querySelector("#category-options"),
  paragraphList: document.querySelector("#paragraph-list"),
  linkList: document.querySelector("#link-list"),
  imageList: document.querySelector("#image-list"),
  addParagraphButton: document.querySelector("#add-paragraph-button"),
  addLinkButton: document.querySelector("#add-link-button"),
  addImageButton: document.querySelector("#add-image-button"),
  copyCurrentButton: document.querySelector("#copy-current-button"),
  downloadCurrentButton: document.querySelector("#download-current-button"),
  preview: document.querySelector("#object-preview"),
  paragraphTemplate: document.querySelector("#paragraph-template"),
  linkTemplate: document.querySelector("#link-template"),
  imageTemplate: document.querySelector("#image-template")
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
  thumbnailPosition: ""
});

const labelForCategory = (category) =>
  category
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const setStatus = (message) => {
  elements.editorStatus.textContent = message;
};

const setGitOutput = (value) => {
  elements.gitOutput.textContent = value || "No git output yet.";
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

const parseNumber = (value) => {
  const trimmed = String(value).trim();
  if (!trimmed) {
    return undefined;
  }

  const numeric = Number(trimmed);
  return Number.isFinite(numeric) ? numeric : undefined;
};

const compactObject = (object) =>
  Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== "" && value !== undefined && value !== null)
  );

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
  thumbnailPosition: project.thumbnailPosition || ""
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

const createImageRow = (image = {}) => {
  const row = elements.imageTemplate.content.firstElementChild.cloneNode(true);
  row.querySelector("[data-field='src']").value = image.src || "";
  row.querySelector("[data-field='alt']").value = image.alt || "";
  row.querySelector("[data-field='width']").value = image.width ?? "";
  row.querySelector("[data-field='height']").value = image.height ?? "";
  row.querySelector("[data-remove-row]").addEventListener("click", () => {
    row.remove();
    if (!elements.imageList.children.length) {
      elements.imageList.append(createImageRow());
    }
    refreshPreview();
  });
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

  const images = Array.from(elements.imageList.querySelectorAll(".repeatable-item"), (row) => {
    const src = row.querySelector("[data-field='src']").value.trim();
    const alt = row.querySelector("[data-field='alt']").value.trim();
    const width = parseNumber(row.querySelector("[data-field='width']").value);
    const height = parseNumber(row.querySelector("[data-field='height']").value);
    return compactObject({ src, alt, width, height });
  }).filter((item) => Object.keys(item).length > 0);

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

  return project;
};

const currentProjectPreview = () => JSON.stringify(buildProjectFromForm(), null, 2);

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
};

const refreshPreview = () => {
  elements.preview.textContent = currentProjectPreview();
  updateMode();
};

const populateForm = (project, index = null) => {
  const safe = projectForForm(project);
  state.selectedIndex = index;

  elements.slug.value = safe.slug;
  elements.title.value = safe.title;
  elements.year.value = safe.year;
  elements.projectType.value = safe.projectType;
  elements.role.value = safe.role;
  elements.thumbnailPosition.value = safe.thumbnailPosition;
  elements.tags.value = safe.tags.join(", ");
  elements.shortDescription.value = safe.shortDescription;

  elements.categoryOptions.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.checked = safe.categories.includes(input.value);
  });

  elements.paragraphList.replaceChildren(...safe.fullDescription.map((paragraph) => createParagraphRow(paragraph)));
  elements.linkList.replaceChildren(...safe.links.map((link) => createLinkRow(link)));
  elements.imageList.replaceChildren(...safe.images.map((image) => createImageRow(image)));

  state.loadedSnapshot = JSON.stringify(buildProjectFromForm());
  refreshPreview();
  renderProjectList();
};

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
      project.thumbnailPosition
  );

const isDirty = () => JSON.stringify(buildProjectFromForm()) !== state.loadedSnapshot;

const confirmDiscardIfDirty = () => {
  if (!isDirty()) {
    return true;
  }

  return window.confirm("Discard unsaved form changes?");
};

const renderProjectList = () => {
  const query = elements.search.value.trim().toLowerCase();
  const fragment = document.createDocumentFragment();

  state.projects.forEach((project, index) => {
    if (query && !project.title.toLowerCase().includes(query)) {
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
    upButton.textContent = "↑";
    upButton.disabled = index === 0;
    upButton.addEventListener("click", () => moveProject(index, -1));

    const downButton = document.createElement("button");
    downButton.type = "button";
    downButton.textContent = "↓";
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
  return true;
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
  updateMode();
  setStatus("Project order updated locally.");
};

const deleteCurrentProject = () => {
  if (state.selectedIndex === null) {
    setStatus("Load an existing project first.");
    return;
  }

  const project = state.projects[state.selectedIndex];
  if (!window.confirm(`Delete ${project.title} from the working list?`)) {
    return;
  }

  state.projects.splice(state.selectedIndex, 1);

  if (state.projects.length === 0) {
    populateForm(createBlankProject(), null);
  } else {
    const nextIndex = Math.min(state.selectedIndex, state.projects.length - 1);
    populateForm(state.projects[nextIndex], nextIndex);
  }

  updateMode();
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

const loadProjects = async () => {
  const payload = await apiRequest("/api/projects");
  state.filters = payload.filters.filter((category) => category !== "all");
  state.projects = deepClone(payload.projects);
  state.savedProjectsSnapshot = JSON.stringify(state.projects);

  renderCategoryOptions();
  renderProjectList();
  setGitOutput(payload.gitStatus?.join("\n") || "Working tree clean for data/projects.js and PROJECT_STATUS.md.");

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

const saveLocally = async () => {
  if (!persistCurrentFormIfNeeded()) {
    return;
  }

  try {
    elements.saveButton.disabled = true;
    const payload = await apiRequest("/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ projects: state.projects })
    });

    state.savedProjectsSnapshot = JSON.stringify(state.projects);
    setStatus(payload.message);
    setGitOutput(payload.gitStatus?.join("\n") || "Saved locally.");
    updateMode();
  } catch (error) {
    const details = error.payload?.errors?.join("\n") || error.message;
    setStatus(error.message);
    setGitOutput(details);
  } finally {
    elements.saveButton.disabled = false;
  }
};

const publishChanges = async () => {
  if (!persistCurrentFormIfNeeded()) {
    return;
  }

  if (JSON.stringify(state.projects) !== state.savedProjectsSnapshot) {
    await saveLocally();
    if (JSON.stringify(state.projects) !== state.savedProjectsSnapshot) {
      return;
    }
  }

  if (!window.confirm("Publish changes now? This will run git add, git commit, and git push.")) {
    return;
  }

  try {
    elements.publishButton.disabled = true;
    const payload = await apiRequest("/api/publish", {
      method: "POST"
    });

    setStatus(payload.message);
    setGitOutput(payload.output);
  } catch (error) {
    setStatus(error.message);
    setGitOutput(error.payload?.output || error.message);
  } finally {
    elements.publishButton.disabled = false;
  }
};

const bindEvents = () => {
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

  elements.search.addEventListener("input", renderProjectList);
  elements.newProjectButton.addEventListener("click", () => {
    if (!confirmDiscardIfDirty()) {
      return;
    }

    populateForm(createBlankProject(), null);
    setStatus("New project form ready.");
  });
  elements.applyProjectButton.addEventListener("click", applyCurrentProject);
  elements.deleteProjectButton.addEventListener("click", deleteCurrentProject);
  elements.resetFormButton.addEventListener("click", resetForm);
  elements.saveButton.addEventListener("click", saveLocally);
  elements.publishButton.addEventListener("click", publishChanges);
  elements.copyCurrentButton.addEventListener("click", copyCurrentObject);
  elements.downloadCurrentButton.addEventListener("click", downloadCurrentObject);
  elements.form.addEventListener("input", refreshPreview);
  elements.form.addEventListener("change", refreshPreview);
  elements.addParagraphButton.addEventListener("click", () => {
    elements.paragraphList.append(createParagraphRow());
    refreshPreview();
  });
  elements.addLinkButton.addEventListener("click", () => {
    elements.linkList.append(createLinkRow());
    refreshPreview();
  });
  elements.addImageButton.addEventListener("click", () => {
    elements.imageList.append(createImageRow());
    refreshPreview();
  });
};

const init = async () => {
  bindEvents();

  try {
    await loadProjects();
    setStatus("Projects loaded from data/projects.js.");
  } catch (error) {
    setStatus(error.message);
    setGitOutput("Make sure the local admin server is running with `npm run admin`.");
  }
};

init();
