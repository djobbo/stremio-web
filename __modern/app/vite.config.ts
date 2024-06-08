import { execSync } from "node:child_process"

import react from "@vitejs/plugin-react-swc"
import path from "path"
import { defineConfig } from "vite"
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
  plugins: [react(), wasm(), topLevelAwait()],
  define: {
    "import.meta.env.SENTRY_DSN": process.env.SENTRY_DSN
      ? JSON.stringify(process.env.SENTRY_DSN)
      : null,
    "import.meta.env.DEBUG": process.env.NODE_ENV !== "production",
    "import.meta.env.VERSION": JSON.stringify(packageJson.version),
    "import.meta.env.COMMIT_HASH": JSON.stringify(COMMIT_HASH),
  },
  // assetsInclude: ["../**/*.wasm"],
  optimizeDeps: {
    exclude: ["@stremio/stremio-core-web"],
  },
  // build: {
  //   outDir: "public",
  //   sourcemap: process.env.NODE_ENV === "production" || "inline",
  //   rollupOptions: {
  //     input: {
  //       // main: path.resolve(__dirname, "src/index.js"),
  //       // worker: path.resolve(
  //       //   __dirname,
  //       //   "node_modules/@stremio/stremio-core-web/worker.js",
  //       // ),
  //     },
  //     output: {
  //       dir: path.resolve(__dirname, "build"),
  //       entryFileNames: `${COMMIT_HASH}/scripts/[name].js`,
  //     },
  //   },
  // },
})
