import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

const REPO_NAME = "/"; 

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? REPO_NAME : "/",
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  optimizeDeps: {
    exclude: ["@coderline/alphatab"],
  },
  build: {
    rollupOptions: {
      output: {
        // manualChunks removed to avoid conflict with server build externals
      },
    },
    sourcemap: false,
  },
  css: {
    devSourcemap: false,
  },
});
