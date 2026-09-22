import { test, expect } from "@playwright/test";

async function selectLanguage(page, language) {
  await page.getByTestId("language").click();
  await page
    .getByRole("menuitemradio")
    .filter({ hasText: language === "en" ? "English" : "Chinese" })
    .click();
}

for (const language of ["zh-CN", "en-US"]) {
  test.describe(language, () => {
    test.use({ locale: language });
    for (const width of [320, 390, 1440, 1920]) {
      test(`localized navigation and layout at ${width}px`, async ({
        page,
      }) => {
        const zh = language === "zh-CN";
        await page.setViewportSize({ width, height: 960 });
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto("/");
        await expect(page.locator("html")).toHaveAttribute(
          "lang",
          zh ? "zh-CN" : "en",
        );
        await expect(page.locator(".hero h1")).toContainText(
          zh ? "石皮幼鸟" : "shipiyouniao",
        );
        await expect(page.locator(".hero-image")).toHaveJSProperty(
          "naturalWidth",
          1920,
        );
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await expect(page.locator(".bili-button")).toHaveAttribute(
          "href",
          "https://space.bilibili.com/30915729",
        );
        await page.locator(".project-image img").scrollIntoViewIfNeeded();
        await page
          .locator(".project-image img")
          .evaluate((image) => image.decode());
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({
          path: `.preview/home-${language}-${width}.png`,
          fullPage: true,
        });
        await page
          .getByRole("link", {
            name: zh ? "全部 PR 手记" : "All PR notes",
            exact: true,
          })
          .click();
        await expect(page.locator(".note-card")).toHaveCount(6);
        await page.getByRole("searchbox").fill("51979");
        await expect(page.locator(".note-card")).toHaveCount(1);
        await page.locator(".note-card").click();
        await expect(page.locator(".sequence-canvas svg")).toHaveCount(2);
        await expect(
          page.locator(".highlighted-code .shiki").first(),
        ).toBeVisible();
        await expect(
          page.locator(".article a[target='_blank']"),
        ).toHaveAttribute(
          "href",
          "https://github.com/vllm-project/vllm/pull/51979",
        );
        await page.reload();
        await expect(page.locator(".sequence-canvas svg")).toHaveCount(2);
        await page.screenshot({
          path: `.preview/pr-${language}-${width}.png`,
          fullPage: true,
        });
        await page
          .getByRole("link", {
            name: zh ? "返回 PR 手记" : "Back to PR notes",
            exact: true,
          })
          .click();
        await page.getByRole("searchbox").fill("nonexistent-article");
        await expect(page.locator(".empty")).toBeVisible();
        if (width < 760)
          await page
            .getByRole("button", {
              name: zh ? "切换导航" : "Toggle navigation",
            })
            .click();
        await page
          .getByRole("navigation", {
            name:
              width < 760
                ? zh
                  ? "移动导航"
                  : "Mobile navigation"
                : zh
                  ? "主导航"
                  : "Main navigation",
            exact: true,
          })
          .getByRole("link", { name: zh ? "关于我" : "About", exact: true })
          .click();
        await expect(page.locator(".stack-table")).toContainText(
          "VictoriaMetrics",
        );
        await expect(page.locator(".experience-company")).toContainText(
          zh ? "2025 年 6 月 25 日" : "June 25, 2025",
        );
        await expect(page.locator(".education-section")).toContainText(
          zh ? "成都信息工程大学" : "Chengdu University",
        );
        await expect(page.locator(".about-lead img")).toHaveJSProperty(
          "complete",
          true,
        );
        expect(
          await page
            .locator(".about-lead img")
            .evaluate((img) => img.naturalWidth),
        ).toBeGreaterThan(0);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await page.screenshot({
          path: `.preview/about-${language}-${width}.png`,
          fullPage: true,
        });
        expect(errors).toEqual([]);
      });
    }
  });
}

test("manual language persists and updates article title", async ({ page }) => {
  await page.goto("/#/notes/worker-rpc");
  await selectLanguage(page, "en");
  await expect(page).toHaveTitle(/Release worker RPC/);
  await selectLanguage(page, "zh");
  await expect(page).toHaveTitle(/在下一次出队/);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
});

test("language switching works when storage is unavailable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("disabled");
      },
    });
  });
  await page.goto("/");
  await selectLanguage(page, "en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await selectLanguage(page, "zh");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
});

test("built legacy entry preserves game route", async ({ request }) => {
  const response = await request.get("/Minesweeper-2.0/index.html");
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain("location.replace");
});

test("language menu keyboard, dismissal, and mobile placement", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  await selectLanguage(page, "zh");
  const trigger = page.getByTestId("language");
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menuitemradio").first()).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menuitemradio").last()).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.screenshot({ path: ".preview/language-menu-mobile.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("menu")).toHaveCount(0);
  await page.setViewportSize({ width: 1440, height: 900 });
  await trigger.click();
  await page.screenshot({ path: ".preview/language-menu-desktop.png" });
  await page.locator(".hero h1").click();
  await expect(page.getByRole("menu")).toHaveCount(0);
});
