import { execSync } from "node:child_process"

import react from "@vitejs/plugin-react-swc"
import path from "path"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import topLevelAwait from "vite-plugin-top-level-await"
import wasm from "vite-plugin-wasm"

import packageJson from "./package.json"

const COMMIT_HASH = execSync("git rev-parse HEAD").toString().trim()

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        rewriteUrls: "all",
        javascriptEnabled: true,
      },
    },
    modules: {
      generateScopedName: "[local]-[hash:8]",
    },
  },
  resolve: {
    alias: [
      {
        find: /^~?stremio((?=\/.+)|$)/,
        replacement: path.resolve(__dirname, "./src"),
      },
      {
        find: /^~?stremio-router/,
        replacement: path.resolve(__dirname, "./src/router"),
      },
      {
        find: /^~/,
        replacement: "",
      },
    ],
  },
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicons/favicon.ico",
        "images/icon.png",
        "images/maskable_icon.svg",
      ],
      manifest: {
        name: "Stremio Web",
        short_name: "Stremio",
        description: "Freedom To Stream",
        background_color: "#161523",
        theme_color: "#2a2843",
        orientation: "any",
        display: "standalone",
        display_override: ["standalone"],
        icons: [
          {
            src: "/images/icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/images/icon.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/images/maskable_icon.png",
            sizes: "512x512",
            purpose: "maskable",
          },
          {
            src: "/images/maskable_icon.png",
            sizes: "192x192",
            purpose: "maskable",
          },
          {
            src: "/favicons/favicon.ico",
            sizes: "256x256",
          },
        ],
        screenshots: [
          {
            src: `/screenshots/board_wide.webp`,
            sizes: "1440x900",
            type: "image/webp",
            form_factor: "wide",
            label: "Homescreen of Stremio",
          },
          {
            src: `/screenshots/board_narrow.webp`,
            sizes: "414x896",
            type: "image/webp",
            form_factor: "narrow",
            label: "Homescreen of Stremio",
          },
        ],
      },
    }),
  ],
  define: {
    "import.meta.env.SENTRY_DSN": process.env.SENTRY_DSN
      ? JSON.stringify(process.env.SENTRY_DSN)
      : null,
    "import.meta.env.DEBUG": process.env.NODE_ENV !== "production",
    "import.meta.env.VERSION": JSON.stringify(packageJson.version),
    "import.meta.env.COMMIT_HASH": JSON.stringify(COMMIT_HASH),
    global: "globalThis",
  },
  optimizeDeps: {
    exclude: ["@stremio/stremio-core-web"],
  },
})
