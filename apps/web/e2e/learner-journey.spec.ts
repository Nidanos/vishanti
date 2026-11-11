import { expect, test, type Page } from "@playwright/test";
import { randomUUID } from "node:crypto";

// One new adult learner walks through every learner screen in order: sign-up, the placement test,
// dashboard, lessons, practice (in the real sandbox), session, progress, account, then deletes the account.
const learner = { name: "E2E Learner", email: `e2e-${Date.now()}@test.dev`, password: `${randomUUID()}Aa1!` };

// The first C++ placement question (seed: cpp-diagnostic-reading.ts, "Your first program"): its comments are the trap.
const FIRST_QUESTION = { marker: 'std::cout << "Ready";', answer: "ReadyGo!\nA\nB\nDone" };

test.describe.configure({ mode: "serial" });
let page: Page;
test.beforeAll(async ({ browser }) => { page = await browser.newPage(); });
test.afterAll(async () => { await page.close(); });

const noHorizontalScroll = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

test("signs up, and a first login goes to the placement test", async () => {
  await page.goto("/register");
  await page.getByLabel("Full name").fill(learner.name);
  await page.getByLabel("Email address").fill(learner.email);
  await page.getByLabel("Create password", { exact: true }).fill(learner.password);
  await page.getByLabel("Confirm password", { exact: true }).fill(learner.password);
  await page.getByLabel("Date of birth").fill("1995-05-05");
  await page.getByRole("checkbox").first().check();
  await page.getByRole("button", { name: /Optional data preferences/ }).click();
  await page.getByText("Allow my data to be used for AI training and research").click();
  await page.getByRole("button", { name: /Create Account/ }).click();
  await page.waitForURL(/\/login/);

  await page.getByLabel("Email address").fill(learner.email);
  await page.getByLabel("Password", { exact: true }).fill(learner.password);
  await page.getByLabel("Password", { exact: true }).press("Enter");
  await page.waitForURL("**/diagnostic");
});

