const fs = require("node:fs");
const path = require("node:path");
const { parseProjectsModule, validateProjects, APPROVED_CATEGORIES } = require("./project-data");
const { parseSiteModule, validateSite } = require("./site-data");

const repoRoot = path.resolve(__dirname, "..", "..");
const projectsPath = path.join(repoRoot, "data", "projects.js");
const sitePath = path.join(repoRoot, "data", "site.js");
const assetsProjectsRoot = path.join(repoRoot, "assets", "projects");

const VIDEO_PROVIDERS = new Set(["youtube", "vimeo", "file", "url"]);
const AUDIO_PROVIDERS = new Set(["file", "soundcloud", "url"]);
const MEDIA_TYPES = new Set(["image", "video", "audio"]);

const errors = [];
const warnings = [];

const addError = (message) => {
  errors.push(message);
};

const addWarning = (message) => {
  warnings.push(message);
};

const isPlainObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const trimString = (value) => (typeof value === "string" ? value.trim() : "");

const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:";
  } catch {
    return false;
  }
};

const isRemoteUrl = (value) => /^https?:\/\//i.test(value);
const isMailto = (value) => /^mailto:/i.test(value);

const resolveLocalProjectAsset = (value) => {
  const normalized = trimString(value).replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalized || isRemoteUrl(normalized) || isMailto(normalized)) {
    return null;
  }

  if (!normalized.startsWith("assets/projects/")) {
    return null;
  }

  const absolute = path.resolve(repoRoot, normalized);
  return absolute.startsWith(assetsProjectsRoot + path.sep) ? { normalized, absolute } : null;
};

const assertLocalAsset = (value, label, { required = true, allowMissing = false } = {}) => {
  const source = trimString(value);

  if (!source) {
    if (required) {
      addError(`${label} is required.`);
    }
    return;
  }

  const resolved = resolveLocalProjectAsset(source);
  if (!resolved) {
    addError(`${label} must stay inside assets/projects/.`);
    return;
  }

  if (!allowMissing && !fs.existsSync(resolved.absolute)) {
    addError(`${label} is missing: ${resolved.normalized}`);
  }
};

const assertExternalOrMailto = (value, label) => {
  const url = trimString(value);
  if (!url) {
    addError(`${label} is required.`);
    return;
  }

  if (!isValidUrl(url)) {
    addError(`${label} must be a valid URL or mailto link.`);
  }
};

const projectMedia = (project) => {
  if (Array.isArray(project.media)) {
    return project.media;
  }

  if (Array.isArray(project.images)) {
    return project.images.map((image) => ({ type: "image", ...image }));
  }

  return [];
};

const mediaSource = (item) => trimString(item.source || item.src);

const validateLinks = (links, label) => {
  if (!Array.isArray(links)) {
    addError(`${label} must be an array.`);
    return;
  }

  links.forEach((link, index) => {
    if (!isPlainObject(link)) {
      addError(`${label}[${index}] must be an object.`);
      return;
    }

    if (!trimString(link.label)) {
      addError(`${label}[${index}].label is required.`);
    }
    assertExternalOrMailto(link.url, `${label}[${index}].url`);
  });
};

const validateProjectMedia = (project, projectIndex) => {
  const draft = project.draft === true;
  const media = projectMedia(project);

  if (!media.length && !draft) {
    addError(`PROJECTS[${projectIndex}] ${project.slug || project.title || "untitled"} requires at least one media item.`);
    return;
  }

  media.forEach((item, mediaIndex) => {
    const label = `PROJECTS[${projectIndex}].media[${mediaIndex}]`;
    if (!isPlainObject(item)) {
      addError(`${label} must be an object.`);
      return;
    }

    const type = trimString(item.type || "image").toLowerCase();
    const source = mediaSource(item);
    const provider = trimString(item.provider).toLowerCase();
    const thumbnail = trimString(item.thumbnail);
    const context = `${label} (${project.slug || "untitled"})`;

    if (!MEDIA_TYPES.has(type)) {
      addError(`${context}.type must be image, video, or audio.`);
      return;
    }

    if (type === "image") {
      assertLocalAsset(source, `${context}.src`, { required: !draft, allowMissing: draft });
      if (!draft && !trimString(item.alt)) {
        addError(`${context}.alt is required.`);
      }
      if (!draft && (!Number.isFinite(Number(item.width)) || Number(item.width) <= 0)) {
        addError(`${context}.width must be a positive number.`);
      }
      if (!draft && (!Number.isFinite(Number(item.height)) || Number(item.height) <= 0)) {
        addError(`${context}.height must be a positive number.`);
      }
      return;
    }

    if (type === "video" && !VIDEO_PROVIDERS.has(provider)) {
      addError(`${context}.provider must be youtube, vimeo, file, or url.`);
    }
    if (type === "audio" && !AUDIO_PROVIDERS.has(provider)) {
      addError(`${context}.provider must be file, soundcloud, or url.`);
    }

    if (provider === "file") {
      assertLocalAsset(source, `${context}.source`, { required: !draft, allowMissing: draft });
    } else if (source && !isValidUrl(source)) {
      addError(`${context}.source must be a valid URL for provider ${provider || "url"}.`);
    } else if (!source && !draft) {
      addError(`${context}.source is required.`);
    }

    if (thumbnail) {
      if (isRemoteUrl(thumbnail)) {
        if (!isValidUrl(thumbnail)) {
          addError(`${context}.thumbnail must be a valid URL.`);
        }
      } else {
        assertLocalAsset(thumbnail, `${context}.thumbnail`, { required: true, allowMissing: draft });
      }
    } else if (!draft && type === "video" && provider === "youtube") {
      addWarning(`${context}.thumbnail is empty; the public site will use a YouTube thumbnail derived from the video ID.`);
    } else if (!draft && (type === "video" || type === "audio")) {
      addWarning(`${context}.thumbnail is empty; the public site will show a neutral ${type} placeholder.`);
    }
  });
};

