import { test as base, expect, TestInfo } from "@playwright/test";

export const test = base.extend<{
  exceptionLogger: void;
  timeLogger: void;
}>({
  page: async ({ page }, use, testInfo: TestInfo) => {
    testInfo.annotations.push({ type: "Test Browser", description: testInfo.project.name });

    await use(page);
  },

  timeLogger: [
    async ({}, use, testInfo: TestInfo) => {
      const startTime = Date.now();

      await use();

      const endTime = Date.now();
      const durationMs = endTime - startTime;

      testInfo.annotations.push({ type: "Execution Time", description: `${(durationMs / 1000).toFixed(2)}s` });

      console.log(`🕒 Execution Time: ${(durationMs / 1000).toFixed(2)}s`);
    },
    { auto: true },
  ],

  exceptionLogger: [
    async ({ page }, use, testInfo: TestInfo) => {
      const errors: Error[] = [];
      page.on("pageerror", (error) => errors.push(error));

      try {
        await use();
      } catch (error) {
        testInfo.annotations.push({ type: "Test Status", description: "❌ Fail" });
        throw error;
      }

      if (errors.length > 0) {
        const errorLog = errors.map((error) => `${error.message}\n${error.stack}`).join("\n-----\n");

        await testInfo.attach("frontend-exceptions", {
          body: errorLog,
          contentType: "text/plain",
        });

        testInfo.annotations.push({ type: "Error Count", description: `${errors.length} errors detected` });
        testInfo.annotations.push({ type: "Test Status", description: "❌ Fail" });

        throw new Error("🚨 JavaScript errors detected in the test!");
      } else {
        testInfo.annotations.push({ type: "Test Status", description: "✅ Pass" });
      }
    },
    { auto: true },
  ],
});

export { expect };
