import { mkdir, rename, rm } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiDir = path.join(root, "src", "app", "api");
const apiStashDir = path.join(root, ".pages-build-stash", "api");

const defaultBasePath = "/straphanger-NYC.io";
const defaultSiteUrl = "https://astridbonoan.github.io/straphanger-NYC.io";

const env = {
  ...process.env,
  STATIC_EXPORT: "true",
  GITHUB_PAGES: "true",
  NEXT_PUBLIC_DEMO_MODE: "true",
  DEMO_MODE: "true",
  NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || defaultBasePath,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl,
};

async function stashApiRoutes() {
  try {
    await rm(apiStashDir, { recursive: true, force: true });
    await mkdir(path.dirname(apiStashDir), { recursive: true });
    await rename(apiDir, apiStashDir);
    return true;
  } catch {
    return false;
  }
}

async function restoreApiRoutes(didStash) {
  if (!didStash) return;
  try {
    await rm(apiDir, { recursive: true, force: true });
    await rename(apiStashDir, apiDir);
  } catch (error) {
    console.error("Failed to restore src/app/api after Pages build:", error);
  }
}

const didStash = await stashApiRoutes();

const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const child = spawn(process.execPath, [nextBin, "build"], {
  cwd: root,
  env,
  stdio: "inherit",
});

child.on("exit", async (code) => {
  await restoreApiRoutes(didStash);
  process.exit(code ?? 1);
});
