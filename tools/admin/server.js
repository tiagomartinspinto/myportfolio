const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const { promisify } = require("node:util");
const { execFile } = require("node:child_process");
const { runCheck } = require("./check");
const { parseProjectsModule, serializeProjectsModule, validateProjects } = require("./project-data");
const { parseSiteModule, serializeSiteModule, validateSite } = require("./site-data");
const { detectImageSize, listProjectImages, normalizeAssetPath, resolveProjectAssetPath } = require("./image-utils");

const execFileAsync = promisify(execFile);

const mode = process.argv[2] === "preview" ? "preview" : "admin";
const host = "127.0.0.1";
const port = Number(process.env.PORT || (mode === "preview" ? 8080 : 8787));

const repoRoot = path.resolve(__dirname, "..", "..");
const adminRoot = path.join(repoRoot, "tools", "admin");
const dataPath = path.join(repoRoot, "data", "projects.js");
const backupPath = path.join(repoRoot, "data", "projects.backup.js");
const sitePath = path.join(repoRoot, "data", "site.js");
const siteBackupPath = path.join(repoRoot, "data", "site.backup.js");
const assetsRoot = path.join(repoRoot, "assets");
const publishPaths = [
  "data/projects.js",
  "data/site.js",
  "PROJECT_STATUS.md",
  "assets/projects/",
  "README.md",
  "tools/admin/README.md"
];

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".m4a": "audio/mp4",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".ogg": "audio/ogg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".wav": "audio/wav",
  ".webm": "video/webm",
  ".webp": "image/webp"
};

const send = (response, statusCode, body, headers = {}) => {
  response.writeHead(statusCode, headers);
  response.end(body);
};

const sendJson = (response, statusCode, payload) =>
  send(response, statusCode, JSON.stringify(payload, null, 2), {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });

const safeJoin = (root, requestPath) => {
  const absolute = path.resolve(root, `.${requestPath}`);
  return absolute.startsWith(root) ? absolute : null;
};

const readJsonBody = async (request) => {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (!chunks.length) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
};

const readProjects = async () => {
  const source = await fs.readFile(dataPath, "utf8");
  const parsed = parseProjectsModule(source);

  return {
    filters: parsed.PROJECT_DISPLAY_FILTERS || [],
    projects: parsed.PROJECTS || []
  };
};

const readSite = async () => {
  const source = await fs.readFile(sitePath, "utf8");
  const parsed = parseSiteModule(source);
  return parsed.SITE || {};
};

const backupExists = async () => {
  const exists = await Promise.all(
    [backupPath, siteBackupPath].map(async (filePath) => {
      try {
        await fs.access(filePath);
        return true;
      } catch {
        return false;
      }
    })
  );
  return exists.some(Boolean);
};

const getScopedGitStatus = async () => {
  try {
    const { stdout } = await execFileAsync("git", ["status", "--short", "--", ...publishPaths], {
      cwd: repoRoot
    });
    return stdout.trim().split("\n").filter(Boolean);
  } catch (error) {
    const fallback = `${error.stdout || ""}\n${error.stderr || error.message}`.trim();
    return fallback ? [fallback] : [];
  }
};

const runPortfolioCheck = () => {
  const result = runCheck();
  return {
    ok: result.ok,
    output: ["$ npm run check", result.output].filter(Boolean).join("\n\n")
  };
};

const runGit = async (args) => {
  try {
    const { stdout, stderr } = await execFileAsync("git", args, { cwd: repoRoot });
    return {
      ok: true,
      output: [`$ git ${args.join(" ")}`, stdout.trim(), stderr.trim()].filter(Boolean).join("\n")
    };
  } catch (error) {
    return {
      ok: false,
      code: error.code,
      output: [`$ git ${args.join(" ")}`, (error.stdout || "").trim(), (error.stderr || error.message || "").trim()]
        .filter(Boolean)
        .join("\n")
    };
  }
};

const requireEmptyPortfolioConfirmation = (projects, confirmation, phrase) =>
  projects.length > 0 || confirmation === phrase;

