import { test, expect } from "@playwright/test";

test("health endpoint returns ok", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.status).toBe("ok");
  expect(body).toHaveProperty("version");
  expect(body).toHaveProperty("uptime");
});

test("homepage loads and renders the email capture funnel", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/AI Skills Hub/i);
  await expect(
    page.getByRole("heading", { name: /Get new skills in your inbox/i })
  ).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();
});

test("lead capture submits and shows success state", async ({ page }) => {
  await page.goto("/");

  const email = page.getByLabel("Email address");
  await email.fill("e2e-smoke@example.com");
  await page.getByRole("button", { name: /Join the list/i }).click();

  await expect(page.getByRole("status")).toContainText(/on the list/i, {
    timeout: 10_000,
  });
  await expect(
    page.getByRole("link", { name: /Start browsing production-ready skills/i })
  ).toBeVisible();
});