const validateProjectRecords = (projects) => {
  if (!Array.isArray(projects)) {
    addError("PROJECTS must be an array.");
    return;
  }

  if (!projects.length) {
    addError("PROJECTS must not be empty.");
  }

  projects.forEach((project, index) => {
    if (!isPlainObject(project)) {
      addError(`PROJECTS[${index}] must be an object.`);
      return;
    }

    ["slug", "title", "year", "projectType", "role", "categories", "tags", "shortDescription", "fullDescription", "links"].forEach(
      (field) => {
        if (!(field in project)) {
          addError(`PROJECTS[${index}].${field} is required.`);
        }
      }
    );

    if (!("media" in project) && !("images" in project)) {
      addError(`PROJECTS[${index}] requires media or images.`);
    }

    if (Array.isArray(project.categories)) {
      project.categories.forEach((category) => {
        if (!APPROVED_CATEGORIES.includes(category)) {
          addError(`PROJECTS[${index}].categories contains an invalid filter: ${category}.`);
        }
      });
    }

    validateLinks(project.links, `PROJECTS[${index}].links`);
    validateProjectMedia(project, index);
  });
};

const validateSiteAssets = (site) => {
  if (!site) {
    return;
  }

  const socialImage = trimString(site.socialImage);
  if (socialImage) {
    if (isRemoteUrl(socialImage)) {
      if (!isValidUrl(socialImage)) {
        addError("SITE.socialImage must be a valid URL.");
      }
    } else {
      assertLocalAsset(socialImage, "SITE.socialImage");
    }
  }

  validateLinks(site.footer?.socialLinks || [], "SITE.footer.socialLinks");
  validateLinks(site.footer?.roleLinks || [], "SITE.footer.roleLinks");
};

const main = () => {
  let projects;

  try {
    const parsed = parseProjectsModule(fs.readFileSync(projectsPath, "utf8"));
    projects = parsed.PROJECTS;
    const validation = validateProjects(projects);
    if (!validation.valid) {
      validation.errors.forEach(addError);
    }
    validateProjectRecords(projects);
  } catch (error) {
    addError(`Could not parse data/projects.js: ${error.message}`);
  }

  let site = null;
  if (fs.existsSync(sitePath)) {
    try {
      const parsed = parseSiteModule(fs.readFileSync(sitePath, "utf8"));
      site = parsed.SITE;
      const validation = validateSite(site);
      if (!validation.valid) {
        validation.errors.forEach(addError);
      }
      validateSiteAssets(site);
    } catch (error) {
      addError(`Could not parse data/site.js: ${error.message}`);
    }
  }

  if (errors.length) {
    console.error("Portfolio check failed:\n");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  if (warnings.length) {
    console.warn("Portfolio check warnings:\n");
    warnings.forEach((warning) => console.warn(`- ${warning}`));
    console.warn("");
  }

  const draftCount = Array.isArray(projects) ? projects.filter((project) => project.draft === true).length : 0;
  const projectCount = Array.isArray(projects) ? projects.length : 0;
  console.log(
    `Portfolio check passed: ${projectCount} projects, ${projectCount - draftCount} published, ${draftCount} draft.`
  );
};

main();
