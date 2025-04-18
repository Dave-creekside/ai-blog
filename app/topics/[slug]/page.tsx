import { getArticles } from "@/app/actions/article-actions"
import { TopicSlugClientPage } from "@/components/topic-slug-client-page"

export default async function TopicPage({ params }: { params: { slug: string } }) {
  // Fetch articles on the server
  const articles = await getArticles()

  // Pass the data to a client component
  return <TopicSlugClientPage articles={articles} slug={params.slug} />
}
