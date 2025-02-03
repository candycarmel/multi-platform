// @ts-nocheck

import { viteSingleFile } from "vite-plugin-singlefile";
import { defineConfig } from "vite";
import geckos from '@geckos.io/server'

export default defineConfig(async () => ({
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  plugins: [viteSingleFile()],
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 8000,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  publicDir: "./public",
  build: {
    minify: "terser",
    chunkSizeWarningLimit: 10000,
    sourcemap: "hidden", // makes it so code is obstructed on release
  },
}));
