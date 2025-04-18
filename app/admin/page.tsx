import { getArticleStats } from "./actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Plus, BarChart, Clock, TrendingUp } from "lucide-react"

export default async function AdminDashboard() {
  const { totalArticles, categoryCounts, recentArticles } = await getArticleStats()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href="/admin/articles/new">
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Articles</CardTitle>
            <CardDescription>All published articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-500 mr-3" />
              <span className="text-3xl font-bold">{totalArticles}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Categories</CardTitle>
            <CardDescription>Total article categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart className="h-8 w-8 text-purple-500 mr-3" />
              <span className="text-3xl font-bold">{categoryCounts.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Latest Update</CardTitle>
            <CardDescription>Most recent article</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-500 mr-3" />
              <span className="text-lg font-medium truncate">
                {recentArticles.length > 0
                  ? new Date(recentArticles[0].published_date).toLocaleDateString()
                  : "No articles"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Top Category</CardTitle>
            <CardDescription>Most popular category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-500 mr-3" />
              <span className="text-lg font-medium">
                {categoryCounts.length > 0 ? categoryCounts.sort((a, b) => b.count - a.count)[0].name : "None"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Articles by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryCounts.length > 0 ? (
                categoryCounts.map(({ name, count }) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span>{name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-800 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-purple-500 h-2.5 rounded-full"
                          style={{ width: `${(count / totalArticles) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-400">{count}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">No categories found</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Recent Articles</CardTitle>
            <CardDescription>Latest published content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentArticles.length > 0 ? (
                recentArticles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between">
                    <div className="flex-1 truncate">
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="hover:text-purple-400 transition-colors truncate block"
                      >
                        {article.title}
                      </Link>
                      <span className="text-sm text-gray-400">{article.category}</span>
                    </div>
                    <span className="text-sm text-gray-400 ml-4">
                      {new Date(article.published_date).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">No articles found</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button asChild variant="outline">
          <Link href="/admin/articles">View All Articles</Link>
        </Button>
      </div>
    </div>
  )
}
