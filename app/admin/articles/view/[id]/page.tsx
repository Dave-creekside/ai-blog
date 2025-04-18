import { getArticleById } from "@/app/admin/actions"
import { PDFPreview } from "@/components/admin/pdf-preview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Pencil } from "lucide-react"
import { notFound } from "next/navigation"
import Image from "next/image"

export default async function ViewArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticleById(params.id)

  if (!article) {
    notFound()
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link href="/admin/articles" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold">Article Details</h1>
        </div>
        <Button asChild variant="outline">
          <Link href={`/admin/articles/${article.id}`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Article
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Article Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">{article.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs">{article.category}</span>
                  <span className="text-sm text-gray-400">{new Date(article.published_date).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Description</h3>
                <p>{article.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Author</h3>
                  <p>{article.author}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Read Time</h3>
                  <p>{article.read_time || "Not specified"}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Created At</h3>
                <p>{new Date(article.created_at).toLocaleString()}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Last Updated</h3>
                <p>{new Date(article.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Article Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-48 rounded-lg overflow-hidden border border-gray-800">
              <Image src={article.image_url || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
            </div>
            <p className="text-sm text-gray-400 mt-2 break-all">{article.image_url}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>PDF Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <PDFPreview url={article.pdf_url} file={null} title={article.title} />
        </CardContent>
      </Card>
    </div>
  )
}
