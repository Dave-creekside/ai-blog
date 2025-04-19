"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, Clock, Eye, Github, Linkedin, Mail, Rss, Twitter, FileText } from "lucide-react"
import { PDFArticleCard } from "@/components/pdf-article-card"
import { PDFViewer } from "@/components/pdf-viewer"
import type { Article } from "@/types/article"
import { FixedHeader } from "@/components/fixed-header"
import { FullScreenHero } from "@/components/full-screen-hero"
import { ViewportFix } from "@/components/viewport-fix"

interface HomeClientPageProps {
  articles: Article[]
}

export function HomeClientPage({ articles }: HomeClientPageProps) {
  const featuredArticles = articles.slice(0, 3)
  const recentArticles = articles.slice(0, 6)
  const [selectedPdf, setSelectedPdf] = useState<{ url: string; title: string } | null>(null)

  return (
    <div className="min-h-screen bg-black text-white">
      <ViewportFix />
      <FixedHeader currentPath="/" />

      {/* Full-screen hero section */}
      <FullScreenHero />

      {/* Main content */}
      <main className="container mx-auto px-4 py-16">
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Articles</h2>
            <Link href="/articles/" className="text-purple-500 hover:text-purple-400 text-sm flex items-center gap-2">
              View all <Eye className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <Card
                key={article.id}
                className="bg-gray-900 border-gray-800 overflow-hidden hover:border-purple-500/50 transition-colors"
              >
                <div className="relative h-48">
                  <Image
                    src={article.image_url || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 right-0 bg-black/70 p-2 rounded-tl-lg">
                    <FileText className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-purple-500 mb-2">
                    <BrainCircuit className="h-5 w-5" />
                    <span>{article.category}</span>
                  </div>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">{article.description}</CardDescription>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{article.read_time}</span>
                  </div>
                  <button
                    onClick={() => setSelectedPdf({ url: article.pdf_url, title: article.title })}
                    className="text-purple-500 hover:text-purple-400 cursor-pointer"
                  >
                    View PDF →
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8">Recent Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArticles.map((article) => (
              <PDFArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        <section id="newsletter" className="bg-gray-900 rounded-xl p-8 mb-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Stay Updated</h2>
              <p className="text-gray-400">
                Subscribe to our newsletter to receive the latest insights on AI advancements, tutorials, and industry
                news.
              </p>
            </div>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-black border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link href="/" className="text-xl font-bold tracking-tighter">
                Clockwork<span className="text-purple-500">.earth</span>
              </Link>
              <p className="text-gray-400 text-sm">
                Exploring the cutting edge of artificial intelligence and machine learning.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Github className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Rss className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-4">Topics</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Artificial Intelligence
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Generative AI
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Computer Vision
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Deep Learning
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Machine Learning
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Research Papers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Code Samples
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Datasets
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Tools
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>mycatisbetterthanyours@proton.me</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-6 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Clockwork.earth. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {selectedPdf && (
        <PDFViewer pdfUrl={selectedPdf.url} title={selectedPdf.title} onClose={() => setSelectedPdf(null)} />
      )}
    </div>
  )
}
