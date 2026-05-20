const APPROVED_CATEGORIES = [
  "learning",
  "community",
  "research",
  "exhibitions",
  "web",
  "moving image"
];

const DISPLAY_FILTERS = ["all", ...APPROVED_CATEGORIES];

const PROJECT_KEYS = new Set([
  "slug",
  "title",
  "year",
  "projectType",
  "role",
  "categories",
  "tags",
  "shortDescription",
  "fullDescription",
  "links",
  "images",
  "media",
  "thumbnailPosition",
  "thumbnailZoom"
]);

const LINK_KEYS = new Set(["label", "url"]);
const IMAGE_KEYS = new Set(["src", "alt", "width", "height"]);
const MEDIA_KEYS = new Set(["type", "src", "source", "provider", "alt", "caption", "thumbnail", "width", "height"]);
const MEDIA_TYPES = new Set(["image", "video", "audio"]);
const VIDEO_PROVIDERS = new Set(["youtube", "vimeo", "file", "url"]);
const AUDIO_PROVIDERS = new Set(["file", "soundcloud", "url"]);

const isPlainObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const trimString = (value) => (typeof value === "string" ? value.trim() : "");

const ensureArrayOfStrings = (value, fieldName, errors) => {
  if (!Array.isArray(value)) {
    errors.push(`${fieldName} must be an array.`);
    return [];
  }

  return value
    .map((item, index) => {
      if (typeof item !== "string") {
        errors.push(`${fieldName}[${index}] must be a string.`);
        return "";
      }

      return item.trim();
    })
    .filter(Boolean);
};

const validateMediaItem = (item, fieldName, errors) => {
  if (!isPlainObject(item)) {
    errors.push(`${fieldName} must be an object.`);
    return null;
  }

  const unexpectedMediaKeys = Object.keys(item).filter((key) => !MEDIA_KEYS.has(key));
  if (unexpectedMediaKeys.length) {
    errors.push(`${fieldName} has unexpected fields: ${unexpectedMediaKeys.join(", ")}.`);
  }

  const type = trimString(item.type || "image").toLowerCase();
  const source = trimString(item.source || item.src);
  const provider = trimString(item.provider).toLowerCase();
  const alt = trimString(item.alt);
  const caption = trimString(item.caption);
  const thumbnail = trimString(item.thumbnail);
  const width = item.width === undefined || item.width === "" ? null : Number(item.width);
  const height = item.height === undefined || item.height === "" ? null : Number(item.height);

  if (!MEDIA_TYPES.has(type)) {
    errors.push(`${fieldName}.type must be image, video, or audio.`);
  }

  if (!source) {
    errors.push(`${fieldName} requires a source.`);
  }

  if (type === "image") {
    if (!alt) {
      errors.push(`${fieldName}.alt is required for image media.`);
    }
    if (!Number.isFinite(width) || width <= 0) {
      errors.push(`${fieldName}.width must be a positive number for image media.`);
    }
    if (!Number.isFinite(height) || height <= 0) {
      errors.push(`${fieldName}.height must be a positive number for image media.`);
    }

    return compactObjectForData({
      type: "image",
      src: source,
      alt,
      width,
      height,
      caption
    });
  }

  if (type === "video" && provider && !VIDEO_PROVIDERS.has(provider)) {
    errors.push(`${fieldName}.provider must be youtube, vimeo, file, or url.`);
  }

  if (type === "audio" && provider && !AUDIO_PROVIDERS.has(provider)) {
    errors.push(`${fieldName}.provider must be file, soundcloud, or url.`);
  }

  return compactObjectForData({
    type,
    provider: provider || (type === "video" ? "url" : "url"),
    source,
    caption,
    thumbnail
  });
};

const compactObjectForData = (object) =>
  Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== "" && value !== undefined && value !== null)
  );

const toObjectLiteral = (value) =>
  JSON.stringify(value, null, 2).replace(/"([A-Za-z_$][A-Za-z0-9_$]*)":/g, "$1:");

const parseProjectsModule = (source) => {
  const executable = source.replace(/export\s+const\s+/g, "const ");
  return Function(`${executable}; return { PROJECT_DISPLAY_FILTERS, PROJECTS };`)();
};

const serializeProjectsModule = (projects) =>
  `export const PROJECT_DISPLAY_FILTERS = ${toObjectLiteral(DISPLAY_FILTERS)};\n\nexport const PROJECTS = ${toObjectLiteral(projects)};\n`;

