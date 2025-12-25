import { FullConfig } from '@playwright/test'
import path from 'path'
import fs from 'fs'

async function globalTeardown(config: FullConfig) {
  // Clean up auth state if needed
  const authFile = path.join(__dirname, '..', '.auth', 'user.json')

  // Optionally clean up auth file after tests
  // Uncomment if you want to clean up after each test run
  // if (fs.existsSync(authFile)) {
  //   fs.unlinkSync(authFile)
  // }

  console.log('E2E tests completed - cleanup done')
}

export default globalTeardown
