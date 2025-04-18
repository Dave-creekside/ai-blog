import { getArticles } from "./actions/article-actions"
import { HomeClientPage } from "@/components/home-client-page"

export default async function Home() {
  const articles = await getArticles()
  
  return <HomeClientPage articles={articles} />
}