const validateProjects = (projects) => {
  const errors = [];

  if (!Array.isArray(projects)) {
    return { valid: false, errors: ["projects must be an array."], projects: [] };
  }

  const seenSlugs = new Set();

  const sanitizedProjects = projects
    .map((project, index) => {
      if (!isPlainObject(project)) {
        errors.push(`projects[${index}] must be an object.`);
        return null;
      }

      const unexpectedProjectKeys = Object.keys(project).filter((key) => !PROJECT_KEYS.has(key));
      if (unexpectedProjectKeys.length) {
        errors.push(`projects[${index}] has unexpected fields: ${unexpectedProjectKeys.join(", ")}.`);
      }

      const slug = trimString(project.slug);
      const title = trimString(project.title);
      const year = trimString(project.year);
      const projectType = trimString(project.projectType);
      const role = trimString(project.role);
      const shortDescription = trimString(project.shortDescription);
      const thumbnailPosition = trimString(project.thumbnailPosition);
      const thumbnailZoom =
        project.thumbnailZoom === undefined || project.thumbnailZoom === ""
          ? null
          : Number(project.thumbnailZoom);

      if (!slug) {
        errors.push(`projects[${index}].slug is required.`);
      } else if (!/^[a-z0-9-]+$/.test(slug)) {
        errors.push(`projects[${index}].slug must use lowercase letters, numbers, and hyphens only.`);
      } else if (seenSlugs.has(slug)) {
        errors.push(`projects[${index}].slug must be unique.`);
      } else {
        seenSlugs.add(slug);
      }

      if (!title) {
        errors.push(`projects[${index}].title is required.`);
      }
      if (!year) {
        errors.push(`projects[${index}].year is required.`);
      }
      if (!projectType) {
        errors.push(`projects[${index}].projectType is required.`);
      }
      if (!role) {
        errors.push(`projects[${index}].role is required.`);
      }
      if (!shortDescription) {
        errors.push(`projects[${index}].shortDescription is required.`);
      }
      if (thumbnailZoom !== null && (!Number.isFinite(thumbnailZoom) || thumbnailZoom < 1 || thumbnailZoom > 3)) {
        errors.push(`projects[${index}].thumbnailZoom must be a number from 1 to 3.`);
      }

      const categories = ensureArrayOfStrings(project.categories, `projects[${index}].categories`, errors);
      categories.forEach((category) => {
        if (!APPROVED_CATEGORIES.includes(category)) {
          errors.push(`projects[${index}].categories contains invalid value: ${category}.`);
        }
      });

      const tags = ensureArrayOfStrings(project.tags, `projects[${index}].tags`, errors);
      const fullDescription = ensureArrayOfStrings(
        project.fullDescription,
        `projects[${index}].fullDescription`,
        errors
      );

      if (!fullDescription.length) {
        errors.push(`projects[${index}].fullDescription must contain at least one paragraph.`);
      }

      const links = Array.isArray(project.links)
        ? project.links
            .map((link, linkIndex) => {
              if (!isPlainObject(link)) {
                errors.push(`projects[${index}].links[${linkIndex}] must be an object.`);
                return null;
              }

              const unexpectedLinkKeys = Object.keys(link).filter((key) => !LINK_KEYS.has(key));
              if (unexpectedLinkKeys.length) {
                errors.push(
                  `projects[${index}].links[${linkIndex}] has unexpected fields: ${unexpectedLinkKeys.join(", ")}.`
                );
              }

              const label = trimString(link.label);
              const url = trimString(link.url);

              if (!label || !url) {
                errors.push(`projects[${index}].links[${linkIndex}] requires both label and url.`);
              }

              return { label, url };
            })
            .filter(Boolean)
        : [];

      if (!Array.isArray(project.links)) {
        errors.push(`projects[${index}].links must be an array.`);
      }

      const rawMedia = Array.isArray(project.media)
        ? project.media
        : Array.isArray(project.images)
          ? project.images.map((image) => ({ type: "image", ...image }))
          : [];

      if (!Array.isArray(project.media) && !Array.isArray(project.images)) {
        errors.push(`projects[${index}].media must be an array.`);
      }

      const media = rawMedia
        .map((item, mediaIndex) => validateMediaItem(item, `projects[${index}].media[${mediaIndex}]`, errors))
        .filter(Boolean);

      if (!media.length) {
        errors.push(`projects[${index}].media must contain at least one media item.`);
      }

      const sanitized = {
        slug,
        title,
        year,
        projectType,
        role,
        categories,
        tags,
        shortDescription,
        fullDescription,
        links,
        media
      };

      if (thumbnailPosition) {
        sanitized.thumbnailPosition = thumbnailPosition;
      }
      if (thumbnailZoom !== null && thumbnailZoom > 1) {
        sanitized.thumbnailZoom = thumbnailZoom;
      }

      return sanitized;
    })
    .filter(Boolean);

  return {
    valid: errors.length === 0,
    errors,
    projects: sanitizedProjects
  };
};

module.exports = {
  APPROVED_CATEGORIES,
  DISPLAY_FILTERS,
  parseProjectsModule,
  serializeProjectsModule,
  validateProjects
};
