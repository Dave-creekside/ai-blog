"use server"

import { supabase } from "@/lib/supabase"
import type { Article } from "@/types/article"

export async function getArticles(): Promise<Article[]> {
  const { data, error } = await supabase.from("article_view").select("*")

  if (error) {
    console.error("Error fetching articles:", error)
    return []
  }

  return data as Article[]
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const { data, error } = await supabase.from("article_view").select("*").eq("category", category)

  if (error) {
    console.error("Error fetching articles by category:", error)
    return []
  }

  return data as Article[]
}

export async function getArticleById(id: string): Promise<Article | null> {
  const { data, error } = await supabase.from("article_view").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching article by id:", error)
    return null
  }

  return data as Article
}
