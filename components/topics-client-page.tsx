"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, Cpu, Eye, Github, Linkedin, Mail, Rss, Twitter } from "lucide-react"
import type { Article } from "@/types/article"
import { FixedHeader } from "@/components/fixed-header"
import { ViewportFix } from "@/components/viewport-fix"

interface TopicsClientPageProps {
  articles: Article[]
}

export function TopicsClientPage({ articles }: TopicsClientPageProps) {
  // Extract unique categories and count articles in each
  const categories = articles.reduce(
    (acc, article) => {
      if (!acc[article.category]) {
        acc[article.category] = {
          count: 0,
          slug: article.category.toLowerCase().replace(/\s+/g, "-"),
        }
      }
      acc[article.category].count++
      return acc
    },
    {} as Record<string, { count: number; slug: string }>,
  )

  // Convert to array for rendering
  const topicsArray = Object.entries(categories).map(([title, { count, slug }]) => ({
    title,
    count,
    slug,
    description: `Explore the latest research and advancements in ${title}.`,
    icon: getIconForCategory(title),
  }))

  return (
    <div className="min-h-screen bg-black text-white">
      <ViewportFix />
      <FixedHeader currentPath="/topics/" />

      <main className="container mx-auto px-4 py-16 non-hero-content">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-8">Topics</h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topicsArray.map((topic, index) => (
              <TopicCard
                key={index}
                title={topic.title}
                description={topic.description}
                icon={topic.icon}
                count={topic.count}
                slug={topic.slug}
              />
            ))}
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

function TopicCard({ title, description, icon, count, slug = "" }) {
  return (
    <Link href={`/topics/${slug}`} className="group">
      <Card className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-colors h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="bg-purple-500/10 p-3 rounded-lg text-purple-500">{icon}</div>
            <div className="bg-gray-800 px-3 py-1 rounded-full text-sm">{count} articles</div>
          </div>
          <CardTitle className="text-xl mt-4 group-hover:text-purple-400 transition-colors">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-gray-400">{description}</CardDescription>
        </CardContent>
        <CardFooter>
          <span className="text-purple-500 text-sm group-hover:text-purple-400 transition-colors">View articles →</span>
        </CardFooter>
      </Card>
    </Link>
  )
}

function getIconForCategory(category: string) {
  switch (category) {
    case "GenAI":
      return <BrainCircuit className="h-6 w-6" />
    case "Computer Vision":
      return <Eye className="h-6 w-6" />
    case "Future Tech":
    case "AI Research":
      return <Cpu className="h-6 w-6" />
    case "3D Modeling":
      return <BrainCircuit className="h-6 w-6" />
    default:
      return <BrainCircuit className="h-6 w-6" />
  }
}
