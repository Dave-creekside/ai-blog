"use server"

import { supabaseAdmin } from "@/lib/supabase-server"
import { uploadPDF, deletePDF, initializeStorage } from "@/lib/supabase-storage"
import { convertToRawGitHubUrl } from "@/lib/github-url"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { Article } from "@/types/article"

// Initialize storage when the server starts
// Only initialize if supabaseAdmin is available
if (supabaseAdmin) {
  initializeStorage()
}

// Update the createArticleWithFile function to include the new fields
export async function createArticleWithFile(formData: FormData) {
  // If Supabase admin client is not initialized (missing env vars), return error
  if (!supabaseAdmin) {
    console.warn("Supabase admin client not initialized. Check environment variables.")
    return { error: "Database connection not available. Check environment variables." }
  }

  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const image_url = formData.get("image_url") as string
    const author = formData.get("author") as string
    const read_time = formData.get("read_time") as string
    const published_date = formData.get("published_date") as string
    const pdf_file = formData.get("pdf_file") as File
    const repository_url = formData.get("repository_url") as string
    const html_data_url = formData.get("html_data_url") as string
    const is_project = formData.get("is_project") === "on"

    if (!title || !description || !category || !image_url || !author) {
      return { error: "All required fields must be filled" }
    }

    // Convert GitHub URLs to raw URLs
    const rawImageUrl = convertToRawGitHubUrl(image_url)

    let pdf_url = ""
    let pdf_path = ""

    // Handle PDF file upload
    if (pdf_file && pdf_file instanceof File && pdf_file.size > 0) {
      const uploadResult = await uploadPDF(pdf_file)
      if (!uploadResult) {
        return { error: "Failed to upload PDF file" }
      }
      pdf_url = uploadResult.url
      pdf_path = uploadResult.path
    } else {
      return { error: "PDF file is required" }
    }

    const { error } = await supabaseAdmin.from("articles").insert({
      title,
      description,
      category,
      image_url: rawImageUrl,
      pdf_url,
      pdf_path,
      author,
      read_time,
      published_date: published_date || new Date().toISOString().split("T")[0],
      repository_url: repository_url || null,
      html_data_url: html_data_url || null,
      is_project,
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/admin/articles")
    redirect("/admin/articles")
  } catch (error) {
    console.error("Error in createArticleWithFile:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Update the updateArticleWithFile function to include the new fields
export async function updateArticleWithFile(formData: FormData) {
  // If Supabase admin client is not initialized (missing env vars), return error
  if (!supabaseAdmin) {
    console.warn("Supabase admin client not initialized. Check environment variables.")
    return { error: "Database connection not available. Check environment variables." }
  }

  try {
    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const image_url = formData.get("image_url") as string
    const author = formData.get("author") as string
    const read_time = formData.get("read_time") as string
    const published_date = formData.get("published_date") as string
    const pdf_file = formData.get("pdf_file") as File
    const current_pdf_url = formData.get("current_pdf_url") as string
    const current_pdf_path = formData.get("current_pdf_path") as string
    const repository_url = formData.get("repository_url") as string
    const html_data_url = formData.get("html_data_url") as string
    const is_project = formData.get("is_project") === "on"

    if (!id || !title || !description || !category || !image_url || !author) {
      return { error: "All required fields must be filled" }
    }

    // Convert GitHub URLs to raw URLs
    const rawImageUrl = convertToRawGitHubUrl(image_url)

    let pdf_url = current_pdf_url
    let pdf_path = current_pdf_path

    // Handle PDF file upload if a new file is provided
    if (pdf_file && pdf_file instanceof File && pdf_file.size > 0) {
      // Delete the old PDF if it exists
      if (current_pdf_path) {
        await deletePDF(current_pdf_path)
      }

      // Upload the new PDF
      const uploadResult = await uploadPDF(pdf_file)
      if (!uploadResult) {
        return { error: "Failed to upload PDF file" }
      }
      pdf_url = uploadResult.url
      pdf_path = uploadResult.path
    }

    const { error } = await supabaseAdmin
      .from("articles")
      .update({
        title,
        description,
        category,
        image_url: rawImageUrl,
        pdf_url,
        pdf_path,
        author,
        read_time,
        published_date: published_date || new Date().toISOString().split("T")[0],
        updated_at: new Date().toISOString(),
        repository_url: repository_url || null,
        html_data_url: html_data_url || null,
        is_project,
      })
      .eq("id", id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/admin/articles")
    redirect("/admin/articles")
  } catch (error) {
    console.error("Error in updateArticleWithFile:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Keep the existing functions but update them as needed
export async function createArticle(formData: FormData) {
  // If Supabase admin client is not initialized (missing env vars), return error
  if (!supabaseAdmin) {
    console.warn("Supabase admin client not initialized. Check environment variables.")
    return { error: "Database connection not available. Check environment variables." }
  }

  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const image_url = formData.get("image_url") as string
    const pdf_url = formData.get("pdf_url") as string
    const author = formData.get("author") as string
    const read_time = formData.get("read_time") as string
    const published_date = formData.get("published_date") as string

    if (!title || !description || !category || !image_url || !pdf_url || !author) {
      return { error: "All required fields must be filled" }
    }

    // Convert GitHub URLs to raw URLs
    const rawImageUrl = convertToRawGitHubUrl(image_url)
    const rawPdfUrl = convertToRawGitHubUrl(pdf_url)

    const { error } = await supabaseAdmin.from("articles").insert({
      title,
      description,
      category,
      image_url: rawImageUrl,
      pdf_url: rawPdfUrl,
      author,
      read_time,
      published_date: published_date || new Date().toISOString().split("T")[0],
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/admin/articles")
    redirect("/admin/articles")
  } catch (error) {
    console.error("Error in createArticle:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function updateArticle(formData: FormData) {
  // If Supabase admin client is not initialized (missing env vars), return error
  if (!supabaseAdmin) {
    console.warn("Supabase admin client not initialized. Check environment variables.")
    return { error: "Database connection not available. Check environment variables." }
  }

  try {
    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const image_url = formData.get("image_url") as string
    const pdf_url = formData.get("pdf_url") as string
    const author = formData.get("author") as string
    const read_time = formData.get("read_time") as string
    const published_date = formData.get("published_date") as string

    if (!id || !title || !description || !category || !image_url || !pdf_url || !author) {
      return { error: "All required fields must be filled" }
    }

    // Convert GitHub URLs to raw URLs
    const rawImageUrl = convertToRawGitHubUrl(image_url)
    const rawPdfUrl = convertToRawGitHubUrl(pdf_url)

    const { error } = await supabaseAdmin
      .from("articles")
      .update({
        title,
        description,
        category,
        image_url: rawImageUrl,
        pdf_url: rawPdfUrl,
        author,
        read_time,
        published_date: published_date || new Date().toISOString().split("T")[0],
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/admin/articles")
    redirect("/admin/articles")
  } catch (error) {
    console.error("Error in updateArticle:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Keep the rest of the functions unchanged
export async function deleteArticle(id: string) {
  // If Supabase admin client is not initialized (missing env vars), return error
  if (!supabaseAdmin) {
    console.warn("Supabase admin client not initialized. Check environment variables.")
    return { error: "Database connection not available. Check environment variables." }
  }

  try {
    // Get the article to find the PDF path
    const { data: article, error: fetchError } = await supabaseAdmin
      .from("articles")
      .select("pdf_path")
      .eq("id", id)
      .single()

    if (fetchError) {
      return { error: fetchError.message }
    }

    // Delete the article from the database
    const { error: deleteError } = await supabaseAdmin.from("articles").delete().eq("id", id)

    if (deleteError) {
      return { error: deleteError.message }
    }

    // Delete the PDF file if it exists
    if (article?.pdf_path) {
      await deletePDF(article.pdf_path)
    }

    revalidatePath("/admin/articles")
    return { success: true }
  } catch (error) {
    console.error("Error in deleteArticle:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function getAdminArticles(): Promise<Article[]> {
  // If Supabase admin client is not initialized (missing env vars), return empty array
  if (!supabaseAdmin) {
    console.warn("Supabase admin client not initialized. Check environment variables.")
    return []
  }

  const { data, error } = await supabaseAdmin.from("articles").select("*").order("published_date", { ascending: false })

  if (error) {
    console.error("Error fetching articles:", error)
    return []
  }

  return data as Article[]
}

export async function getArticleById(id: string): Promise<Article | null> {
  // If Supabase admin client is not initialized (missing env vars), return null
  if (!supabaseAdmin) {
    console.warn("Supabase admin client not initialized. Check environment variables.")
    return null
  }

  const { data, error } = await supabaseAdmin.from("articles").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching article:", error)
    return null
  }

  return data as Article
}

export async function getCategories(): Promise<string[]> {
  // If Supabase admin client is not initialized (missing env vars), return empty array
  if (!supabaseAdmin) {
    console.warn("Supabase admin client not initialized. Check environment variables.")
    return []
  }

  const { data, error } = await supabaseAdmin.from("articles").select("category")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  // Extract unique categories
  const categories = [...new Set(data.map((item) => item.category))]
  return categories
}

export async function getArticleStats() {
  // If Supabase admin client is not initialized (missing env vars), return empty stats
  if (!supabaseAdmin) {
    console.warn("Supabase admin client not initialized. Check environment variables.")
    return { totalArticles: 0, categoryCounts: [], recentArticles: [] }
  }

  try {
    // Get total article count
    const { count: totalArticles, error: countError } = await supabaseAdmin
      .from("articles")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error getting article count:", countError)
      return { totalArticles: 0, categoryCounts: [], recentArticles: [] }
    }

    // Get category counts
    const { data: categories, error: categoryError } = await supabaseAdmin.from("articles").select("category")

    if (categoryError) {
      console.error("Error getting categories:", categoryError)
      return { totalArticles, categoryCounts: [], recentArticles: [] }
    }

    const categoryCounts = categories.reduce(
      (acc, { category }) => {
        acc[category] = (acc[category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Get recent articles
    const { data: recentArticles, error: recentError } = await supabaseAdmin
      .from("articles")
      .select("id, title, category, published_date")
      .order("published_date", { ascending: false })
      .limit(5)

    if (recentError) {
      console.error("Error getting recent articles:", recentError)
      return { totalArticles, categoryCounts, recentArticles: [] }
    }

    return {
      totalArticles,
      categoryCounts: Object.entries(categoryCounts).map(([name, count]) => ({ name, count })),
      recentArticles,
    }
  } catch (error) {
    console.error("Error in getArticleStats:", error)
    return { totalArticles: 0, categoryCounts: [], recentArticles: [] }
  }
}
