import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import wasm from "vite-plugin-wasm"
import topLevelAwait from "vite-plugin-top-level-await"
import { execSync } from "node:child_process"
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
    "import.meta.env.SENTRY_DSN": process.env.SENTRY_DSN || null,
    "import.meta.env.DEBUG": process.env.NODE_ENV !== "production",
    "import.meta.env.VERSION": packageJson.version,
    "import.meta.env.COMMIT_HASH": COMMIT_HASH,
  },
})
