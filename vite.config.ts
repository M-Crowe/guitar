import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";


const REPO_NAME = "/guitar/"; 

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? REPO_NAME : "/",
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  optimizeDeps: {
    exclude: ["@coderline/alphatab"],
  },
});
