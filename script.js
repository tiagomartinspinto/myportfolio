const cargoImage = (hash, file, width = 1200) =>
  `https://freight.cargo.site/w/${width}/i/${hash}/${file}`;

const projects = [
  {
    id: "kuperkeikka",
    title: "Kuperkeikka",
    year: "2024-2025",
    tags: ["podcast", "youth work", "art education"],
    groups: ["education", "media"],
    image: cargoImage("O2636691801978688398635942960389", "kuperkeikka_logo.png"),
    description: [
      "A podcast series shaped with immigrant and immigrant-background teenagers, centering their experiences of education in Finland.",
      "The project mixes listening, public pedagogy, and media production into a shared platform for youth voices."
    ],
    links: [
      { label: "Listen on Spotify", url: "https://open.spotify.com/show/2itv5aRXDMaBTgLUOo389W?si=4d4df1ae65e543bf" }
    ]
  },
  {
    id: "cooler-planet-2024",
    title: "Cooler Planet 2024",
    year: "2024",
    tags: ["exhibition design", "project management", "visual design"],
    groups: ["exhibition"],
    image: cargoImage("G2304258516373167433283317161221", "cooler1.png"),
    description: [
      "An exhibition context for bio-based materials presented during Helsinki Design Week.",
      "The work moved between visual communication, spatial coordination, and translating research into a public-facing installation."
    ],
    links: [
      { label: "More info", url: "https://www.aalto.fi/en/events/bioeconomy-20" }
    ]
  },
  {
    id: "sattuma-com",
    title: "Sattuma.com",
    year: "2023-2024",
    tags: ["web development", "visual design", "game interface"],
    groups: ["digital", "education"],
    image: cargoImage("J2304258516557634874020412677381", "sattuma1.png"),
    description: [
      "A hybrid card game developed with Aalto University and the Academy of Fine Arts in Helsinki.",
      "The role combined full-stack web development, visual design, and the translation of game mechanics into a playable online format."
    ],
    links: [
      { label: "Play project", url: "https://sattumacards.onrender.com" },
      { label: "GitHub repo", url: "https://github.com/ptiagomp2/sattumacards" }
    ]
  },
  {
    id: "carried-by-invisible-bodies",
    title: "Carried by Invisible Bodies",
    year: "2022",
    tags: ["visual design", "audiovisual production"],
    groups: ["media", "exhibition"],
    image: cargoImage("K2304258516299380456988478954757", "bodies1.png"),
    description: [
      "A performance project around memory, movement, materiality, and the dialogue between bodies and space.",
      "Visual identity, documentation, and moving-image material were developed to stay close to the atmosphere of the live work."
    ],
    links: [
      { label: "Research portal", url: "https://research.aalto.fi/en/publications/carried-by-invisible-bodies/" }
    ]
  },
  {
    id: "from-the-dead-air-orgy",
    title: "From the Dead Air Orgy",
    year: "2020-2021",
    tags: ["live production", "streaming", "audiovisual"],
    groups: ["media"],
    image: cargoImage("L2304258516483847897725574470917", "fromdeadair2.png"),
    description: [
      "A series of live-streamed performance episodes combining multicam feeds, remote performers, and pre-recorded footage.",
      "The work focused on technical design, coordination, and staging a theatrical experience through distributed media."
    ],
    links: [
      { label: "Research portal", url: "https://research.aalto.fi/en/publications/from-the-dead-air-orgy-on-the-nature-of-things/" }
    ]
  },
  {
    id: "eating-together",
    title: "Eating Together",
    year: "2018-2019",
    tags: ["art education", "community", "research"],
    groups: ["education", "exhibition"],
    image: cargoImage("K2304250612349160218362059840773", "66648292_2430254997302289_3071132277858631680_o-edited-1.jpg_3.jpeg"),
    description: [
      "A community-based research project using cooking and shared meals as a way to think about togetherness.",
      "The work brought artistic practice and research into the same frame through participatory situations and public reflection."
    ],
    links: []
  },
  {
    id: "tyohuoneella-swap",
    title: "Tyohuoneella / SWAP",
    year: "2022",
    tags: ["video", "documentation", "visual design"],
    groups: ["media", "exhibition"],
    image: cargoImage("U2305399870607095187726752177413", "tyohuoneella.jpg"),
    description: [
      "A video and documentation project for the Tyohuoneella exhibition in Seinajoki.",
      "The work followed collaborative creative processes across performance, poetry, costume, and visual art."
    ],
    links: [
      { label: "Research portal", url: "https://research.aalto.fi/en/publications/ty%C3%B6huoneella-videon%C3%A4yt%C3%B6s/" }
    ]
  },
  {
    id: "flying-duets",
    title: "Flying Duets",
    year: "2017",
    tags: ["youth work", "research", "video"],
    groups: ["education", "media"],
    image: cargoImage("G2305407882913490115323077483781", "1714652855529.jpeg"),
    description: [
      "A cross-border youth project developed through video, exchange, and reflection on borders and multiculturalism.",
      "The moving-image work was shaped as part of the START - Create Cultural Change program."
    ],
    links: [
      { label: "Project site", url: "https://flyingduets.wordpress.com/" }
    ]
  },
  {
    id: "bqg",
    title: "BQG",
    year: "2013-2015",
    tags: ["art education", "youth work", "photography"],
    groups: ["education"],
    image: cargoImage("I2304156031003907129957893430533", "semtitulo_2109.jpg_7.jpeg"),
    description: [
      "A long-form photography process developed with young people in Bairro Quinta Grande in Lisbon.",
      "The project culminated in an exhibition shaped through collective image-making, neighborhood reflection, and discussion of belonging."
    ],
    links: [
      { label: "Project video", url: "https://youtu.be/vhMKGt1EqvY?si=f3UkkBLKGSVdAuUY" }
    ]
  },
  {
    id: "sagrada-familia",
    title: "Sagrada Familia",
    year: "2013-2015",
    tags: ["research", "portraiture", "community"],
    groups: ["education", "exhibition"],
    image: cargoImage("Q2304251784473725405940679073029", "IMG_2724.jpg_6.jpeg"),
    description: [
      "A portrait and community project rooted in the idea of home and who gets welcomed into personal space.",
      "Residents invited the artist into their homes, where family portraits were made, framed, and returned to the families."
    ],
    links: [
      { label: "Project video", url: "https://youtu.be/vhMKGt1EqvY?si=1nF1nbrBvy6TECxa" }
    ]
  }
];

