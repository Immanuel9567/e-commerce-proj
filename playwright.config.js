const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:8000',
    browserName: 'chromium',
    headless: true,
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, args: ['--no-sandbox'] }
      : {}
  },
  webServer: {
    command: 'python3 -m http.server 8000 --bind 0.0.0.0',
    url: 'http://127.0.0.1:8000',
    reuseExistingServer: true,
    timeout: 10000
  }
});
