import { getCategories } from "../../actions"
import { EnhancedArticleForm } from "@/components/admin/enhanced-article-form"

export default async function NewArticlePage() {
  const categories = await getCategories()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Article</h1>
      <EnhancedArticleForm categories={categories} />
    </div>
  )
}