const categoryLabels = {
  education: "Education",
  media: "Media",
  exhibition: "Exhibition",
  digital: "Digital"
};

const pageData = {
  teaching: {
    kicker: "Teaching",
    title: "Creative technologies as shared learning environments.",
    intro: "Workshops and lectures move between p5.js, moving image, sound, and collaborative making, always tied to context and collective experimentation.",
    main: [
      "The teaching format grows out of youth work, informal pedagogies, and art education: accessible entry points, practical experimentation, and space for reflection inside the making process.",
      "What matters is not software fluency on its own, but what people can think, test, and build together through tools."
    ],
    side: [
      {
        label: "Focus areas",
        items: [
          "Creative coding and p5.js",
          "Interactive media",
          "Video, sound, and documentation",
          "Youth-centered STEAM pedagogy"
        ]
      },
      {
        label: "Working method",
        text: "Hands-on, social, and reflective. Technical skill stays connected to conversation, collaboration, and actual situations."
      }
    ]
  },
  about: {
    kicker: "About",
    title: "Art, pedagogy, and technical production in the same circuit.",
    intro: "A practice moving across research, workshops, exhibitions, web production, and collaborative media projects.",
    main: [
      "Tiago Martins Pinto is a media arts lecturer, art-based researcher, and multimedia artist based in Helsinki.",
      "At Aalto University, his doctoral research in Art Education looks at STEAM education and informal pedagogies as tools for social justice and educational equity in youth centers. The same concerns continue through his artistic and technical practice."
    ],
    side: [
      {
        label: "Current roles",
        items: [
          "Researcher at Aalto University",
          "Workshop Master in Arts Infra",
          "Media maker and installation collaborator"
        ]
      },
      {
        label: "Background",
        text: "Specialized in video, web development, interactive media, and participatory practices. Based in Helsinki, originally from Porto."
      }
    ]
  },
  contact: {
    kicker: "Contact",
    title: "Open for workshops, commissions, exhibitions, documentation, and research conversations.",
    intro: "Use the direct address for invitations, collaborations, or projects that move between education, media, and art.",
    main: [
      "The practice is especially suited to collaborations that need both conceptual sensitivity and production fluency.",
      "Work can take the form of invited teaching, installation support, audiovisual documentation, prototypes, or research-led media work."
    ],
    side: [
      {
        label: "Best for",
        items: [
          "Workshops and course collaborations",
          "Exhibitions and audiovisual documentation",
          "Interactive prototypes and web pieces",
          "Research and speaking invitations"
        ]
      },
      {
        label: "Direct links",
        links: [
          { label: "hello@tiagomartinspinto.com", url: "mailto:hello@tiagomartinspinto.com" },
          { label: "Aalto research profile", url: "https://research.aalto.fi/en/persons/tiago-martins-pinto" },
          { label: "LinkedIn", url: "https://www.linkedin.com/in/ptiagomp/" },
          { label: "Codeberg", url: "https://codeberg.org/ptiagomp" }
        ]
      }
    ]
  }
};