const handleProjects = async (response) => {
  const payload = await readProjects();
  const site = await readSite();
  const gitStatus = await getScopedGitStatus();

  sendJson(response, 200, {
    filters: payload.filters,
    projects: payload.projects,
    site,
    gitStatus,
    previewUrl: "http://127.0.0.1:8080/",
    backupExists: await backupExists()
  });
};

const handleImageLibrary = async (response) => {
  const library = await listProjectImages(repoRoot);
  sendJson(response, 200, library);
};

const handleImageDimensions = async (request, response) => {
  const body = await readJsonBody(request);
  const src = normalizeAssetPath(body.src);
  const absolutePath = resolveProjectAssetPath(repoRoot, src);

  if (!absolutePath) {
    sendJson(response, 400, {
      ok: false,
      message: "Image path must stay inside assets/projects/."
    });
    return;
  }

  try {
    const dimensions = await detectImageSize(absolutePath);
    sendJson(response, 200, {
      ok: true,
      src,
      width: dimensions.width,
      height: dimensions.height
    });
  } catch (error) {
    sendJson(response, 404, {
      ok: false,
      message: error.message || "Image file not found."
    });
  }
};

const handleSave = async (request, response) => {
  const body = await readJsonBody(request);
  const validation = validateProjects(body.projects);
  const siteValidation = validateSite(body.site);

  if (!validation.valid || !siteValidation.valid) {
    sendJson(response, 400, {
      ok: false,
      errors: [...validation.errors, ...siteValidation.errors]
    });
    return;
  }

  if (!requireEmptyPortfolioConfirmation(validation.projects, body.emptyPortfolioConfirmation, "DELETE ALL PROJECTS")) {
    sendJson(response, 400, {
      ok: false,
      message: "Saving an empty portfolio requires the exact confirmation text: DELETE ALL PROJECTS."
    });
    return;
  }

  await fs.copyFile(dataPath, backupPath);
  try {
    await fs.copyFile(sitePath, siteBackupPath);
  } catch {
    await fs.writeFile(siteBackupPath, serializeSiteModule(siteValidation.site), "utf8");
  }
  await fs.writeFile(dataPath, serializeProjectsModule(validation.projects), "utf8");
  await fs.writeFile(sitePath, serializeSiteModule(siteValidation.site), "utf8");

  sendJson(response, 200, {
    ok: true,
    message: "Saved locally to data/projects.js and data/site.js, with backups refreshed.",
    gitStatus: await getScopedGitStatus(),
    backupExists: true
  });
};

const handleRestoreBackup = async (request, response) => {
  const body = await readJsonBody(request);
  const modeLabel = body.mode === "undo" ? "Undo last save" : "Restore backup";

  if (!(await backupExists())) {
    sendJson(response, 404, {
      ok: false,
      message: "No backup file exists yet."
    });
    return;
  }

  try {
    await fs.copyFile(backupPath, dataPath);
  } catch {}

  try {
    await fs.copyFile(siteBackupPath, sitePath);
  } catch {}

  sendJson(response, 200, {
    ok: true,
    message: `${modeLabel} completed. Project and site data were restored from available backups.`,
    gitStatus: await getScopedGitStatus(),
    backupExists: true
  });
};

const handleCheck = async (response) => {
  const check = await runPortfolioCheck();
  sendJson(response, check.ok ? 200 : 400, {
    ok: check.ok,
    message: check.ok ? "Portfolio check passed." : "Portfolio check failed. Nothing was committed or pushed.",
    output: check.output
  });
};

