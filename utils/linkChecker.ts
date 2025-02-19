import { expect, Page, TestInfo } from "@playwright/test";

/**
 * Extracts all valid links from a page.
 * @param page Playwright Page instance
 * @returns Set of valid URLs
 */
async function getValidLinks(page: Page): Promise<Set<string>> {
  const links = await page.locator("a").all();
  const hrefs = await Promise.all(links.map((link) => link.getAttribute("href")));

  return new Set(
    hrefs
      .filter((href) => href && !href.startsWith("mailto:") && !href.startsWith("#"))
      .map((href) => new URL(href, page.url()).href)
  );
}

/**
 * Checks all valid links on a page for 404 errors.
 * Prints all links in the console and adds them to the Monocart test report.
 * @param page Playwright Page instance
 * @param testInfo Playwright TestInfo instance
 */
export async function checkAllLinksFor404(page: Page, testInfo: TestInfo) {
  const validLinks = await getValidLinks(page);

  console.log("\n🔗 Checking the following links:");
  validLinks.forEach((url) => console.log(url)); // Print all links in the console

  let reportData = "Checked Links:\n" + Array.from(validLinks).join("\n");

  for (const url of Array.from(validLinks)) {

    try {
      const response = await page.request.get(url);
      const status = response.status();
      const isSuccess = response.ok();

      console.log(`${isSuccess ? "✅" : "❌"} ${url} - Status: ${status}`);
      reportData += `\n${isSuccess ? "✅" : "❌"} ${url} - Status: ${status}`;

      expect.soft(isSuccess, `${url} returned a non-200 status`).toBeTruthy();
    } catch {
      console.log(`❌ ${url} - Could not be checked`);
      reportData += `\n❌ ${url} - Could not be checked`;
      expect.soft(false, `${url} could not be checked`).toBeTruthy();
    }
  }

  // Attach the checked links to the Monocart test report
  await testInfo.attach("Checked Links", {
    body: reportData,
    contentType: "text/plain",
  });
}
