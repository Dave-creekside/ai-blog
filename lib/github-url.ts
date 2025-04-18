/**
 * Converts a GitHub repository URL to a raw content URL
 *
 * Converts:
 * https://github.com/username/repo/blob/branch/path/to/file.ext
 *
 * To:
 * https://raw.githubusercontent.com/username/repo/branch/path/to/file.ext
 */
export function convertToRawGitHubUrl(url: string): string {
  try {
    // Check if it's already a raw URL
    if (url.includes("raw.githubusercontent.com")) {
      return url
    }

    // Check if it's a GitHub URL
    if (!url.includes("github.com")) {
      return url // Return unchanged if not a GitHub URL
    }

    // Replace github.com with raw.githubusercontent.com and remove /blob
    return url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/")
  } catch (error) {
    console.error("Error converting GitHub URL:", error)
    return url // Return original URL if conversion fails
  }
}

/**
 * Checks if a URL is a GitHub repository URL that needs conversion
 */
export function isGitHubRepoUrl(url: string): boolean {
  return url.includes("github.com") && url.includes("/blob/") && !url.includes("raw.githubusercontent.com")
}

/**
 * Validates if a URL is a proper GitHub raw URL for file rendering
 */
export function isValidRawGitHubUrl(url: string): boolean {
  return url.includes("raw.githubusercontent.com")
}
