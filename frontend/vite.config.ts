import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separate vendor libraries into their own chunks
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router")
            ) {
              return "react-vendor";
            }
            if (id.includes("@tanstack/react-query")) {
              return "query-vendor";
            }
            if (id.includes("react-hook-form") || id.includes("@hookform")) {
              return "form-vendor";
            }
            if (id.includes("zustand")) {
              return "ui-vendor";
            }
            if (id.includes("zod")) {
              return "form-vendor"; // Group with react-hook-form since they're used together
            }
            // Other node_modules go into a separate vendor chunk
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit since we're code-splitting
  },
});