const handlePublish = async (request, response) => {
  const body = await readJsonBody(request);
  const { projects } = await readProjects();

  if (!requireEmptyPortfolioConfirmation(projects, body.emptyPortfolioConfirmation, "PUBLISH EMPTY PORTFOLIO")) {
    sendJson(response, 400, {
      ok: false,
      message: "Publishing an empty portfolio requires the exact confirmation text: PUBLISH EMPTY PORTFOLIO."
    });
    return;
  }

  const steps = [];

  const check = await runPortfolioCheck();
  steps.push(check.output);
  if (!check.ok) {
    sendJson(response, 400, {
      ok: false,
      message: "Portfolio check failed. Nothing was committed or pushed.",
      output: steps.join("\n\n")
    });
    return;
  }

  const add = await runGit(["add", ...publishPaths]);
  steps.push(add.output);
  if (!add.ok) {
    sendJson(response, 500, { ok: false, message: "git add failed.", output: steps.join("\n\n") });
    return;
  }

  const stagedCheck = await runGit(["diff", "--cached", "--name-only", "--", ...publishPaths]);
  steps.push(stagedCheck.output);
  if (!stagedCheck.ok) {
    sendJson(response, 500, { ok: false, message: "Could not inspect staged changes.", output: steps.join("\n\n") });
    return;
  }

  if (!stagedCheck.output.split("\n").some((line) => line.trim() && !line.startsWith("$ git"))) {
    sendJson(response, 409, {
      ok: false,
      message: "Nothing to publish for the approved portfolio files.",
      output: steps.join("\n\n")
    });
    return;
  }

  const commit = await runGit(["commit", "-m", "Update portfolio"]);
  steps.push(commit.output);
  if (!commit.ok) {
    sendJson(response, 500, { ok: false, message: "git commit failed.", output: steps.join("\n\n") });
    return;
  }

  const push = await runGit(["push"]);
  steps.push(push.output);
  if (!push.ok) {
    sendJson(response, 500, { ok: false, message: "git push failed.", output: steps.join("\n\n") });
    return;
  }

  sendJson(response, 200, {
    ok: true,
    message: "Published approved portfolio files.",
    output: steps.join("\n\n"),
    gitStatus: await getScopedGitStatus()
  });
};

const serveFile = async (response, filePath) => {
  try {
    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      send(response, 404, "Not found");
      return;
    }

    const contents = await fs.readFile(filePath);
    send(response, 200, contents, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
  } catch {
    send(response, 404, "Not found");
  }
};

const handleAdminRequest = async (request, response, url) => {
  if (request.method === "GET" && url.pathname === "/api/projects") {
    await handleProjects(response);
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/images") {
    await handleImageLibrary(response);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/image-dimensions") {
    await handleImageDimensions(request, response);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/save") {
    await handleSave(request, response);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/restore-backup") {
    await handleRestoreBackup(request, response);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/check") {
    await handleCheck(response);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/publish") {
    await handlePublish(request, response);
    return;
  }

  if (request.method === "GET" && url.pathname === "/data/projects.js") {
    await serveFile(response, dataPath);
    return;
  }

  if (request.method === "GET" && url.pathname === "/data/site.js") {
    await serveFile(response, sitePath);
    return;
  }

  if (request.method === "GET" && url.pathname.startsWith("/assets/")) {
    const assetFilePath = safeJoin(repoRoot, url.pathname);
    if (!assetFilePath || !assetFilePath.startsWith(assetsRoot)) {
      send(response, 403, "Forbidden");
      return;
    }

    await serveFile(response, assetFilePath);
    return;
  }

  const requestPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = safeJoin(adminRoot, requestPath);

  if (!filePath) {
    send(response, 403, "Forbidden");
    return;
  }

  await serveFile(response, filePath);
};

const resolvePreviewPath = (requestPath) => {
  if (requestPath.startsWith("/tools/")) {
    return null;
  }

  if (requestPath === "/") {
    return path.join(repoRoot, "index.html");
  }

  return safeJoin(repoRoot, requestPath);
};

const handlePreviewRequest = async (response, url) => {
  const filePath = resolvePreviewPath(url.pathname);
  if (!filePath) {
    send(response, 404, "Not found");
    return;
  }

  try {
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      const directoryIndex = path.join(filePath, "index.html");
      await serveFile(response, directoryIndex);
      return;
    }

    await serveFile(response, filePath);
  } catch {
    send(response, 404, "Not found");
  }
};

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  try {
    if (mode === "admin") {
      await handleAdminRequest(request, response, url);
    } else {
      await handlePreviewRequest(response, url);
    }
  } catch (error) {
    sendJson(response, 500, {
      ok: false,
      message: error.message || "Server error."
    });
  }
});

server.listen(port, host, () => {
  const label = mode === "admin" ? "Local portfolio admin" : "Portfolio preview";
  console.log(`${label} running at http://${host}:${port}/`);
});
