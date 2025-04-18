"use client"

import { useState, useEffect, useRef } from "react"
import { convertToRawGitHubUrl } from "@/lib/github-url"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface PDFEmbedProps {
  url: string
  title: string
  height?: string
  className?: string
}

export function PDFEmbed({ url, title, height = "500px", className = "" }: PDFEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const embedRef = useRef<HTMLEmbedElement>(null)

  const rawUrl = convertToRawGitHubUrl(url)
  const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(rawUrl)}`

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(proxyUrl)

        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`)
        }

        const blob = await response.blob()

        // Create a blob URL
        const url = URL.createObjectURL(blob)
        setBlobUrl(url)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching PDF:", err)
        setError(err instanceof Error ? err.message : "Failed to load PDF")
        setIsLoading(false)
      }
    }

    fetchPdf()

    // Cleanup function
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
      }
    }
  }, [proxyUrl])

  const handleRetry = () => {
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl)
      setBlobUrl(null)
    }
    setIsLoading(true)
    setError(null)
  }

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-3"></div>
            <p className="text-gray-600">Loading PDF...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-lg p-4">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
            <p className="text-red-600 mb-3">{error}</p>
            <Button onClick={handleRetry} size="sm" className="bg-red-600 hover:bg-red-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {!isLoading && !error && blobUrl && (
        <embed
          ref={embedRef}
          src={blobUrl}
          type="application/pdf"
          width="100%"
          height="100%"
          className="rounded-lg"
          title={title}
        />
      )}
    </div>
  )
}
