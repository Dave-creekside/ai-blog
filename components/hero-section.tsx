import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <div className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-4">
      {/* Reduced top padding by removing pt-20 or similar classes */}
      {/* Added a smaller top padding that's 20% less than before */}
      <div className="max-w-4xl mx-auto space-y-4 pt-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
          <span className="text-purple-500">Neural</span>Pulse
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mt-2 max-w-2xl mx-auto">
          Exploring the frontiers of artificial intelligence and quantum machine learning
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
            <Link href="/articles">
              Read Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/projects">View Projects</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