const projectsById = new Map(projects.map((project) => [project.id, project]));
const featuredProjects = projects.slice(0, 6);

const elements = {
  particleField: document.querySelector("#particle-field"),
  navLinks: Array.from(document.querySelectorAll("[data-route-link]")),
  workDisclosure: document.querySelector("#nav-work-group"),
  infoDisclosure: document.querySelector("#nav-info-group"),
  contentShell: document.querySelector(".content-shell"),
  contentHeader: document.querySelector(".content-header"),
  viewKicker: document.querySelector("#view-kicker"),
  viewTitle: document.querySelector("#view-title"),
  viewIntro: document.querySelector("#view-intro"),
  contentBody: document.querySelector("#content-body")
};

const state = {
  lastListingHash: "#home"
};

const listingMeta = {
  home: {
    browserTitle: "Tiago Martins Pinto",
    kicker: "",
    title: "",
    intro: "",
    showMeta: false,
    minimal: true
  },
  all: {
    browserTitle: "All Work",
    kicker: "Archive",
    title: "All work",
    intro: ""
  }
};

const getProjectsForCategory = (category) =>
  projects.filter((project) => project.groups.includes(category));

const normalizeHash = (hash = "") => (hash.startsWith("#") ? hash : `#${hash}`);

const parseRoute = () => {
  const raw = window.location.hash.replace(/^#/, "") || "home";

  if (raw === "home" || raw === "all") {
    return { type: "listing", key: raw };
  }

  if (raw.startsWith("category/")) {
    const category = raw.split("/")[1];
    if (categoryLabels[category]) {
      return { type: "category", key: category };
    }
  }

  if (raw.startsWith("page/")) {
    const page = raw.split("/")[1];
    if (pageData[page]) {
      return { type: "page", key: page };
    }
  }

  if (raw.startsWith("project/")) {
    const projectId = raw.split("/")[1];
    if (projectsById.has(projectId)) {
      return { type: "project", key: projectId };
    }
  }

  return { type: "listing", key: "home" };
};

const updateHeader = ({ kicker = "", title = "", intro = "", browserTitle }) => {
  elements.viewKicker.textContent = kicker;
  elements.viewTitle.textContent = title;
  elements.viewIntro.textContent = intro;
  elements.viewKicker.hidden = !kicker;
  elements.viewTitle.hidden = !title;
  elements.viewIntro.hidden = !intro;
  elements.contentHeader.hidden = !kicker && !title && !intro;

  const pageTitle = browserTitle || title || "Tiago Martins Pinto";
  document.title = pageTitle === "Tiago Martins Pinto"
    ? pageTitle
    : `${pageTitle} / Tiago Martins Pinto`;
};

const renderListingCards = (items, options = {}) =>
  items
    .map(
      (project) => `
        <article class="listing-card${options.minimal ? " is-minimal" : ""}">
          <a class="listing-thumb" href="#project/${project.id}">
            <img src="${project.image}" alt="${project.title} preview">
          </a>
          <div class="listing-caption">
            <a class="listing-title" href="#project/${project.id}">${project.title}</a>
            ${
              options.showMeta === false
                ? ""
                : `<p class="listing-meta">${project.year}</p>`
            }
          </div>
        </article>
      `
    )
    .join("");

const renderListingView = (items, meta) => {
  updateHeader(meta);
  elements.contentBody.innerHTML = `
    <section class="listing-view${meta.minimal ? " is-minimal" : ""}">
      <div class="listing-grid${meta.minimal ? " is-minimal" : ""}">
        ${renderListingCards(items, { showMeta: meta.showMeta, minimal: meta.minimal })}
      </div>
    </section>
  `;
};

const renderPageSideBlock = (block) => {
  if (block.items) {
    return `
      <article class="info-card">
        <p class="info-label">${block.label}</p>
        <ul class="info-list">
          ${block.items.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </article>
    `;
  }

  if (block.links) {
    return `
      <article class="info-card">
        <p class="info-label">${block.label}</p>
        <div class="info-links">
          ${block.links
            .map(
              (link) =>
                `<a href="${link.url}" target="${link.url.startsWith("mailto:") ? "_self" : "_blank"}" rel="noreferrer">${link.label}</a>`
            )
            .join("")}
        </div>
      </article>
    `;
  }

  return `
    <article class="info-card">
      <p class="info-label">${block.label}</p>
      <p class="info-text">${block.text}</p>
    </article>
  `;
};

const renderPageView = (pageKey) => {
  const page = pageData[pageKey];

  updateHeader(page);
  elements.contentBody.innerHTML = `
    <section class="page-view">
      <div class="page-layout">
        <article class="page-main">
          ${page.main.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        </article>
        <aside class="page-side">
          ${page.side.map(renderPageSideBlock).join("")}
        </aside>
      </div>
    </section>
  `;
};

const getRelatedProjects = (project) => {
  const scored = projects
    .filter((candidate) => candidate.id !== project.id)
    .map((candidate) => ({
      candidate,
      sharedGroups: candidate.groups.filter((group) => project.groups.includes(group)).length
    }))
    .filter((entry) => entry.sharedGroups > 0)
    .sort((a, b) => b.sharedGroups - a.sharedGroups);

  return scored.slice(0, 4).map((entry) => entry.candidate);
};

const renderProjectView = (projectId) => {
  const project = projectsById.get(projectId);
  const backTarget = normalizeHash(state.lastListingHash || "#home");
  const relatedProjects = getRelatedProjects(project);

  updateHeader({
    kicker: "Project",
    title: project.title,
    intro: `${project.year} / ${project.tags.join(" / ")}`
  });

  elements.contentBody.innerHTML = `
    <article class="project-view">
      <a class="back-link" href="${backTarget}">Back to archive</a>

      <div class="project-layout">
        <div class="project-media">
          <img src="${project.image}" alt="${project.title} preview">
        </div>

        <div class="project-copy">
          <p class="project-groups">${project.groups.map((group) => categoryLabels[group]).join(" / ")}</p>
          ${project.description.map((paragraph) => `<p>${paragraph}</p>`).join("")}
          ${
            project.links.length
              ? `
                <div class="project-links">
                  ${project.links
                    .map(
                      (link) =>
                        `<a href="${link.url}" target="_blank" rel="noreferrer">${link.label}</a>`
                    )
                    .join("")}
                </div>
              `
              : ""
          }
        </div>
      </div>

      ${
        relatedProjects.length
          ? `
            <section class="related-view">
              <p class="info-label">Related work</p>
              <div class="listing-grid compact-grid">
                ${renderListingCards(relatedProjects)}
              </div>
            </section>
          `
          : ""
      }
    </article>
  `;
};

const getActiveNavKey = (route) => {
  if (route.type === "listing") {
    return route.key;
  }

  if (route.type === "category") {
    return `category/${route.key}`;
  }

  if (route.type === "page") {
    return `page/${route.key}`;
  }

  return normalizeHash(state.lastListingHash).replace(/^#/, "");
};

const syncDisclosureState = (route) => {
  const workOpen = route.type === "category"
    || (route.type === "listing" && route.key === "all")
    || route.type === "project";
  const infoOpen = route.type === "page";

  elements.workDisclosure.open = workOpen;
  elements.infoDisclosure.open = infoOpen;
};

const updateNavState = (route) => {
  const activeKey = getActiveNavKey(route);

  elements.navLinks.forEach((link) => {
    const isActive = link.dataset.routeLink === activeKey;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const renderRoute = () => {
  const route = parseRoute();

  if (route.type === "listing") {
    state.lastListingHash = normalizeHash(route.key);
    renderListingView(route.key === "home" ? featuredProjects : projects, listingMeta[route.key]);
  } else if (route.type === "category") {
    state.lastListingHash = normalizeHash(`category/${route.key}`);
    renderListingView(getProjectsForCategory(route.key), {
      browserTitle: categoryLabels[route.key],
      kicker: "Category",
      title: categoryLabels[route.key],
      intro: ""
    });
  } else if (route.type === "page") {
    renderPageView(route.key);
  } else if (route.type === "project") {
    renderProjectView(route.key);
  }

  elements.contentShell.dataset.view = route.type === "listing" && route.key === "home" ? "home" : route.type;
  document.body.dataset.view = elements.contentShell.dataset.view;
  syncDisclosureState(route);
  updateNavState(route);
  window.scrollTo(0, 0);
};

const PARTICLE_COLORS = [
  { fill: [255, 92, 92], line: [255, 142, 142] },
  { fill: [92, 244, 148], line: [144, 255, 186] },
  { fill: [102, 164, 255], line: [154, 194, 255] }
];

const startParticles = () => {
  if (!elements.particleField || !window.p5) {
    return;
  }

  new window.p5((sketch) => {
    const maxDistance = 138;
    const maxDistanceSq = maxDistance * maxDistance;
    const influenceRadius = 220;
    const influenceRadiusSq = influenceRadius * influenceRadius;
    let particles = [];
    const pointer = {
      active: false,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      lastMoveAt: 0
    };

    const particleCount = () =>
      Math.max(58, Math.min(124, Math.round((window.innerWidth * window.innerHeight) / 18000)));

    const createParticle = () => ({
      x: sketch.random(sketch.width),
      y: sketch.random(sketch.height),
      vx: sketch.random(-0.18, 0.18),
      vy: sketch.random(-0.18, 0.18),
      driftX: sketch.random(-0.16, 0.16),
      driftY: sketch.random(-0.16, 0.16),
      size: sketch.random(1.1, 2.7),
      family: Math.floor(sketch.random(PARTICLE_COLORS.length))
    });

    const syncPointer = (x, y) => {
      pointer.active = true;
      pointer.targetX = x;
      pointer.targetY = y;
      pointer.lastMoveAt = performance.now();
    };

    const syncParticleCount = () => {
      const target = particleCount();

      while (particles.length < target) {
        particles.push(createParticle());
      }

      if (particles.length > target) {
        particles = particles.slice(0, target);
      }
    };

    sketch.setup = () => {
      sketch.pixelDensity(1);
      const canvas = sketch.createCanvas(window.innerWidth, window.innerHeight);
      canvas.parent(elements.particleField);
      syncParticleCount();

      window.addEventListener("pointermove", (event) => {
        syncPointer(event.clientX, event.clientY);
      }, { passive: true });
    };

    sketch.windowResized = () => {
      sketch.resizeCanvas(window.innerWidth, window.innerHeight);
      syncParticleCount();
    };

    sketch.draw = () => {
      sketch.clear();
      sketch.noStroke();

      pointer.x += (pointer.targetX - pointer.x) * 0.065;
      pointer.y += (pointer.targetY - pointer.y) * 0.065;

      if (pointer.active && performance.now() - pointer.lastMoveAt > 1400) {
        pointer.active = false;
      }

      particles.forEach((particle) => {
        particle.vx += (particle.driftX - particle.vx) * 0.012;
        particle.vy += (particle.driftY - particle.vy) * 0.012;

        if (pointer.active) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distanceSq = (dx * dx) + (dy * dy);

          if (distanceSq > 1 && distanceSq < influenceRadiusSq) {
            const distance = Math.sqrt(distanceSq);
            const influence = (1 - (distance / influenceRadius)) * 0.018;
            particle.vx += (dx / distance) * influence;
            particle.vy += (dy / distance) * influence;
          }
        }

        particle.vx = sketch.constrain(particle.vx, -0.26, 0.26);
        particle.vy = sketch.constrain(particle.vy, -0.26, 0.26);
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x <= 0 || particle.x >= sketch.width) {
          particle.vx *= -1;
        }
        if (particle.y <= 0 || particle.y >= sketch.height) {
          particle.vy *= -1;
        }

        const fillColor = PARTICLE_COLORS[particle.family].fill;
        sketch.fill(fillColor[0], fillColor[1], fillColor[2], 78);
        sketch.circle(particle.x, particle.y, particle.size);
      });

      for (let index = 0; index < particles.length; index += 1) {
        for (let compareIndex = index + 1; compareIndex < particles.length; compareIndex += 1) {
          const a = particles[index];
          const b = particles[compareIndex];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distanceSq = (dx * dx) + (dy * dy);

          if (distanceSq >= maxDistanceSq) {
            continue;
          }

          const distance = Math.sqrt(distanceSq);
          const alpha = sketch.map(distance, 0, maxDistance, a.family === b.family ? 42 : 24, 0);
          const strokeColor = a.family === b.family
            ? PARTICLE_COLORS[a.family].line
            : [
                (PARTICLE_COLORS[a.family].fill[0] + PARTICLE_COLORS[b.family].fill[0]) / 2,
                (PARTICLE_COLORS[a.family].fill[1] + PARTICLE_COLORS[b.family].fill[1]) / 2,
                (PARTICLE_COLORS[a.family].fill[2] + PARTICLE_COLORS[b.family].fill[2]) / 2
              ];
          sketch.stroke(strokeColor[0], strokeColor[1], strokeColor[2], alpha);
          sketch.line(a.x, a.y, b.x, b.y);
        }
      }
    };
  }, elements.particleField);
};

window.addEventListener("hashchange", renderRoute);
window.addEventListener("load", startParticles);

renderRoute();
