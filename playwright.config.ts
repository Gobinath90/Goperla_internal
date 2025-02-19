export const testDir = './tests';
export const retries = process.env.CI ? 2 : 1;
export const workers = process.env.CI ? 1 : 1;
export const fullyParallel = true;
const USE_MFA = process.env.M365_OTP_SECRET ? true : false;

export const reporter = [
  ['list'],
  [`./CustomReporterConfig.ts`],
  ['junit', { outputFile: './report/results.xml' }],
  ['allure-playwright'],
  ['monocart-reporter', {
    name: "Goperla 2.0 Automation Test Report",
    outputFile: './report/monocart-report/index.html',
  }]
];

function getBaseUrl() {
  const environment = process.env.ENV || 'qa';
  if (!environment) return 'http://3.80.32.182:3000';
  switch (environment) {
    case 'qa':
      return 'https://marketing.qa.goperla.com';
    case 'dev':
      return 'https://marketing-dev.goperla.com';
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
      headless: false,
      screenshot: `on`,
      video: `on`,
      trace: `on`,
      actionTimeout: 60000,
      viewport: null,
      deviceScaleFactor: undefined,
      launchOptions: { args: ['--start-maximized'] }
    }
  }]