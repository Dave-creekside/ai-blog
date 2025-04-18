"use server"

import { supabase } from "@/lib/supabase"
import type { Article } from "@/types/article"

/**
 * Fetches all projects from the database
 * Uses the is_project column to filter projects
 */
export async function getProjects(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from("article_view")
      .select("*")
      .eq("is_project", true)
      .order("published_date", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return []
    }

    return data as Article[]
  } catch (error) {
    console.error("Unexpected error in getProjects:", error)
    return []
  }
}

/**
 * Fetches a specific project by ID
 */
export async function getProjectById(id: string): Promise<Article | null> {
  try {
    const { data, error } = await supabase.from("article_view").select("*").eq("id", id).eq("is_project", true).single()

    if (error) {
      console.error("Error fetching project by id:", error)
      return null
    }

    return data as Article
  } catch (error) {
    console.error("Unexpected error in getProjectById:", error)
    return null
  }
}

/**
 * Fetches projects by category
 */
export async function getProjectsByCategory(category: string): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from("article_view")
      .select("*")
      .eq("is_project", true)
      .eq("category", category)
      .order("published_date", { ascending: false })

    if (error) {
      console.error("Error fetching projects by category:", error)
      return []
    }

    return data as Article[]
  } catch (error) {
    console.error("Unexpected error in getProjectsByCategory:", error)
    return []
  }
}

/**
 * Fetches featured projects (limit to 3)
 */
export async function getFeaturedProjects(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from("article_view")
      .select("*")
      .eq("is_project", true)
      .order("published_date", { ascending: false })
      .limit(3)

    if (error) {
      console.error("Error fetching featured projects:", error)
      return []
    }

    return data as Article[]
  } catch (error) {
    console.error("Unexpected error in getFeaturedProjects:", error)
    return []
  }
}
