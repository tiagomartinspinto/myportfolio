import { PROJECTS, PROJECT_FILTERS } from "./data/projects.js";

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
  dialogLinks: document.querySelector("#project-links"),
  particleCanvas: document.querySelector("#particle-canvas")
};

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const labelForFilter = (filter) =>
  filter === "all"
    ? "All"
    : filter === "AV production"
      ? "AV production"
      : filter.replace(/\b\w/g, (letter) => letter.toUpperCase());

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
  elements.filterBar.replaceChildren(...PROJECT_FILTERS.map(createFilterButton));
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
      <p class="project-card__year">${project.year}</p>
      <h3>${project.title}</h3>
      <p>${project.shortDescription}</p>
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
      item.textContent = tag;
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
  document.querySelector("#selected-work")?.scrollIntoView({ behavior: reducedMotionQuery.matches ? "auto" : "smooth", block: "start" });
};

const startParticles = () => {
  if (!elements.particleCanvas || reducedMotionQuery.matches) {
    return;
  }

  const canvas = elements.particleCanvas;
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const pointer = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    active: false,
    lastMoveAt: 0
  };

  let animationFrame = 0;
  let particles = [];

  const colorFamilies = [
    { fill: "rgba(255, 118, 118, 0.45)", line: "255, 118, 118" },
    { fill: "rgba(130, 206, 255, 0.45)", line: "130, 206, 255" },
    { fill: "rgba(126, 255, 188, 0.45)", line: "126, 255, 188" }
  ];

  const particleCount = () =>
    Math.max(42, Math.min(88, Math.round((window.innerWidth * window.innerHeight) / 28000)));

  const createParticle = () => {
    const family = Math.floor(Math.random() * colorFamilies.length);
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      driftX: (Math.random() - 0.5) * 0.16,
      driftY: (Math.random() - 0.5) * 0.16,
      size: 1 + (Math.random() * 1.8),
      family
    };
  };

  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const target = particleCount();
    while (particles.length < target) {
      particles.push(createParticle());
    }
    particles = particles.slice(0, target);
  };

  const movePointer = (event) => {
    pointer.targetX = event.clientX;
    pointer.targetY = event.clientY;
    pointer.active = true;
    pointer.lastMoveAt = performance.now();
  };

  const draw = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const maxDistance = 150;
    const influenceRadius = 220;
    const now = performance.now();

    context.clearRect(0, 0, width, height);
    pointer.x += (pointer.targetX - pointer.x) * 0.06;
    pointer.y += (pointer.targetY - pointer.y) * 0.06;

    if (pointer.active && now - pointer.lastMoveAt > 1400) {
      pointer.active = false;
    }

    for (const particle of particles) {
      particle.vx += (particle.driftX - particle.vx) * 0.008;
      particle.vy += (particle.driftY - particle.vy) * 0.008;

      if (pointer.active) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0 && distance < influenceRadius) {
          const pull = (1 - (distance / influenceRadius)) * 0.02;
          particle.vx += (dx / distance) * pull;
          particle.vy += (dy / distance) * pull;
        }
      }

      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x <= 0 || particle.x >= width) {
        particle.vx *= -1;
      }
      if (particle.y <= 0 || particle.y >= height) {
        particle.vy *= -1;
      }

      context.beginPath();
      context.fillStyle = colorFamilies[particle.family].fill;
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    for (let index = 0; index < particles.length; index += 1) {
      const a = particles[index];
      for (let compareIndex = index + 1; compareIndex < particles.length; compareIndex += 1) {
        const b = particles[compareIndex];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance > maxDistance) {
          continue;
        }

        const alpha = (1 - distance / maxDistance) * (a.family === b.family ? 0.28 : 0.18);
        const lineColor = a.family === b.family
          ? colorFamilies[a.family].line
          : "255, 255, 255";

        context.beginPath();
        context.strokeStyle = `rgba(${lineColor}, ${alpha})`;
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
      }
    }

    animationFrame = window.requestAnimationFrame(draw);
  };

  resize();
  draw();

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", movePointer, { passive: true });
  reducedMotionQuery.addEventListener("change", () => {
    if (reducedMotionQuery.matches) {
      window.cancelAnimationFrame(animationFrame);
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }, { once: true });
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
startParticles();
