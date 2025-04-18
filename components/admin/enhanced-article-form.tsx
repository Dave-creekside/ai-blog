"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { createArticleWithFile, updateArticleWithFile } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft, FileText, X, Check, AlertCircle, Info } from "lucide-react"
import type { Article } from "@/types/article"
import { isGitHubRepoUrl, convertToRawGitHubUrl } from "@/lib/github-url"

interface EnhancedArticleFormProps {
  article?: Article
  categories: string[]
}

export function EnhancedArticleForm({ article, categories }: EnhancedArticleFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(article?.category || "")
  const [newCategory, setNewCategory] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewTab, setPreviewTab] = useState<"form" | "preview">("form")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [imageUrl, setImageUrl] = useState(article?.image_url || "")
  const [urlWarnings, setUrlWarnings] = useState<{ image: string | null; pdf: string | null }>({
    image: null,
    pdf: null,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Add the current category to the list if it's not already there
  const allCategories =
    article?.category && !categories.includes(article.category) ? [...categories, article.category] : categories

  // Check URLs for GitHub format issues
  useEffect(() => {
    const warnings = {
      image: null as string | null,
      pdf: null as string | null,
    }

    if (imageUrl && isGitHubRepoUrl(imageUrl)) {
      warnings.image = "This GitHub URL may not display correctly. Consider using a raw.githubusercontent.com URL."
    }

    if (article?.pdf_url && isGitHubRepoUrl(article.pdf_url)) {
      warnings.pdf = "This GitHub URL may not display correctly. Consider using a raw.githubusercontent.com URL."
    }

    setUrlWarnings(warnings)
  }, [imageUrl, article?.pdf_url])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed")
        return
      }
      setSelectedFile(file)
      setError(null)
    }
  }

  const removeSelectedFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validateForm = (formData: FormData): boolean => {
    const errors: Record<string, string> = {}

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = selectedCategory
    const image_url = formData.get("image_url") as string
    const author = formData.get("author") as string

    if (!title.trim()) errors.title = "Title is required"
    if (!description.trim()) errors.description = "Description is required"
    if (!category.trim()) errors.category = "Category is required"
    if (!image_url.trim()) errors.image_url = "Image URL is required"
    if (!author.trim()) errors.author = "Author is required"

    // Check if we need a PDF file
    if (!article && !selectedFile) {
      errors.pdf_file = "PDF file is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const convertToRawUrl = () => {
    if (imageUrl && isGitHubRepoUrl(imageUrl)) {
      const rawUrl = convertToRawGitHubUrl(imageUrl)
      setImageUrl(rawUrl)
    }
  }

  async function handleSubmit(formData: FormData) {
    if (!validateForm(formData)) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    // Add the selected category to the form data
    if (newCategory) {
      formData.set("category", newCategory)
    } else {
      formData.set("category", selectedCategory)
    }

    // Add the PDF file if selected
    if (selectedFile) {
      formData.set("pdf_file", selectedFile)
    }

    // Add current PDF info if updating
    if (article) {
      formData.set("current_pdf_url", article.pdf_url)
      formData.set("current_pdf_path", article.pdf_path || "")

      const result = await updateArticleWithFile(formData)
      if (result?.error) {
        setError(result.error)
        setIsSubmitting(false)
      }
    } else {
      const result = await createArticleWithFile(formData)
      if (result?.error) {
        setError(result.error)
        setIsSubmitting(false)
      }
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
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Alert className="mb-6 bg-blue-900/20 border-blue-900 text-blue-300">
        <Info className="h-4 w-4 mr-2" />
        <AlertDescription>
          <strong>GitHub URLs:</strong> For PDF files and images hosted on GitHub, use raw.githubusercontent.com URLs
          for proper rendering.
          <br />
          <span className="text-sm">
            Example:{" "}
            <code className="bg-black/30 px-1 py-0.5 rounded">
              https://raw.githubusercontent.com/username/repo/branch/path/to/file.pdf
            </code>
          </span>
        </AlertDescription>
      </Alert>

      <Tabs value={previewTab} onValueChange={(value) => setPreviewTab(value as "form" | "preview")}>
        <TabsList className="mb-6 bg-gray-800">
          <TabsTrigger value="form">Edit Article</TabsTrigger>
          <TabsTrigger value="preview" disabled={!article && !selectedFile}>
            Preview PDF
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <form action={handleSubmit} className="space-y-6">
                {article && <Input type="hidden" name="id" value={article.id} />}

                {/* Basic article fields */}
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
                      {newCategory ? (
                        <div className="flex-1 relative">
                          <Input
                            name="new_category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="bg-gray-800 border-gray-700 pr-8"
                            placeholder="New category"
                          />
                          <button
                            type="button"
                            onClick={() => setNewCategory("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <Select value={selectedCategory} onValueChange={setSelectedCategory} required>
                          <SelectTrigger className="bg-gray-800 border-gray-700 flex-1">
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
                      )}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (newCategory) {
                            setSelectedCategory(newCategory)
                            setNewCategory("")
                          } else {
                            setNewCategory("")
                          }
                        }}
                      >
                        {newCategory ? "Use" : "New"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Description */}
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

                {/* URLs */}
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
                    <Label htmlFor="pdf_file">PDF File {!article && <span className="text-red-500">*</span>}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="pdf_file"
                        name="pdf_file"
                        type="file"
                        accept="application/pdf"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="bg-gray-800 border-gray-700"
                      />
                      {selectedFile && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={removeSelectedFile}
                          className="flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {selectedFile && (
                      <div className="flex items-center text-sm text-green-500">
                        <Check className="h-4 w-4 mr-1" />
                        <span>
                          {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                        </span>
                      </div>
                    )}

                    {article && !selectedFile && (
                      <div className="flex items-center text-sm text-gray-400">
                        <FileText className="h-4 w-4 mr-1" />
                        <span>Current PDF: {article.pdf_url.split("/").pop()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Author, read time, date */}
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

                {/* Project fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="is_project">Project Type</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_project"
                        name="is_project"
                        defaultChecked={article?.is_project}
                        className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-purple-600 focus:ring-purple-600"
                      />
                      <Label htmlFor="is_project" className="text-sm font-normal">
                        This is a research project
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Repository and HTML data URLs */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="repository_url">Repository URL</Label>
                    <Input
                      id="repository_url"
                      name="repository_url"
                      defaultValue={article?.repository_url}
                      className="bg-gray-800 border-gray-700"
                      placeholder="https://github.com/username/repo"
                    />
                    <p className="text-xs text-gray-400">
                      Optional: Link to the public repository for this article/project
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="html_data_url">HTML Research Data URL</Label>
                    <Input
                      id="html_data_url"
                      name="html_data_url"
                      defaultValue={article?.html_data_url}
                      className="bg-gray-800 border-gray-700"
                      placeholder="https://example.com/research-data.html"
                    />
                    <p className="text-xs text-gray-400">
                      Optional: Link to HTML file with research data (for projects)
                    </p>
                  </div>
                </div>

                {/* Form buttons */}
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
        </TabsContent>

        <TabsContent value="preview">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              {/* PDF Preview would go here */}
              <div className="text-center py-12">
                <p className="text-gray-400">PDF Preview</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
