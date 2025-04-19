"use server"

import { supabase } from "@/lib/supabase"
import type { Article } from "@/types/article"

export async function getArticles(): Promise<Article[]> {
  // If Supabase client is not initialized (missing env vars), return empty array
  if (!supabase) {
    console.warn("Supabase client not initialized. Check environment variables.")
    return []
  }

  const { data, error } = await supabase.from("article_view").select("*")

  if (error) {
    console.error("Error fetching articles:", error)
    return []
  }

  return data as Article[]
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  // If Supabase client is not initialized (missing env vars), return empty array
  if (!supabase) {
    console.warn("Supabase client not initialized. Check environment variables.")
    return []
  }

  const { data, error } = await supabase.from("article_view").select("*").eq("category", category)

  if (error) {
    console.error("Error fetching articles by category:", error)
    return []
  }

  return data as Article[]
}

export async function getArticleById(id: string): Promise<Article | null> {
  // If Supabase client is not initialized (missing env vars), return null
  if (!supabase) {
    console.warn("Supabase client not initialized. Check environment variables.")
    return null
  }

  const { data, error } = await supabase.from("article_view").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching article by id:", error)
    return null
  }

  return data as Article
}
