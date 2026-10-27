import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import preload from "vite-plugin-preload";
import svgr from "vite-plugin-svgr";
import webfontDownload from "vite-plugin-webfont-dl";
import tsconfigPaths from "vite-tsconfig-paths";

const GOOGLE_FONTS_CSS =
  "https://fonts.googleapis.com/css2?family=Alumni+Sans:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap";

const DEV_SERVER_PORT = 3000;
const CHUNK_SIZE_WARNING_LIMIT_KB = 1000;
const COMPRESSION_THRESHOLD_BYTES = 10240;
const COMPRESSION_LEVEL = 11;
const IMAGE_QUALITY = 40;

/**
 * Dev-сервер часто открывают через прокси (песочницы, туннели, превью),
 * а Vite по умолчанию отклоняет неизвестные Host-заголовки.
 * Пример: VITE_ALLOWED_HOSTS=".e2b.app,localhost"
 */
const allowedHosts = process.env.VITE_ALLOWED_HOSTS?.split(",") ?? [];

/**
 * Шрифты подтягиваются с Google Fonts на каждой сборке. Для офлайн-сборки
 * (CI без доступа в сеть) — VITE_SKIP_WEBFONTS=1.
 */
const skipWebfonts = process.env.VITE_SKIP_WEBFONTS === "1";

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
    ...(skipWebfonts ? [] : [webfontDownload([GOOGLE_FONTS_CSS])]),
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".brotli",
      threshold: COMPRESSION_THRESHOLD_BYTES,
      compressionOptions: { level: COMPRESSION_LEVEL },
    }),
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: COMPRESSION_THRESHOLD_BYTES,
      compressionOptions: { level: COMPRESSION_LEVEL },
    }),
    ViteImageOptimizer({
      png: {
        quality: IMAGE_QUALITY,
      },
      jpeg: {
        quality: IMAGE_QUALITY,
      },
      jpg: {
        quality: IMAGE_QUALITY,
      },
      tiff: {
        quality: IMAGE_QUALITY,
      },
      webp: {
        quality: IMAGE_QUALITY,
      },
    }),
    tsconfigPaths(),
  ],

  build: {
    outDir: "build",
    assetsDir: "assets",
    minify: "esbuild",
    cssCodeSplit: true,
    chunkSizeWarningLimit: CHUNK_SIZE_WARNING_LIMIT_KB,
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [
            {
              name: "react",
              test: /node_modules\/(react|react-dom|scheduler)\//,
            },
          ],
        },
      },
    },
  },

  base: "./",
  server: {
    port: DEV_SERVER_PORT,
    allowedHosts,
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
  },
});
