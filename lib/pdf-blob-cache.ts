// A simple in-memory cache for PDF blob URLs
const pdfBlobCache: Record<string, { blobUrl: string; timestamp: number }> = {}

// Cache expiration time (30 minutes)
const CACHE_EXPIRATION = 30 * 60 * 1000

/**
 * Creates or retrieves a cached blob URL for a PDF
 */
export async function getPdfBlobUrl(url: string): Promise<string> {
  // Check if we have a valid cached blob URL
  const cached = pdfBlobCache[url]
  const now = Date.now()

  if (cached && now - cached.timestamp < CACHE_EXPIRATION) {
    return cached.blobUrl
  }

  // If not cached or expired, fetch and create a new blob URL
  try {
    // Use the proxy for external URLs
    const fetchUrl = url.startsWith("http") ? `/api/pdf-proxy?url=${encodeURIComponent(url)}` : url

    const response = await fetch(fetchUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`)
    }

    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)

    // Cache the blob URL
    pdfBlobCache[url] = {
      blobUrl,
      timestamp: now,
    }

    return blobUrl
  } catch (error) {
    console.error("Error creating PDF blob URL:", error)
    throw error
  }
}

/**
 * Revokes a blob URL and removes it from cache
 */
export function revokePdfBlobUrl(url: string): void {
  const cached = pdfBlobCache[url]

  if (cached) {
    URL.revokeObjectURL(cached.blobUrl)
    delete pdfBlobCache[url]
  }
}

/**
 * Clears expired blob URLs from cache
 */
export function cleanupPdfBlobCache(): void {
  const now = Date.now()

  Object.entries(pdfBlobCache).forEach(([url, { blobUrl, timestamp }]) => {
    if (now - timestamp > CACHE_EXPIRATION) {
      URL.revokeObjectURL(blobUrl)
      delete pdfBlobCache[url]
    }
  })
}

// Run cleanup every 5 minutes if in browser environment
if (typeof window !== "undefined") {
  setInterval(cleanupPdfBlobCache, 5 * 60 * 1000)
}
