import { PROJECTS, PROJECT_DISPLAY_FILTERS } from "./data/projects.js";

const state = {
  activeFilter: "all",
  activeProject: null,
  lastTrigger: null
};

const elements = {
  filterBar: document.querySelector("#project-filters"),
  projectGrid: document.querySelector("#project-grid"),
  jumpButtons: Array.from(document.querySelectorAll("[data-filter-jump]")),
  dialog: document.querySelector("#project-dialog"),
  dialogClose: document.querySelector("#project-dialog-close"),
  featureImage: document.querySelector("#project-feature-image"),
  gallery: document.querySelector("#project-gallery"),
  dialogKicker: document.querySelector("#project-dialog-kicker"),
  dialogTitle: document.querySelector("#project-dialog-title"),
  dialogYear: document.querySelector("#project-year"),
  dialogRole: document.querySelector("#project-role"),
  dialogType: document.querySelector("#project-type"),
  dialogTags: document.querySelector("#project-tags"),
  dialogDescription: document.querySelector("#project-description"),
  dialogLinks: document.querySelector("#project-links")
};

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

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
  PROJECTS.filter((project) => matchesFilter(project, state.activeFilter));

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

const renderProjects = () => {
  const visibleProjects = getVisibleProjects();
  const fragment = document.createDocumentFragment();

  visibleProjects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "project-card__button";
    button.setAttribute("aria-label", `Open project: ${project.title}`);
    button.addEventListener("click", () => openProject(project, button));

    const image = project.images[0];
    const imageWrap = document.createElement("div");
    imageWrap.className = "project-card__image";
    imageWrap.style.setProperty("--thumb-position", project.thumbnailPosition || "center center");
    imageWrap.style.setProperty("--thumb-zoom", String(project.thumbnailZoom || 1));
    imageWrap.innerHTML = `
      <img
        src="${image.src}"
        alt="${image.alt}"
        width="${image.width}"
        height="${image.height}"
        loading="lazy"
        decoding="async"
        sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
      >
    `;

    const body = document.createElement("div");
    body.className = "project-card__body";
    body.innerHTML = `
      <h3>${project.title}</h3>
      <p class="project-card__line">${project.shortDescription}</p>
    `;

    button.append(imageWrap, body);
    card.append(button);
    fragment.append(card);
  });

  elements.projectGrid.replaceChildren(fragment);
};

const updateFeatureImage = (image, projectTitle) => {
  elements.featureImage.src = image.src;
  elements.featureImage.alt = image.alt || `${projectTitle} image`;
  elements.featureImage.width = image.width;
  elements.featureImage.height = image.height;
  elements.featureImage.loading = "eager";
  elements.featureImage.decoding = "async";
};

const renderGallery = (project) => {
  if (project.images.length <= 1) {
    elements.gallery.replaceChildren();
    elements.gallery.hidden = true;
    return;
  }

  elements.gallery.hidden = false;
  const fragment = document.createDocumentFragment();

  project.images.forEach((image, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-thumb";
    button.setAttribute("aria-label", `Show image ${index + 1} for ${project.title}`);
    button.setAttribute("aria-pressed", String(index === 0));

    button.innerHTML = `
      <img
        src="${image.src}"
        alt="${image.alt}"
        width="${image.width}"
        height="${image.height}"
        loading="lazy"
        decoding="async"
        sizes="160px"
      >
    `;

    button.addEventListener("click", () => {
      updateFeatureImage(image, project.title);
      elements.gallery.querySelectorAll(".gallery-thumb").forEach((thumb) => {
        thumb.setAttribute("aria-pressed", String(thumb === button));
      });
    });

    fragment.append(button);
  });

  elements.gallery.replaceChildren(fragment);
};

const renderProjectDetail = (project) => {
  state.activeProject = project.slug;
  updateFeatureImage(project.images[0], project.title);
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

  elements.filterBar.querySelectorAll(".filter-pill").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === filter);
    button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
  });

  renderProjects();
};

const handleFilterJump = (event) => {
  const filter = event.currentTarget.dataset.filterJump;
  if (!filter) {
    return;
  }

  setFilter(filter);
  document.querySelector("#work")?.scrollIntoView({ behavior: reducedMotionQuery.matches ? "auto" : "smooth", block: "start" });
};

elements.jumpButtons.forEach((button) => {
  button.addEventListener("click", handleFilterJump);
});

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

renderFilters();
setFilter("all");
