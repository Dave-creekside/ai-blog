"use client"

import Link from "next/link"
import { Github, Linkedin, Mail, Rss, Twitter } from "lucide-react"
import { FixedHeader } from "@/components/fixed-header"
import { ViewportFix } from "@/components/viewport-fix"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <ViewportFix />
      <FixedHeader currentPath="/about/" />

      <main className="container mx-auto px-4 py-16 non-hero-content">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About Clockwork.earth</h1>

          <div className="prose prose-invert prose-purple max-w-none">
            <p className="text-xl text-gray-300 mb-8">
              Clockwork is dedicated to exploring the frontiers of artificial intelligence, with a focus on recent
              advancements in AI, GenAI, and Deep Learning.
            </p>

            <h2>Whoami</h2>
            <p>
              I'm just a person who can't get ideas out of my head unless I perpetrate them on others. So here ya go!
            </p>

            <h2>What is This</h2>
            <p>This page is the frontline access to a repo of crazy ideas taken too far and cranked through multiple LLMs and Deep Research queries.</p>

            <ul>
              <li>
                <strong>Generative AI</strong>: From GANs to diffusion models, we explore how AI is creating
                increasingly realistic content across various media.
              </li>
              <li>
                <strong>Deep Cognition</strong>: Taking an outside look at Knowledge and how semantic structures interact.
              </li>
              <li>
                <strong>AI Ethics</strong>: Musings on the nature of ethical representations in AI, and the strange in-between time we're in now.
              </li>
            </ul>

            <h2>My Team</h2>
            <p>
              Gemini 2.0: Some initial ideas.
              Claude 3.7: Refinement of Concepts.
              GPT 4o: Deep Research.
              Perplexity: Deep Research.
            </p>

            <h2>Contact Me</h2>
            <p>
              Have a question, suggestion, or want to collaborate? We'd love to hear from you! Reach out to us at{" "}
              <a href="mailto:mycatisbetterthanyours@proton.me" className="text-purple-400 hover:text-purple-300">
                mycatisbetterthanyours@proton.me
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link href="/" className="text-xl font-bold tracking-tighter">
                Clockwork<span className="text-purple-500">Earth</span>
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
