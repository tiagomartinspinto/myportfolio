const SITE_KEYS = new Set([
  "title",
  "description",
  "ogTitle",
  "ogDescription",
  "socialImage",
  "socialImageAlt",
  "canonicalUrl",
  "header",
  "footer"
]);

const HEADER_KEYS = new Set(["name", "mark", "contactLabel", "contactEmail"]);
const FOOTER_KEYS = new Set(["socialLinks", "aboutTitle", "aboutLines", "location", "roleLinks"]);
const LINK_KEYS = new Set(["label", "url"]);

const trimString = (value) => (typeof value === "string" ? value.trim() : "");
const isPlainObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);

const compactObjectForData = (object) =>
  Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== "" && value !== undefined && value !== null)
  );

const toObjectLiteral = (value) =>
  JSON.stringify(value, null, 2).replace(/"([A-Za-z_$][A-Za-z0-9_$]*)":/g, "$1:");

const parseSiteModule = (source) => {
  const executable = source.replace(/export\s+const\s+/g, "const ");
  return Function(`${executable}; return { SITE };`)();
};

const serializeSiteModule = (site) => `export const SITE = ${toObjectLiteral(site)};\n`;

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:";
  } catch {
    return false;
  }
};

const sanitizeLinks = (links, fieldName, errors) => {
  if (!Array.isArray(links)) {
    errors.push(`${fieldName} must be an array.`);
    return [];
  }

  return links
    .map((link, index) => {
      if (!isPlainObject(link)) {
        errors.push(`${fieldName}[${index}] must be an object.`);
        return null;
      }

      const unexpectedKeys = Object.keys(link).filter((key) => !LINK_KEYS.has(key));
      if (unexpectedKeys.length) {
        errors.push(`${fieldName}[${index}] has unexpected fields: ${unexpectedKeys.join(", ")}.`);
      }

      const label = trimString(link.label);
      const url = trimString(link.url);

      if (!label || !url) {
        errors.push(`${fieldName}[${index}] requires both label and url.`);
      } else if (!isValidUrl(url)) {
        errors.push(`${fieldName}[${index}].url must be a valid URL.`);
      }

      return compactObjectForData({ label, url });
    })
    .filter(Boolean);
};

const validateSite = (site) => {
  const errors = [];

  if (!isPlainObject(site)) {
    return { valid: false, errors: ["SITE must be an object."], site: null };
  }

  const unexpectedSiteKeys = Object.keys(site).filter((key) => !SITE_KEYS.has(key));
  if (unexpectedSiteKeys.length) {
    errors.push(`SITE has unexpected fields: ${unexpectedSiteKeys.join(", ")}.`);
  }

  const header = isPlainObject(site.header) ? site.header : {};
  const footer = isPlainObject(site.footer) ? site.footer : {};

  if (!isPlainObject(site.header)) {
    errors.push("SITE.header must be an object.");
  }
  if (!isPlainObject(site.footer)) {
    errors.push("SITE.footer must be an object.");
  }

  const unexpectedHeaderKeys = Object.keys(header).filter((key) => !HEADER_KEYS.has(key));
  if (unexpectedHeaderKeys.length) {
    errors.push(`SITE.header has unexpected fields: ${unexpectedHeaderKeys.join(", ")}.`);
  }

  const unexpectedFooterKeys = Object.keys(footer).filter((key) => !FOOTER_KEYS.has(key));
  if (unexpectedFooterKeys.length) {
    errors.push(`SITE.footer has unexpected fields: ${unexpectedFooterKeys.join(", ")}.`);
  }

  const title = trimString(site.title);
  const description = trimString(site.description);
  const ogTitle = trimString(site.ogTitle);
  const ogDescription = trimString(site.ogDescription);
  const socialImage = trimString(site.socialImage);
  const socialImageAlt = trimString(site.socialImageAlt);
  const canonicalUrl = trimString(site.canonicalUrl);
  const name = trimString(header.name);
  const mark = trimString(header.mark);
  const contactLabel = trimString(header.contactLabel);
  const contactEmail = trimString(header.contactEmail);
  const aboutTitle = trimString(footer.aboutTitle);
  const location = trimString(footer.location);

  if (!title) {
    errors.push("SITE.title is required.");
  }
  if (!description) {
    errors.push("SITE.description is required.");
  }
  if (!ogTitle) {
    errors.push("SITE.ogTitle is required.");
  }
  if (!ogDescription) {
    errors.push("SITE.ogDescription is required.");
  }
  if (!socialImage) {
    errors.push("SITE.socialImage is required.");
  }
  if (!socialImageAlt) {
    errors.push("SITE.socialImageAlt is required.");
  }
  if (!canonicalUrl || !isValidUrl(canonicalUrl)) {
    errors.push("SITE.canonicalUrl must be a valid URL.");
  }
  if (!name) {
    errors.push("SITE.header.name is required.");
  }
  if (!mark) {
    errors.push("SITE.header.mark is required.");
  }
  if (!contactLabel) {
    errors.push("SITE.header.contactLabel is required.");
  }
  if (!contactEmail || !isValidEmail(contactEmail)) {
    errors.push("SITE.header.contactEmail must be a valid email address.");
  }
  if (!aboutTitle) {
    errors.push("SITE.footer.aboutTitle is required.");
  }
  if (!location) {
    errors.push("SITE.footer.location is required.");
  }

  const aboutLines = Array.isArray(footer.aboutLines)
    ? footer.aboutLines.map(trimString).filter(Boolean)
    : [];

  if (!Array.isArray(footer.aboutLines)) {
    errors.push("SITE.footer.aboutLines must be an array.");
  }
  if (!aboutLines.length) {
    errors.push("SITE.footer.aboutLines must contain at least one line.");
  }

  const sanitized = {
    title,
    description,
    ogTitle,
    ogDescription,
    socialImage,
    socialImageAlt,
    canonicalUrl,
    header: {
      name,
      mark,
      contactLabel,
      contactEmail
    },
    footer: {
      socialLinks: sanitizeLinks(footer.socialLinks, "SITE.footer.socialLinks", errors),
      aboutTitle,
      aboutLines,
      location,
      roleLinks: sanitizeLinks(footer.roleLinks, "SITE.footer.roleLinks", errors)
    }
  };

  return {
    valid: errors.length === 0,
    errors,
    site: sanitized
  };
};

module.exports = {
  isValidEmail,
  isValidUrl,
  parseSiteModule,
  serializeSiteModule,
  validateSite
};
