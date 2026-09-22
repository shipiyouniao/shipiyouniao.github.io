import { test, expect } from "@playwright/test";

test("repository counters refresh, cache across navigation and retain stale data on failure", async ({
  page,
}) => {
  let calls = 0;
  await page.route("https://api.github.com/repos/**", async (route) => {
    calls++;
    if (calls === 3)
      return route.fulfill({ status: 403, json: { message: "Rate limited" } });
    return route.fulfill({
      json: { stargazers_count: calls === 1 ? 1200 : 1201, forks_count: 80 },
    });
  });
  await page.goto("/#/projects");
  const stats = page.locator('[data-repo="ovg-project/kvcached"]');
  await expect(stats).toContainText("1,200");
  await stats.getByRole("button").click();
  await expect(stats).toContainText("1,201");
  await stats.getByRole("button").click();
  await expect(stats).toContainText("Refresh failed");
  await expect(stats).toContainText("1,201");
  await page.goto("/#/about");
  await expect(
    page.locator('[data-repo="ovg-project/kvcached"]'),
  ).toContainText("1,201");
  await expect(page.locator('[data-repo="vllm-project/vllm"]')).toContainText(
    "1,201",
  );
  expect(calls).toBe(4);
});
