import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Esta config vive en e2e/src, y tus tests también están ahí:
  testDir: '.',

  // Incluye tus tests reales (login.spec.ts) y también app.e2e-spec.ts (lo convertiremos a Playwright)
  testMatch: ['**/*.spec.ts', '**/*.e2e-spec.ts'],

  use: {
    baseURL: 'http://localhost:8100',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
