import { test } from "@playwright/test";
import { checkAllLinksFor404 } from "../utils/linkChecker";

test.describe("Broken link check", () => {
    test("No 404s on the docs page", async ({ page }, testInfo) => {
        await page.goto("/");
    await checkAllLinksFor404(page, testInfo);
  });
});
