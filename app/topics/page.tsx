import { getArticles } from "../actions/article-actions"
import { TopicsClientPage } from "@/components/topics-client-page"

export default async function TopicsPage() {
  // Fetch articles on the server
  const articles = await getArticles()

  // Pass the data to a client component
  return <TopicsClientPage articles={articles} />
}
