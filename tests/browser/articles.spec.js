import { test, expect } from "@playwright/test";
import { contributions } from "../../src/content.js";

for (const locale of ["zh-CN", "en-US"]) {
  test.describe(locale, () => {
    test.use({ locale, permissions: ["clipboard-read", "clipboard-write"] });
    for (const { slug } of contributions) {
      test(
        slug + " renders sources, diagrams and copyable code",
        async ({ page }) => {
          await page.setViewportSize({ width: 390, height: 844 });
          const errors = [];
          page.on("pageerror", (error) => errors.push(error.message));
          await page.goto("/#/notes/" + slug);
          await expect(page.locator(".sequence-canvas svg")).toHaveCount(2);
          await expect(page.locator(".diagram-fallback")).toHaveCount(0);
          const code = page.locator(".code-block").first();
          await expect(
            code.locator(".shiki span[style]").first(),
          ).toBeAttached();
          const expected = await code.locator("code").innerText();
          await code.getByRole("button").click();
          const copied = await page.evaluate(() =>
            navigator.clipboard.readText(),
          );
          // Windows clipboard text uses CRLF; compare the actual code content.
          expect(copied.replace(/\r\n/g, "\n").trimEnd()).toBe(
            expected.trimEnd(),
          );
          const heading = page.locator(".article-toc button").last();
          await heading.click();
          await expect(page).toHaveURL(new RegExp("#/notes/" + slug + "$"));
          await page
            .locator(".sequence-figure")
            .first()
            .getByRole("button")
            .click();
          await expect(
            page.locator("dialog[open] .sequence-canvas svg"),
          ).toHaveCount(1);
          await page.keyboard.press("Escape");
          await expect(page.locator("dialog[open]")).toHaveCount(0);
          await expect(page.locator(".sequence-canvas svg")).toHaveCount(2);
          expect(
            await page.locator('.article-prose a[href*="/blob/"]').count(),
          ).toBeGreaterThan(0);
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          ).toBe(true);
          await page.screenshot({
            path: ".preview/article-" + locale + "-" + slug + ".png",
            fullPage: true,
          });
          expect(errors).toEqual([]);
        },
      );
    }
  });
}
