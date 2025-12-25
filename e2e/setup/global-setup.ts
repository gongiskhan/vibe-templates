import { chromium, FullConfig } from '@playwright/test'
import path from 'path'
import fs from 'fs'

const AUTH_FILE = path.join(__dirname, '..', '.auth', 'user.json')

async function globalSetup(config: FullConfig) {
  // Ensure auth directory exists
  const authDir = path.dirname(AUTH_FILE)
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true })
  }

  // Create a browser instance for setup
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    // For templates that require authentication, we can set up auth state here
    // This creates a storage state file that can be reused by authenticated tests

    // Example: Login to one of the Next.js apps
    // const baseURL = config.projects.find(p => p.name === 'nextjs-internal-tool')?.use?.baseURL
    // if (baseURL) {
    //   await page.goto(`${baseURL}/auth/login`)
    //   await page.fill('#email', 'test@example.com')
    //   await page.fill('#password', 'password123')
    //   await page.click('button[type="submit"]')
    //   await page.waitForURL('/')
    //   await context.storageState({ path: AUTH_FILE })
    // }

    // For now, just create an empty auth file
    await context.storageState({ path: AUTH_FILE })
  } finally {
    await browser.close()
  }
}

export default globalSetup
