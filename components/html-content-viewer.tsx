"use client"

import { useState, useEffect } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HTMLContentViewerProps {
  url: string
  title: string
  height?: string
  className?: string
}

export function HTMLContentViewer({ url, title, height = "500px", className = "" }: HTMLContentViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [htmlContent, setHtmlContent] = useState<string | null>(null)

  useEffect(() => {
    const fetchHtmlContent = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Failed to fetch HTML content: ${response.status} ${response.statusText}`)
        }

        const html = await response.text()
        setHtmlContent(html)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching HTML content:", err)
        setError(err instanceof Error ? err.message : "Failed to load HTML content")
        setIsLoading(false)
      }
    }

    fetchHtmlContent()
  }, [url])

  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
    setHtmlContent(null)
  }

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-3"></div>
            <p className="text-gray-600">Loading content...</p>
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

      {!isLoading && !error && htmlContent && (
        <div
          className="w-full h-full overflow-auto bg-white rounded-lg p-4"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      )}
    </div>
  )
}
