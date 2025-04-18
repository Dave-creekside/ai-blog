"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Download, ExternalLink, ZoomIn, ZoomOut, RotateCw, AlertCircle, RefreshCw } from "lucide-react"
import { convertToRawGitHubUrl, isGitHubRepoUrl } from "@/lib/github-url"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PDFPreviewProps {
  file: File | null
  url: string | undefined
  title: string
}

export function PDFPreview({ file, url, title }: PDFPreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [useProxy, setUseProxy] = useState(true) // Start with proxy by default
  const [fallbackMode, setFallbackMode] = useState(false)
  const embedRef = useRef<HTMLEmbedElement>(null)
  const objectRef = useRef<HTMLObjectElement>(null)

  useEffect(() => {
    setError(null)
    setIsLoading(true)
    setUseProxy(true)
    setFallbackMode(false)

    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPdfUrl(objectUrl)
      setBlobUrl(objectUrl)
      setIsLoading(false)
      return () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl)
      }
    } else if (url) {
      // Convert GitHub URL to raw URL if needed
      const rawUrl = convertToRawGitHubUrl(url)
      setPdfUrl(rawUrl)

      // Show warning if the URL was converted
      if (isGitHubRepoUrl(url)) {
        setError("GitHub repository URL detected. Using raw.githubusercontent.com URL for preview.")
      }

      // Create a proxy URL
      const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(rawUrl)}`

      // Fetch the PDF through the proxy and create a blob URL
      const fetchPdf = async () => {
        try {
          const response = await fetch(proxyUrl)
          if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`)
          }

          const blob = await response.blob()
          const blobUrl = URL.createObjectURL(blob)
          setBlobUrl(blobUrl)
          setIsLoading(false)
        } catch (err) {
          console.error("Error fetching PDF:", err)
          setError(`Failed to load PDF: ${err instanceof Error ? err.message : "Unknown error"}`)
          setIsLoading(false)
          setFallbackMode(true)
        }
      }

      fetchPdf()

      return () => {
        if (blobUrl) URL.revokeObjectURL(blobUrl)
      }
    } else {
      setPdfUrl(null)
      setBlobUrl(null)
      setIsLoading(false)
    }
  }, [file, url])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleLoadError = () => {
    if (!fallbackMode) {
      console.log("PDF loading failed, trying fallback mode...")
      setFallbackMode(true)
    } else {
      setError("Failed to load PDF. Please check if the URL is correct and accessible.")
      setIsLoading(false)
    }
  }

  const handleLoadSuccess = () => {
    setIsLoading(false)
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

  if (!pdfUrl && !file) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-400">
        <FileText className="h-16 w-16 mb-4" />
        <p className="text-lg">No PDF to preview</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[70vh]">
      {error && (
        <Alert variant="warning" className="mb-4 bg-amber-900/20 border-amber-900 text-amber-300">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            {error.includes("Failed to load") && (
              <Button
                variant="outline"
                size="sm"
                className="ml-4 bg-amber-900/30 border-amber-900/50 hover:bg-amber-900/50"
                onClick={retryLoading}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Try Again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

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
            onClick={() => window.open(pdfUrl, "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Open
          </Button>
          {(file || pdfUrl) && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 border-gray-800 hover:bg-gray-900"
              onClick={() => {
                const link = document.createElement("a")
                link.href = file ? URL.createObjectURL(file) : pdfUrl!
                link.download = file ? file.name : `${title.replace(/\s+/g, "-").toLowerCase()}.pdf`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                if (file) URL.revokeObjectURL(link.href)
              }}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      <div
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
          {!fallbackMode ? (
            <embed
              ref={embedRef}
              src={blobUrl || ""}
              type="application/pdf"
              className="w-full h-full"
              onLoad={handleLoadSuccess}
              onError={handleLoadError}
            />
          ) : (
            <object
              ref={objectRef}
              data={pdfUrl || ""}
              type="application/pdf"
              className="w-full h-full"
              onLoad={handleLoadSuccess}
              onError={handleLoadError}
            >
              <div className="flex-1 flex items-center justify-center bg-white p-8 rounded-lg">
                <p className="text-black">
                  Your browser doesn't support embedded PDFs.
                  <a
                    href={pdfUrl || "#"}
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
