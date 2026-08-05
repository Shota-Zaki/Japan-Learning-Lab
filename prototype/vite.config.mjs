import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const configDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const pagesBuild = mode === "pages";
  return {
    base: pagesBuild ? "/Japan-Learning-Lab/" : "/",
    build: {
      outDir: pagesBuild ? path.resolve(configDirectory, "..", "docs") : path.resolve(configDirectory, "dist", "client"),
      emptyOutDir: true,
    },
    optimizeDeps: {
      include: ["react", "react-dom/client"],
    },
    server: {
      host: "0.0.0.0",
      allowedHosts: ["terminal.local"],
      warmup: {
        clientFiles: ["./src/main.jsx"],
      },
    },
    plugins: [react()],
  };
});