test("placement test: a right answer starts that skill at level 2", async () => {
  await page.getByRole("button", { name: /Start Assessment/ }).click();
  await page.getByRole("radio", { name: /C\+\+ Basics/ }).click();
  await page.getByRole("button", { name: /Continue to assessment/ }).click();
  await expect(page.getByText(FIRST_QUESTION.marker)).toBeVisible();
  await page.getByPlaceholder("Enter the expected output...").fill(FIRST_QUESTION.answer);
  await page.getByRole("button", { name: /Submit answer/ }).click();

  // Everything after the first question is skipped, so the test is short and ends where it can.
  const skip = page.getByRole("button", { name: /I don't know/ });
  const complete = page.getByRole("button", { name: "Complete Assessment" });
  while (!(await complete.isVisible())) {
    await expect(skip.or(complete).first()).toBeEnabled();
    if (await skip.isVisible()) await skip.click();
  }
  await complete.click();

  const firstSkill = page.locator("div").filter({ has: page.getByRole("heading", { name: "Your first program", exact: true }) }).last();
  await expect(firstSkill.getByText("Starts at level 2")).toBeVisible({ timeout: 90_000 });
  await expect(page.getByRole("button", { name: "Retake the placement test (2 left)" })).toBeVisible();
  await page.getByRole("button", { name: /Go to Dashboard/ }).click();
  await page.waitForURL("**/dashboard");
});

test("dashboard shows the placed course, the next step and progress", async () => {
  await expect(page.getByRole("heading", { name: `Good to see you, ${learner.name} 👋` })).toBeVisible();
  await expect(page.getByText("Continue your C++ Basics journey", { exact: false })).toBeVisible();
  await expect(page.getByText("YOUR NEXT STEP")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your Progress" })).toBeVisible();
  await expect(page.getByRole("link", { name: "C++ Basics Learning" })).toBeVisible();
});

test("search opens a lesson, with its diagram and quick check", async () => {
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("searchbox", { name: "Search skills and topics" })).toBeFocused();
  await page.keyboard.type("loop");
  await page.getByRole("button", { name: "Loops", exact: true }).click();
  await page.waitForURL(/\/learn\?skill=Loops/);
  await expect(page.getByRole("heading", { name: "Loops", level: 1 })).toBeVisible();
  await expect(page.locator("svg[id^=diagram]")).toBeVisible({ timeout: 30_000 });

  await page.getByLabel("Your predicted output").fill("a guess");
  await page.getByRole("button", { name: "Check my answer" }).click();
  await expect(page.getByText("Expected output", { exact: true })).toBeVisible();
});

test("practice: a code exercise runs in the sandbox, and a hint comes back", async () => {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Start practice" }).click();
  await page.waitForURL(/\/practice\/[\w-]+/);
  await expect(page.getByText(/Level [2-5] of 5/)).toBeVisible(); // level 2 or above: the placement skipped Predict

  await page.getByRole("button", { name: "Get a hint" }).click();
  await expect(page.getByText(/^Hint 1/)).toBeVisible({ timeout: 30_000 });

  // The starter code doesn't solve the task, so any verdict means the sandbox ran it.
  await page.getByRole("button", { name: "Submit answer" }).click();
  await expect(page.getByText(/Tests passed: \d+ \/ \d+/)).toBeVisible({ timeout: 90_000 });
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
});

test("study session: start, pause, resume and end", async () => {
  await page.goto("/session");
  await page.getByRole("button", { name: "Start studying" }).click();
  await page.waitForURL(/\/practice\/[\w-]+/);
  await page.goto("/session");
  await page.getByRole("button", { name: "Pause" }).click();
  await page.getByRole("button", { name: "Resume session" }).click();
  await page.waitForURL(/\/practice\/[\w-]+/);
  await page.goto("/session");
  await page.getByRole("button", { name: "End session" }).click();
  await expect(page.getByRole("button", { name: "Start a new session" })).toBeVisible();
});

test("progress, skill mastery with its evidence history, and recent activity", async () => {
  await page.goto("/progress");
  await expect(page.getByRole("heading", { name: "Your learning progress" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Skills in C++ Basics" })).toBeVisible();

  await page.goto("/progress/skills");
  await expect(page.getByRole("heading", { name: "Skill mastery" })).toBeVisible();
  await page.getByText("Evidence history").first().click();
  await expect(page.getByText(/Placement test · reading/).first()).toBeVisible();

  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Recent Activity" })).toBeVisible();
  await expect(page.getByText(/^(reading|writing) · /).first()).toBeVisible(); // lowercase in the DOM; CSS capitalises it
});

test("account: profile, privacy choices and data download", async () => {
  await page.goto("/account");
  await page.getByLabel("Display name").fill("E2E Renamed");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByText("Profile updated.")).toBeVisible();
  await expect(page.getByRole("button", { name: "User menu" })).toContainText("E2E Renamed");

  await expect(page.getByRole("heading", { name: "Privacy and consent" })).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export my data" }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe("ai-tutor-my-data.json");
});

test("phone width: the sidebar folds into a menu, nothing scrolls sideways", async () => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const path of ["/dashboard", "/learn?skill=Loops", "/progress", "/account", "/session"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    expect(await noHorizontalScroll(), path).toBe(true);
  }
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Progress" })).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 800 });
});

test("log out, a signed-out visit goes to login, then the account is deleted", async () => {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "User menu" }).click();
  await page.getByRole("button", { name: "Log out" }).click();
  await page.waitForURL("**/login");
  await page.goto("/progress");
  await page.waitForURL("**/login");

  // A returning learner who has a placement goes straight to the dashboard.
  await page.getByLabel("Email address").fill(learner.email);
  await page.getByLabel("Password", { exact: true }).fill(learner.password);
  await page.getByLabel("Password", { exact: true }).press("Enter");
  await page.waitForURL("**/dashboard");

  await page.goto("/account");
  await page.getByPlaceholder("Account password").fill(learner.password);
  page.once("dialog", (dialog) => void dialog.accept());
  await page.getByRole("button", { name: "Request deletion" }).click();
  await expect(page.getByText(/Deletion scheduled for/)).toBeVisible();
  await page.waitForURL("**/login");
});
