import { mergeTests, expect } from '@playwright/test'
import { authTest, type AuthFixtures } from './auth.fixture'
import { themeTest, type ThemeFixtures, type ThemeMode } from './theme.fixture'
import { i18nTest, type I18nFixtures, type Locale } from './i18n.fixture'

// Page objects
export { BasePage } from './page-objects/base.page'
export { LoginPage } from './page-objects/login.page'
export { SidebarPage } from './page-objects/sidebar.page'
export { EntitiesPage } from './page-objects/entities.page'
export { AgentRunnerPage } from './page-objects/agent-runner.page'

// Fixture types
export type { AuthFixtures, ThemeFixtures, I18nFixtures, ThemeMode, Locale }

/**
 * Combined test fixture that includes auth, theme, and i18n fixtures.
 * Use this in test files for full fixture access.
 */
export const test = mergeTests(authTest, themeTest, i18nTest)

export { expect }
