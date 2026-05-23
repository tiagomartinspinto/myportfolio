#!/usr/bin/env node

const { spawn } = require("node:child_process");
const http = require("node:http");
const https = require("node:https");
const path = require("node:path");

const ADMIN_URL = "http://127.0.0.1:8787/";
const PREVIEW_URL = "http://127.0.0.1:8080/";
const WAIT_TIMEOUT_MS = 25_000;
const WAIT_RETRY_MS = 400;
const OPEN_PREVIEW = true;

const repoRoot = path.resolve(__dirname, "..");
const nodeCommand = process.execPath;
const children = new Set();

let shuttingDown = false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const log = (message = "") => {
  process.stdout.write(`${message}\n`);
};

const logError = (message = "") => {
  process.stderr.write(`${message}\n`);
};

const prefixOutput = (stream, label, writer) => {
  let buffer = "";

  stream.setEncoding("utf8");
  stream.on("data", (chunk) => {
    buffer += chunk;
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || "";

    lines.forEach((line) => {
      writer(`[${label}] ${line}`);
    });
  });

  stream.on("end", () => {
    if (buffer) {
      writer(`[${label}] ${buffer}`);
      buffer = "";
    }
  });
};

const startServer = async (mode, label, url) => {
  if (await requestUrl(url)) {
    log(`[${label}] already running, reusing it.`);
    return null;
  }

  log(`Starting ${label} server...`);

  const child = spawn(nodeCommand, ["tools/admin/server.js", mode], {
    cwd: repoRoot,
    detached: process.platform !== "win32",
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: false
  });

  children.add(child);
  prefixOutput(child.stdout, label, log);
  prefixOutput(child.stderr, label, logError);

  child.on("error", (error) => {
    logError(`${label} failed to start: ${error.message}`);
    shutdown(1);
  });

  child.on("exit", (code, signal) => {
    children.delete(child);

    if (shuttingDown) {
      return;
    }

    const reason = signal ? `signal ${signal}` : `exit code ${code}`;
    logError(`${label} server stopped unexpectedly (${reason}).`);
    shutdown(1);
  });

  return child;
};

const requestWithHttp = (url) =>
  new Promise((resolve) => {
    const parsed = new URL(url);
    const client = parsed.protocol === "https:" ? https : http;
    const request = client.request(
      parsed,
      {
        method: "GET",
        timeout: 3_000
      },
      (response) => {
        response.resume();
        resolve(response.statusCode >= 200 && response.statusCode < 500);
      }
    );

    request.on("error", () => resolve(false));
    request.on("timeout", () => {
      request.destroy();
      resolve(false);
    });
    request.end();
  });

const requestUrl = async (url) => {
  if (typeof fetch === "function") {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3_000);

    try {
      const response = await fetch(url, {
        cache: "no-store",
        signal: controller.signal
      });
      return response.status >= 200 && response.status < 500;
    } catch {
      return false;
    } finally {
      clearTimeout(timeout);
    }
  }

  return requestWithHttp(url);
};

const waitForUrl = async (url, timeoutMs = WAIT_TIMEOUT_MS) => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await requestUrl(url)) {
      return;
    }

    await sleep(WAIT_RETRY_MS);
  }

  throw new Error(
    [
      `Could not reach ${url}`,
      "Check the logs above.",
      "If the port is already in use, close old server terminals and try again."
    ].join("\n")
  );
};

const openUrl = (url) => {
  let command = "xdg-open";
  let args = [url];

  if (process.platform === "win32") {
    command = "cmd";
    args = ["/c", "start", "", url];
  } else if (process.platform === "darwin") {
    command = "open";
  }

  const opener = spawn(command, args, {
    detached: true,
    stdio: "ignore",
    windowsHide: true
  });

  opener.on("error", (error) => {
    logError(`Could not open ${url}: ${error.message}`);
  });

  opener.unref();
};

const stopChild = (child) => {
  if (!child.pid) {
    return;
  }

  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], {
      stdio: "ignore",
      windowsHide: true
    });
    return;
  }

  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    try {
      child.kill("SIGTERM");
    } catch {
      // The child is already gone.
    }
  }
};

function shutdown(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  log("");
  log("Stopping local portfolio servers...");
  children.forEach(stopChild);

  setTimeout(() => {
    process.exit(exitCode);
  }, 500);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
process.on("uncaughtException", (error) => {
  logError(error.stack || error.message);
  shutdown(1);
});
process.on("unhandledRejection", (error) => {
  logError(error?.stack || String(error));
  shutdown(1);
});

(async () => {
  log("Launching Tiago Martins Pinto portfolio editor");
  log(`Repository: ${repoRoot}`);
  log("");

  await startServer("admin", "admin", ADMIN_URL);
  await startServer("preview", "preview", PREVIEW_URL);

  log("");
  log("Waiting for local servers...");

  await Promise.all([waitForUrl(ADMIN_URL), waitForUrl(PREVIEW_URL)]);

  log("Ready.");
  log(`Admin:   ${ADMIN_URL}`);
  log(`Preview: ${PREVIEW_URL}`);
  log("");
  log("Opening browser...");

  openUrl(ADMIN_URL);

  if (OPEN_PREVIEW) {
    openUrl(PREVIEW_URL);
  }

  log("Press Ctrl+C in this terminal to stop both local servers.");
})().catch((error) => {
  logError(error.message);
  shutdown(1);
});
