"use client"

import { useState } from "react"
import { createArticle, updateArticle } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Article } from "@/types/article"

interface ArticleFormProps {
  article?: Article
  categories: string[]
}

export function ArticleForm({ article, categories }: ArticleFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(article?.category || "")

  // Add the current category to the list if it's not already there
  const allCategories =
    article?.category && !categories.includes(article.category) ? [...categories, article.category] : categories

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)

    // Add the selected category to the form data
    formData.set("category", selectedCategory)

    const result = article ? await updateArticle(formData) : await createArticle(formData)

    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <Link href="/admin/articles" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to articles
      </Link>

      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-900/20 border-red-900 text-red-300">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="pt-6">
          <form action={handleSubmit} className="space-y-6">
            {article && <Input type="hidden" name="id" value={article.id} />}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={article?.title}
                  required
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory} required>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {allCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Allow entering a new category if not in the dropdown */}
                  {!allCategories.includes(selectedCategory) && selectedCategory && (
                    <Input
                      name="category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                      placeholder="New category"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={article?.description}
                required
                className="bg-gray-800 border-gray-700 min-h-[100px]"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL *</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  defaultValue={article?.image_url}
                  required
                  className="bg-gray-800 border-gray-700"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pdf_url">PDF URL *</Label>
                <Input
                  id="pdf_url"
                  name="pdf_url"
                  defaultValue={article?.pdf_url}
                  required
                  className="bg-gray-800 border-gray-700"
                  placeholder="https://github.com/example/repo/raw/main/file.pdf"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  name="author"
                  defaultValue={article?.author}
                  required
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="read_time">Read Time</Label>
                <Input
                  id="read_time"
                  name="read_time"
                  defaultValue={article?.read_time}
                  className="bg-gray-800 border-gray-700"
                  placeholder="5 min read"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="published_date">Published Date</Label>
                <Input
                  id="published_date"
                  name="published_date"
                  type="date"
                  defaultValue={article?.published_date || new Date().toISOString().split("T")[0]}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" asChild>
                <Link href="/admin/articles">Cancel</Link>
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : article ? "Update Article" : "Create Article"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
