/**
 * Brand Configuration for Excel Reports
 *
 * BRANDING CONTRACT:
 * - Change these values to rebrand the report
 * - Colors are used in charts and headers
 * - Logo path is embedded in report headers
 */

export interface BrandConfig {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    success: string
    warning: string
    error: string
  }
  fonts: {
    header: string
    body: string
  }
  logo?: string
}

export const brandConfig: BrandConfig = {
  name: "Vibe Templates",
  colors: {
    primary: "6366F1",    // Indigo
    secondary: "8B5CF6",  // Purple
    accent: "06B6D4",     // Cyan
    success: "22C55E",    // Green
    warning: "F59E0B",    // Amber
    error: "EF4444",      // Red
  },
  fonts: {
    header: "Calibri",
    body: "Calibri",
  },
  logo: undefined, // Path to logo image (optional)
}

export default brandConfig
