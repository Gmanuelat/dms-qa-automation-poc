import { defineConfig } from "@playwright/test";
import { loadEnv } from "./utils/env";

loadEnv();

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },

  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: process.env.BASE_URL || "",
    headless: true,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },

  projects: [{ name: "chromium", use: { browserName: "chromium" } }]
});
