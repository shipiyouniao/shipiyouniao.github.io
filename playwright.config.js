import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  use: {
    baseURL: "http://127.0.0.1:4188",
    browserName: "chromium",
    channel: process.platform === "win32" ? "chrome" : undefined,
  },
  webServer: {
    command: "npm run preview -- --port 4188 --strictPort",
    url: "http://127.0.0.1:4188",
    reuseExistingServer: false,
  },
});
