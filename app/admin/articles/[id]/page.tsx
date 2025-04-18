import { getArticleById, getCategories } from "../../actions"
import { EnhancedArticleForm } from "@/components/admin/enhanced-article-form"
import { notFound } from "next/navigation"

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticleById(params.id)
  const categories = await getCategories()

  if (!article) {
    notFound()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Article</h1>
      <EnhancedArticleForm article={article} categories={categories} />
    </div>
  )
}
