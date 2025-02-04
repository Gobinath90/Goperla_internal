export const testDir = './tests';
export const timeout = 60000;
export const retries = process.env.CI ? 2 : 1;
export const workers = process.env.CI ? 1 : 1;
export const fullyParallel = true;

export const reporter = [
  ['list'],
  [`./CustomReporterConfig.ts`],
  ['junit', { outputFile: './report/results.xml' }],
  ['allure-playwright'],
  ['monocart-reporter', {
    name: "Goperla 2.0 Automation Test Report",
    outputFile: './report/monocart-report/index.html',
  }],
];

function getBaseUrl() {
  const environment = process.env.ENV;
  if (!environment) return 'http://3.80.32.182:3000';
  switch (environment) {
    case 'prod':
      return 'https://www.goperla.com/';
    case 'local':
      return 'http://localhost';
  }
}

export const use = {
  baseURL: getBaseUrl(),
};

export const globalSetup = require.resolve('./global-setup.js');

export const projects = [
  {
    name: 'chrome',
    use: {
      browserName: `chromium`,
      channel: `chrome`,
      headless: true,
      screenshot: `only-on-failure`,
      video: `retain-on-failure`,
      trace: `retain-on-failure`,
      actionTimeout: 60000,
      viewport: null,
      deviceScaleFactor: undefined,
      launchOptions: { args: ['--start-maximized'] }
    }
  }]