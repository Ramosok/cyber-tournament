import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import webfontDownload from "vite-plugin-webfont-dl";
import preload from "vite-plugin-preload";

export default defineConfig({
  plugins: [
    preload({
      includeJs: true,
      includeCss: true,
    }),
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    svgr({
      svgrOptions: {
        icon: true,
        dimensions: false,
      },
    }),
    webfontDownload([
      "https://fonts.googleapis.com/css2?family=Alumni+Sans:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap",
    ]),
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".brotli",
      threshold: 10240,
      compressionOptions: { level: 11 },
    }),
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 10240,
      compressionOptions: { level: 11 },
    }),
    ViteImageOptimizer({
      png: {
        quality: 40,
      },
      jpeg: {
        quality: 40,
      },
      jpg: {
        quality: 40,
      },
      tiff: {
        quality: 40,
      },
      webp: {
        quality: 40,
      },
    }),
    tsconfigPaths(),
  ],

  build: {
    outDir: "build",
    assetsDir: "assets",
    minify: "esbuild",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
  },

  base: "./",
  server: {
    port: 3000,
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
  },
});
