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
  "thumbnailPosition",
  "thumbnailZoom"
]);

const LINK_KEYS = new Set(["label", "url"]);
const IMAGE_KEYS = new Set(["src", "alt", "width", "height"]);

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

      const images = Array.isArray(project.images)
        ? project.images
            .map((image, imageIndex) => {
              if (!isPlainObject(image)) {
                errors.push(`projects[${index}].images[${imageIndex}] must be an object.`);
                return null;
              }

              const unexpectedImageKeys = Object.keys(image).filter((key) => !IMAGE_KEYS.has(key));
              if (unexpectedImageKeys.length) {
                errors.push(
                  `projects[${index}].images[${imageIndex}] has unexpected fields: ${unexpectedImageKeys.join(", ")}.`
                );
              }

              const src = trimString(image.src);
              const alt = trimString(image.alt);
              const width = Number(image.width);
              const height = Number(image.height);

              if (!src || !alt) {
                errors.push(`projects[${index}].images[${imageIndex}] requires both src and alt.`);
              }
              if (!Number.isFinite(width) || width <= 0) {
                errors.push(`projects[${index}].images[${imageIndex}].width must be a positive number.`);
              }
              if (!Number.isFinite(height) || height <= 0) {
                errors.push(`projects[${index}].images[${imageIndex}].height must be a positive number.`);
              }

              return { src, alt, width, height };
            })
            .filter(Boolean)
        : [];

      if (!Array.isArray(project.images)) {
        errors.push(`projects[${index}].images must be an array.`);
      } else if (!images.length) {
        errors.push(`projects[${index}].images must contain at least one image.`);
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
        images
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
