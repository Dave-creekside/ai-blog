/**
 * Checks if the browser supports inline PDF viewing
 */
export function checkPdfViewerSupport(): boolean {
  if (typeof navigator === "undefined") return false

  // Most modern browsers support PDF viewing
  const isChrome = navigator.userAgent.indexOf("Chrome") !== -1
  const isFirefox = navigator.userAgent.indexOf("Firefox") !== -1
  const isSafari = navigator.userAgent.indexOf("Safari") !== -1 && navigator.userAgent.indexOf("Chrome") === -1
  const isEdge = navigator.userAgent.indexOf("Edg") !== -1

  // Chrome, Firefox, Edge, and Safari all support PDF viewing
  return isChrome || isFirefox || isSafari || isEdge
}

/**
 * Formats a PDF URL for optimal inline viewing
 */
export function formatPdfUrl(url: string): string {
  // Add toolbar parameter if not already present
  if (!url.includes("#toolbar=")) {
    return `${url}#toolbar=1`
  }
  return url
}

/**
 * Extracts the filename from a PDF URL
 */
export function getPdfFilename(url: string, fallbackTitle: string): string {
  try {
    // Try to extract filename from URL
    const urlObj = new URL(url)
    const pathSegments = urlObj.pathname.split("/")
    const filename = pathSegments[pathSegments.length - 1]

    if (filename && filename.toLowerCase().endsWith(".pdf")) {
      // Remove .pdf extension and decode URI components
      return decodeURIComponent(filename.replace(/\.pdf$/i, ""))
    }
  } catch (error) {
    console.error("Error extracting filename from URL:", error)
  }

  // Fallback to provided title
  return fallbackTitle.replace(/\s+/g, "-").toLowerCase()
}

/**
 * Determines if a URL should be proxied for better PDF viewing
 */
export function shouldProxyPdfUrl(url: string): boolean {
  // Check if URL is from GitHub or other sources that might need proxying
  return (
    url.includes("github.com") ||
    url.includes("githubusercontent.com") ||
    url.includes("drive.google.com") ||
    url.includes("dropbox.com")
  )
}

/**
 * Creates a blob URL from a PDF URL
 * This helps bypass CORS and download restrictions
 */
export async function createPdfBlobUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`)
    }

    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error("Error creating blob URL:", error)
    throw error
  }
}

/**
 * Revokes a blob URL to free up memory
 */
export function revokePdfBlobUrl(url: string): void {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url)
  }
}
