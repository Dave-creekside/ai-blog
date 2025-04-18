export interface Article {
  id: string
  title: string
  description: string
  category: string
  image_url: string
  pdf_url: string
  pdf_path?: string
  repository_url?: string
  html_data_url?: string
  is_project?: boolean
  published_date: string
  author: string
  read_time: string
  created_at: string
  updated_at: string
}

export interface ArticleStats {
  totalArticles: number
  categoryCounts: { name: string; count: number }[]
  recentArticles: {
    id: string
    title: string
    category: string
    published_date: string
  }[]
}
