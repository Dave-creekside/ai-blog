"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BrainCircuit, Clock, Github, FileText, FileCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PDFViewer } from "./pdf-viewer"
import { HTMLContentViewer } from "./html-content-viewer"
import { convertToRawGitHubUrl } from "@/lib/github-url"
import type { Article } from "@/types/article"
import { FixedHeader } from "@/components/fixed-header"
import { ViewportFix } from "@/components/viewport-fix"
import { Twitter } from "lucide-react" // Import Twitter icon

interface ProjectDetailPageProps {
  project: Article
}

export function ProjectDetailPage({ project }: ProjectDetailPageProps) {
  const [showPdfViewer, setShowPdfViewer] = useState(false)

  // Convert GitHub URLs to raw URLs for proper rendering
  const imageUrl = convertToRawGitHubUrl(project.image_url)

  return (
    <div className="min-h-screen bg-black text-white">
      <ViewportFix />
      <FixedHeader currentPath={`/projects/${project.id}`} />

      <main className="container mx-auto px-4 py-16 non-hero-content">
        <Link href="/projects" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to projects
        </Link>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden border border-gray-800">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={project.title}
              fill
              className="object-cover"
              unoptimized={imageUrl.includes("githubusercontent.com")}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-purple-500">
              <BrainCircuit className="h-5 w-5" />
              <span>{project.category}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>

            <p className="text-gray-300">{project.description}</p>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{project.read_time}</span>
              </div>
              <div>By {project.author}</div>
              <div>{new Date(project.published_date).toLocaleDateString()}</div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={() => setShowPdfViewer(true)}>
                <FileText className="h-4 w-4 mr-2" />
                View PDF
              </Button>

              {project.repository_url && (
                <Button variant="outline" asChild>
                  <a href={project.repository_url} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    View Repository
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="abstract" className="mt-8">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="abstract">Abstract</TabsTrigger>
            <TabsTrigger value="research" disabled={!project.html_data_url}>
              Research Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="abstract" className="mt-6">
            <div className="prose prose-invert prose-purple max-w-none">
              <p className="text-xl text-gray-300 mb-6">{project.description}</p>

              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mt-8">
                <h3 className="text-xl font-semibold mb-4">Project Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Author</h4>
                    <p>{project.author}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Published Date</h4>
                    <p>{new Date(project.published_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Category</h4>
                    <p>{project.category}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Read Time</h4>
                    <p>{project.read_time}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="research" className="mt-6">
            {project.html_data_url ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Research Data</h2>
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.html_data_url} target="_blank" rel="noopener noreferrer">
                      <FileCode className="h-4 w-4 mr-2" />
                      Open in New Tab
                    </a>
                  </Button>
                </div>
                <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
                  <HTMLContentViewer
                    url={project.html_data_url}
                    title={`${project.title} - Research Data`}
                    height="600px"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
                <p className="text-gray-400">No research data available for this project.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Link href="/" className="text-xl font-bold tracking-tighter">
              Clockwork<span className="text-purple-500">.earth</span>
            </Link>
            <p className="text-gray-400 text-sm mt-4 mb-6">
              Exploring the cutting edge of artificial intelligence and quantum machine learning.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-gray-400">
              <p>© {new Date().getFullYear()} Clockwork.earth. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {showPdfViewer && (
        <PDFViewer pdfUrl={project.pdf_url} title={project.title} onClose={() => setShowPdfViewer(false)} />
      )}
    </div>
  )
}
