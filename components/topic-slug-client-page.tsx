"use client"

import Link from "next/link"
import { Github, Linkedin, Mail, Rss, Twitter, ArrowLeft } from "lucide-react"
import { PDFArticleCard } from "@/components/pdf-article-card"
import type { Article } from "@/types/article"
import { FixedHeader } from "@/components/fixed-header"
import { ViewportFix } from "@/components/viewport-fix"

interface TopicSlugClientPageProps {
  articles: Article[]
  slug: string
}

export function TopicSlugClientPage({ articles, slug }: TopicSlugClientPageProps) {
  // Convert slug back to category name format
  const slugToCategory = (slug: string) => {
    // This is a simple conversion - you might need more complex logic depending on your slugification
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Find articles matching this category
  const categoryName = slugToCategory(slug)
  const filteredArticles = articles.filter(
    (article) =>
      article.category.toLowerCase() === categoryName.toLowerCase() ||
      article.category.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase(),
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <ViewportFix />
      <FixedHeader currentPath={`/topics/${slug}`} />

      <main className="container mx-auto px-4 py-16 non-hero-content">
        <section className="mb-12">
          <Link href="/topics" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to topics
          </Link>

          <h1 className="text-4xl font-bold mb-8">{categoryName} Articles</h1>

          {filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <PDFArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No articles found in this category.</p>
              <Link href="/articles" className="text-purple-500 hover:text-purple-400">
                View all articles
              </Link>
            </div>
          )}
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
                Exploring the cutting edge of artificial intelligence and quantum machine learning.
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
    </div>
  )
}
