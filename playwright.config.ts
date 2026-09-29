import {defineConfig, devices} from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? {executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}
      : undefined
  },
  webServer: {command: "npm run dev", url: "http://localhost:3000", reuseExistingServer: !process.env.CI},
  projects: [
    {name: "desktop-chromium", use: {...devices["Desktop Chrome"]}},
    {name: "mobile-chromium", use: {...devices["Pixel 7"]}}
  ]
});
