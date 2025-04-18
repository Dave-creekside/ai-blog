"use server"

import { supabaseAdmin } from "@/lib/supabase-server"

export async function runProjectMigration() {
  try {
    // Check if the is_project column already exists
    const { data: columnExists, error: checkError } = await supabaseAdmin
      .from("information_schema.columns")
      .select("column_name")
      .eq("table_name", "articles")
      .eq("column_name", "is_project")
      .maybeSingle()

    if (columnExists) {
      console.log("is_project column already exists")
      return { success: true, message: "Migration already applied" }
    }

    // Add is_project column
    const { error: addColumnError } = await supabaseAdmin.rpc("execute_sql", {
      sql_query: "ALTER TABLE articles ADD COLUMN is_project BOOLEAN DEFAULT FALSE;",
    })

    if (addColumnError) {
      console.error("Error adding is_project column:", addColumnError)
      return { success: false, error: addColumnError.message }
    }

    // Add repository_url column if it doesn't exist
    const { data: repoColumnExists } = await supabaseAdmin
      .from("information_schema.columns")
      .select("column_name")
      .eq("table_name", "articles")
      .eq("column_name", "repository_url")
      .maybeSingle()

    if (!repoColumnExists) {
      const { error: addRepoColumnError } = await supabaseAdmin.rpc("execute_sql", {
        sql_query: "ALTER TABLE articles ADD COLUMN repository_url TEXT;",
      })

      if (addRepoColumnError) {
        console.error("Error adding repository_url column:", addRepoColumnError)
        return { success: false, error: addRepoColumnError.message }
      }
    }

    // Add html_data_url column if it doesn't exist
    const { data: htmlColumnExists } = await supabaseAdmin
      .from("information_schema.columns")
      .select("column_name")
      .eq("table_name", "articles")
      .eq("column_name", "html_data_url")
      .maybeSingle()

    if (!htmlColumnExists) {
      const { error: addHtmlColumnError } = await supabaseAdmin.rpc("execute_sql", {
        sql_query: "ALTER TABLE articles ADD COLUMN html_data_url TEXT;",
      })

      if (addHtmlColumnError) {
        console.error("Error adding html_data_url column:", addHtmlColumnError)
        return { success: false, error: addHtmlColumnError.message }
      }
    }

    // Update the article_view to include the new columns
    const { error: updateViewError } = await supabaseAdmin.rpc("execute_sql", {
      sql_query: `
        CREATE OR REPLACE VIEW article_view AS
        SELECT 
          id,
          title,
          description,
          category,
          image_url,
          pdf_url,
          pdf_path,
          repository_url,
          html_data_url,
          is_project,
          published_date,
          author,
          read_time,
          created_at,
          updated_at
        FROM articles
        ORDER BY published_date DESC;
      `,
    })

    if (updateViewError) {
      console.error("Error updating article_view:", updateViewError)
      return { success: false, error: updateViewError.message }
    }

    return { success: true, message: "Migration applied successfully" }
  } catch (error) {
    console.error("Error in runProjectMigration:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
