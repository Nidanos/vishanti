import { defineConfig, devices } from "@playwright/test";

// End-to-end tests of the learner journey against the LOCAL API and database (docker compose up first).
// Both servers get their own ports and are never reused, so a running `next dev`, or .env.local's
// API_URL (the deployed API), can't leak in.
const WEB = "http://localhost:3100";
const API_PORT = "3101";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: false,
  workers: 1, // one learner walks through the screens in order
  timeout: 120_000,
  expect: { timeout: 15_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: WEB, trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "pnpm --filter @ai-tutor/api exec tsx src/server.ts",
      url: `http://localhost:${API_PORT}/health`,
      env: { PORT: API_PORT, DEV_WEB_ORIGIN: WEB },
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: "pnpm build && pnpm start -p 3100",
      url: WEB,
      env: { API_URL: `http://localhost:${API_PORT}` },
      reuseExistingServer: false,
      timeout: 240_000,
    },
  ],
});
