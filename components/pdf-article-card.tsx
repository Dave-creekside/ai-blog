"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { BrainCircuit, Clock, FileText } from "lucide-react"
import type { Article } from "@/types/article"
import { PDFViewer } from "./pdf-viewer"
import { convertToRawGitHubUrl } from "@/lib/github-url"

interface PDFArticleCardProps {
  article: Article
}

export function PDFArticleCard({ article }: PDFArticleCardProps) {
  const [showPdfViewer, setShowPdfViewer] = useState(false)

  // Convert GitHub URLs to raw URLs for proper rendering
  const imageUrl = convertToRawGitHubUrl(article.image_url)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowPdfViewer(true)
  }

  return (
    <>
      <div className="group space-y-3">
        <a
          href="#"
          onClick={handleClick}
          className="block relative h-48 rounded-lg overflow-hidden border border-gray-800 group-hover:border-purple-500/50 transition-colors"
        >
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={`${article.title} thumbnail`}
            fill
            className="object-cover"
            unoptimized={imageUrl.includes("githubusercontent.com")}
          />
          <div className="absolute bottom-0 right-0 bg-black/70 p-2 rounded-tl-lg">
            <FileText className="h-5 w-5 text-purple-400" />
          </div>
        </a>
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-500 mb-2">
            <BrainCircuit className="h-4 w-4" />
            <span>{article.category}</span>
          </div>
          <a href="#" onClick={handleClick} className="block">
            <h3 className="font-medium group-hover:text-purple-400 transition-colors">{article.title}</h3>
            <p className="text-gray-400 text-sm mt-2 line-clamp-2">{article.description}</p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{article.read_time}</span>
              </div>
              <span className="text-purple-500 text-xs group-hover:text-purple-400">View PDF →</span>
            </div>
          </a>
        </div>
      </div>

      {showPdfViewer && (
        <PDFViewer pdfUrl={article.pdf_url} title={article.title} onClose={() => setShowPdfViewer(false)} />
      )}
    </>
  )
}
