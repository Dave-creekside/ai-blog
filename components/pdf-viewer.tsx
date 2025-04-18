"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Download, ExternalLink, X, AlertCircle, RefreshCw, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { convertToRawGitHubUrl } from "@/lib/github-url"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getPdfBlobUrl } from "@/lib/pdf-blob-cache"

interface PDFViewerProps {
  pdfUrl: string
  title: string
  onClose: () => void
}

export function PDFViewer({ pdfUrl, title, onClose }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [fallbackMode, setFallbackMode] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const embedRef = useRef<HTMLEmbedElement>(null)
  const objectRef = useRef<HTMLObjectElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Convert GitHub URL to raw URL for proper rendering
  const rawPdfUrl = convertToRawGitHubUrl(pdfUrl)

  useEffect(() => {
    // Reset loading state when URL changes
    setIsLoading(true)
    setError(null)
    setBlobUrl(null)

    const loadPdf = async () => {
      try {
        // Get or create blob URL from cache
        const url = await getPdfBlobUrl(rawPdfUrl)
        setBlobUrl(url)
        setIsLoading(false)
      } catch (err) {
        console.error("Error loading PDF:", err)
        setError(`Failed to load PDF: ${err instanceof Error ? err.message : "Unknown error"}`)
        setIsLoading(false)
      }
    }

    loadPdf()

    // Cleanup function
    return () => {
      if (blobUrl) {
        // We don't revoke here since it's cached
        // Just clear the state
        setBlobUrl(null)
      }
    }
  }, [rawPdfUrl])

  const handleLoadError = () => {
    console.log("PDF load error detected")

    if (!fallbackMode) {
      // Try fallback mode (object tag)
      console.log("Embed PDF loading failed, trying fallback mode...")
      setFallbackMode(true)
    } else {
      // If all methods failed, show error
      setError("Failed to load PDF. Please check if the URL is correct and accessible.")
      setIsLoading(false)
    }
  }

  const handleLoadSuccess = () => {
    console.log("PDF loaded successfully")
    setIsLoading(false)
    setError(null)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  // Function to retry loading with different method
  const retryLoading = () => {
    setIsLoading(true)
    setError(null)

    if (fallbackMode) {
      // Reset to direct loading
      setFallbackMode(false)
    } else {
      // Try fallback mode
      setFallbackMode(true)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col p-4 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-500" />
          <h2 className="text-xl font-bold truncate">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 border-gray-800 hover:bg-gray-900"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-400">{zoom}%</span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 border-gray-800 hover:bg-gray-900"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 border-gray-800 hover:bg-gray-900"
            onClick={handleRotate}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 border-gray-800 hover:bg-gray-900"
            onClick={() => window.open(rawPdfUrl, "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Open
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 border-gray-800 hover:bg-gray-900"
            onClick={() => {
              const link = document.createElement("a")
              link.href = rawPdfUrl
              link.download = `${title.replace(/\s+/g, "-").toLowerCase()}.pdf`
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 border-gray-800 hover:bg-gray-900"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-900 text-red-300">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              className="ml-4 bg-red-900/30 border-red-900/50 hover:bg-red-900/50"
              onClick={retryLoading}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-400">Loading PDF...</p>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="flex-1 relative bg-white rounded-lg overflow-hidden"
        style={{
          display: isLoading ? "none" : "block",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: "center center",
            transition: "transform 0.2s ease",
          }}
        >
          {!fallbackMode && blobUrl ? (
            <embed
              ref={embedRef}
              src={blobUrl}
              type="application/pdf"
              className="w-full h-full border-0"
              onLoad={handleLoadSuccess}
              onError={handleLoadError}
            />
          ) : (
            <object
              ref={objectRef}
              data={blobUrl || rawPdfUrl}
              type="application/pdf"
              className="w-full h-full"
              onLoad={handleLoadSuccess}
              onError={handleLoadError}
            >
              <div className="flex-1 flex items-center justify-center bg-white p-8 rounded-lg">
                <p className="text-black">
                  Your browser doesn't support embedded PDFs.
                  <a
                    href={rawPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline ml-1"
                  >
                    Click here to download the PDF
                  </a>
                </p>
              </div>
            </object>
          )}
        </div>
      </div>
    </div>
  )
}
