import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"

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
  plugins: [react()],
  define: {
    "import.meta.env.COMMIT_HASH": JSON.stringify(process.env.COMMIT_HASH),
    "import.meta.env.SENTRY_DSN": JSON.stringify(process.env.SENTRY_DSN),
    "import.meta.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    "import.meta.env.VERSION": JSON.stringify(process.env.VERSION),
  },
})
