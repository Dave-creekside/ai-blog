"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BrainCircuit, Clock, Code, Github, FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PDFViewer } from "./pdf-viewer"
import { convertToRawGitHubUrl } from "@/lib/github-url"
import type { Article } from "@/types/article"

interface ProjectCardProps {
  project: Article
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [showPdfViewer, setShowPdfViewer] = useState(false)
  const [activeTab, setActiveTab] = useState("abstract")

  // Convert GitHub URLs to raw URLs for proper rendering
  const imageUrl = convertToRawGitHubUrl(project.image_url)

  const handlePdfClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowPdfViewer(true)
  }

  return (
    <>
      <div className="group space-y-3">
        <Link href={`/projects/${project.id}`} className="block">
          <div className="relative h-48 rounded-lg overflow-hidden border border-gray-800 group-hover:border-purple-500/50 transition-colors">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={`${project.title} thumbnail`}
              fill
              className="object-cover"
              unoptimized={imageUrl.includes("githubusercontent.com")}
            />
            <div className="absolute bottom-0 right-0 bg-black/70 p-2 rounded-tl-lg">
              <Code className="h-5 w-5 text-purple-400" />
            </div>
          </div>
        </Link>

        <div>
          <div className="flex items-center gap-2 text-xs text-purple-500 mb-2">
            <BrainCircuit className="h-4 w-4" />
            <span>{project.category}</span>
          </div>
          <Link href={`/projects/${project.id}`} className="block">
            <h3 className="font-medium group-hover:text-purple-400 transition-colors">{project.title}</h3>
          </Link>

          <Tabs defaultValue="abstract" className="mt-3" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 h-8">
              <TabsTrigger value="abstract" className="text-xs">
                Abstract
              </TabsTrigger>
              <TabsTrigger value="research" className="text-xs" disabled={!project.html_data_url}>
                Research Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="abstract" className="pt-3">
              <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{project.read_time}</span>
                </div>
                <div className="flex gap-2">
                  {project.repository_url && (
                    <a
                      href={project.repository_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-500 text-xs hover:text-purple-400 flex items-center gap-1"
                    >
                      <Github className="h-3 w-3" />
                      Repo
                    </a>
                  )}
                  <button
                    onClick={handlePdfClick}
                    className="text-purple-500 text-xs hover:text-purple-400 flex items-center gap-1"
                  >
                    <FileText className="h-3 w-3" />
                    PDF
                  </button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="research" className="pt-3">
              {project.html_data_url ? (
                <div className="flex flex-col">
                  <div className="text-xs text-gray-400 mb-2">Research data and findings</div>
                  <Link href={`/projects/${project.id}`}>
                    <Button variant="outline" size="sm" className="text-xs mb-2">
                      View Full Research
                    </Button>
                  </Link>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No research data available for this project.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {showPdfViewer && (
        <PDFViewer pdfUrl={project.pdf_url} title={project.title} onClose={() => setShowPdfViewer(false)} />
      )}
    </>
  )
}
