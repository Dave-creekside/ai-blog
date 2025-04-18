import { getArticles } from "../actions/article-actions"
import { ArticlesClientPage } from "@/components/articles-client-page"

export default async function ArticlesPage() {
  // Fetch articles on the server
  const articles = await getArticles()

  // Pass the data to a client component
  return <ArticlesClientPage articles={articles} />
}
