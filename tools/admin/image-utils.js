const fs = require("node:fs/promises");
const path = require("node:path");

const IMAGE_EXTENSIONS = new Set([".gif", ".jpeg", ".jpg", ".png", ".webp"]);

const toPosixPath = (value) => value.split(path.sep).join("/");

const isImageFile = (filename) => IMAGE_EXTENSIONS.has(path.extname(filename).toLowerCase());

const normalizeAssetPath = (src) => String(src || "").trim().replace(/\\/g, "/").replace(/^\/+/, "");

const getAssetsProjectsRoot = (repoRoot) => path.join(repoRoot, "assets", "projects");

const resolveProjectAssetPath = (repoRoot, src) => {
  const normalized = normalizeAssetPath(src);
  if (!normalized.startsWith("assets/projects/")) {
    return null;
  }

  const projectsRoot = getAssetsProjectsRoot(repoRoot);
  const absolute = path.resolve(repoRoot, normalized);
  const relative = path.relative(projectsRoot, absolute);

  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }

  return absolute;
};

const detectJpegSize = (buffer) => {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    throw new Error("Unsupported JPEG file.");
  }

  let offset = 2;
  const sofMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);

  while (offset < buffer.length) {
    while (buffer[offset] === 0xff) {
      offset += 1;
    }

    const marker = buffer[offset];
    offset += 1;

    if (marker === 0xd8 || marker === 0xd9) {
      continue;
    }

    if (offset + 1 >= buffer.length) {
      break;
    }

    const length = buffer.readUInt16BE(offset);
    if (length < 2) {
      break;
    }

    if (sofMarkers.has(marker)) {
      return {
        width: buffer.readUInt16BE(offset + 5),
        height: buffer.readUInt16BE(offset + 3)
      };
    }

    offset += length;
  }

  throw new Error("JPEG dimensions could not be detected.");
};

const detectWebpSize = (buffer) => {
  if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") {
    throw new Error("Unsupported WebP file.");
  }

  const chunkType = buffer.toString("ascii", 12, 16);

  if (chunkType === "VP8X") {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3)
    };
  }

  if (chunkType === "VP8L") {
    const bits = buffer.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1
    };
  }

  throw new Error("WebP dimensions could not be detected.");
};

const detectImageSize = async (filePath) => {
  const buffer = await fs.readFile(filePath);

  if (
    buffer.length >= 24 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20)
    };
  }

  if (buffer.toString("ascii", 0, 3) === "GIF") {
    return {
      width: buffer.readUInt16LE(6),
      height: buffer.readUInt16LE(8)
    };
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    return detectJpegSize(buffer);
  }

  if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    return detectWebpSize(buffer);
  }

  throw new Error("Unsupported image format.");
};

const listProjectImages = async (repoRoot) => {
  const projectsRoot = getAssetsProjectsRoot(repoRoot);
  const folderEntries = await fs.readdir(projectsRoot, { withFileTypes: true });
  const folders = [];
  const flatFiles = [];

  for (const folderEntry of folderEntries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!folderEntry.isDirectory() || folderEntry.name.startsWith(".")) {
      continue;
    }

    const folderPath = path.join(projectsRoot, folderEntry.name);
    const fileEntries = await fs.readdir(folderPath, { withFileTypes: true });
    const files = [];

    for (const fileEntry of fileEntries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (!fileEntry.isFile() || fileEntry.name.startsWith(".") || !isImageFile(fileEntry.name)) {
        continue;
      }

      const absolutePath = path.join(folderPath, fileEntry.name);
      const relativePath = toPosixPath(path.relative(repoRoot, absolutePath));
      let dimensions = null;

      try {
        dimensions = await detectImageSize(absolutePath);
      } catch {
        dimensions = null;
      }

      const file = {
        folder: folderEntry.name,
        name: fileEntry.name,
        src: relativePath,
        width: dimensions?.width ?? null,
        height: dimensions?.height ?? null
      };

      files.push(file);
      flatFiles.push(file);
    }

    folders.push({
      name: folderEntry.name,
      files
    });
  }

  return { folders, flatFiles };
};

module.exports = {
  detectImageSize,
  listProjectImages,
  normalizeAssetPath,
  resolveProjectAssetPath
};
