import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      stremio: path.resolve(__dirname, "./src"),
      "stremio-router": path.resolve(__dirname, "./src/router"),
    },
  },
  plugins: [react()],
})
