import { defineConfig, devices } from '@playwright/test'
import path from 'path'

// Template port mapping
const TEMPLATE_PORTS: Record<string, number> = {
  'nextjs-internal-tool': 3000,
  'nextjs_dashboard_app': 3001,
  'nextjs_crud_app': 3002,
  'nextjs_workflow_app': 3003,
  'nextjs_data_explorer': 3004,
  'nextjs_landing_site': 3005,
  'agent_runner_ui': 3006,
  'ai-assistant': 3080,
  'landing-pages': 4000,
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,

  reporter: [
    ['html', { outputFolder: './test-results/html-report' }],
    ['json', { outputFile: './test-results/results.json' }],
    process.env.CI ? ['github'] : ['list'],
  ],

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Setup project for auth state
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Next.js Internal Tool
    {
      name: 'nextjs-internal-tool',
      testDir: './tests/nextjs-internal-tool',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${TEMPLATE_PORTS['nextjs-internal-tool']}`,
      },
      dependencies: ['setup'],
    },

    // Next.js Dashboard App
    {
      name: 'nextjs_dashboard_app',
      testDir: './tests/nextjs_dashboard_app',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${TEMPLATE_PORTS['nextjs_dashboard_app']}`,
      },
      dependencies: ['setup'],
    },

    // Next.js CRUD App
    {
      name: 'nextjs_crud_app',
      testDir: './tests/nextjs_crud_app',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${TEMPLATE_PORTS['nextjs_crud_app']}`,
      },
      dependencies: ['setup'],
    },

    // Next.js Workflow App
    {
      name: 'nextjs_workflow_app',
      testDir: './tests/nextjs_workflow_app',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${TEMPLATE_PORTS['nextjs_workflow_app']}`,
      },
      dependencies: ['setup'],
    },

    // Next.js Data Explorer
    {
      name: 'nextjs_data_explorer',
      testDir: './tests/nextjs_data_explorer',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${TEMPLATE_PORTS['nextjs_data_explorer']}`,
      },
      dependencies: ['setup'],
    },

    // Next.js Landing Site
    {
      name: 'nextjs_landing_site',
      testDir: './tests/nextjs_landing_site',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${TEMPLATE_PORTS['nextjs_landing_site']}`,
      },
      dependencies: ['setup'],
    },

    // Agent Runner UI
    {
      name: 'agent_runner_ui',
      testDir: './tests/agent_runner_ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${TEMPLATE_PORTS['agent_runner_ui']}`,
      },
      dependencies: ['setup'],
    },

    // AI Assistant
    {
      name: 'ai-assistant',
      testDir: './tests/ai-assistant',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${TEMPLATE_PORTS['ai-assistant']}`,
      },
      dependencies: ['setup'],
    },

    // Static Landing Pages
    {
      name: 'landing-pages',
      testDir: './tests/landing-pages',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${TEMPLATE_PORTS['landing-pages']}`,
      },
    },

    // Mobile viewport tests
    {
      name: 'mobile-chrome',
      testDir: './tests',
      use: {
        ...devices['Pixel 5'],
      },
      grep: /@mobile/,
    },

    // Safari tests (cross-browser)
    {
      name: 'safari',
      testDir: './tests',
      use: {
        ...devices['Desktop Safari'],
      },
      grep: /@cross-browser/,
    },
  ],

  // Web server configurations - uncomment when ready to test
  // webServer: [
  //   {
  //     command: 'npm run dev',
  //     cwd: path.join(__dirname, '..', 'nextjs-internal-tool'),
  //     port: TEMPLATE_PORTS['nextjs-internal-tool'],
  //     reuseExistingServer: !process.env.CI,
  //     timeout: 120000,
  //   },
  //   {
  //     command: 'npx serve ../landing_pages -p 4000 -s',
  //     port: TEMPLATE_PORTS['landing-pages'],
  //     reuseExistingServer: !process.env.CI,
  //   },
  // ],
})
