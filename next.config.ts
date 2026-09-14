import type { NextConfig } from "next";

/**
 * GitHub Pages serves the site under /{repo-name}.
 * Local `next dev` / `next build` without STATIC_EXPORT keep basePath empty.
 */
const isStaticExport =
  process.env.STATIC_EXPORT === "true" ||
  process.env.GITHUB_PAGES === "true";

const basePath = isStaticExport
  ? (process.env.NEXT_PUBLIC_BASE_PATH || "/straphanger-NYC.io").replace(/\/$/, "") ||
    ""
  : "";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        images: {
          remotePatterns: [
            {
              protocol: "https",
              hostname: "**.supabase.co",
            },
            {
              protocol: "https",
              hostname: "images.unsplash.com",
            },
          ],
        },
      }),
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
