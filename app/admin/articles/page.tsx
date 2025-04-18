import { getAdminArticles } from "../actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Eye } from "lucide-react"
import { DeleteArticleButton } from "@/components/admin/delete-article-button"

export default async function ArticlesPage() {
  const articles = await getAdminArticles()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Articles</h1>
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href="/admin/articles/new">
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </Link>
        </Button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-4">Title</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Author</th>
                <th className="text-left p-4">Date</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.length > 0 ? (
                articles.map((article) => (
                  <tr key={article.id} className="border-b border-gray-800">
                    <td className="p-4">
                      <div className="font-medium">{article.title}</div>
                      <div className="text-sm text-gray-400 truncate max-w-xs">{article.description}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs">
                        {article.category}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">{article.author}</td>
                    <td className="p-4 text-gray-400">{new Date(article.published_date).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/articles/view/${article.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/articles/${article.id}`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <DeleteArticleButton id={article.id} title={article.title}>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </DeleteArticleButton>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    No articles found. Create your first article to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
